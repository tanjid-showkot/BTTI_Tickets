/** @format */

import { useCallback, useContext, useEffect, useState } from "react";
import {
  bulkDeferVerifierTicket,
  createQueueAnnouncement,
  deferVerifierTicket,
  getTodayVerifierQueue,
  hideVerifierTicket,
} from "../Api/Api";
import AuthContext from "../Context/Context";
import PropTypes from "prop-types";
import { RotateCcw, Volume2, X } from "lucide-react";

const Defer = () => {
  const { token, user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queueError, setQueueError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [announcingTicketId, setAnnouncingTicketId] = useState(null);
  const [lastCalledTicketId, setLastCalledTicketId] = useState(null);
  const [range, setRange] = useState({ start_serial: "", end_serial: "" });
  const [rollNumberInput, setRollNumberInput] = useState("");

  const assignedCenter = user?.assigned_test_center;
  const assignedCounter = user?.assigned_counter;
  const centerCode = assignedCenter?.code;
  const isWrittenCenter = assignedCenter?.name === "Written";
  const firstTicket = tickets[0];

  const loadQueue = useCallback(
    async (silent = false) => {
      if (!centerCode) {
        setTickets([]);
        setLoading(false);
        return;
      }

      if (!silent) {
        setLoading(true);
      }
      setQueueError("");
      try {
        const response = await getTodayVerifierQueue(token, centerCode);
        const data = await response.json();
        setTickets(Array.isArray(data) ? data : []);
      } catch (apiError) {
        console.log(apiError);
        setQueueError(apiError.message || "Failed to load verifier queue.");
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [centerCode, token],
  );

  useEffect(() => {
    loadQueue();

    const intervalId = window.setInterval(() => {
      loadQueue(true);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [loadQueue]);

  const runAction = async (id, action) => {
    if (activeId === id) return;
    setActiveId(id);
    setMessage("");
    setError("");
    try {
      if (action === "hide") {
        await hideVerifierTicket(token, id);
        setMessage("Ticket completed for this stage.");
      } else {
        await deferVerifierTicket(token, id);
        setMessage("Ticket deferred successfully.");
      }

      await loadQueue(true);
    } catch (apiError) {
      console.log(apiError);
      setError(apiError.message || "Action failed.");
    } finally {
      setActiveId(null);
    }
  };

  const handleBulkDefer = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await bulkDeferVerifierTicket(token, {
        start_serial: Number(range.start_serial),
        end_serial: Number(range.end_serial),
      });
      setRange({ start_serial: "", end_serial: "" });
      setMessage("Serial range deferred successfully.");
      await loadQueue(true);
    } catch (apiError) {
      console.log(apiError);
      setError(apiError.message || "Bulk defer failed.");
    }
  };

  const handleRollNumberComplete = async (event) => {
    event.preventDefault();
    const rollNumber = rollNumberInput.trim();

    setMessage("");
    setError("");

    if (!rollNumber) {
      setError("Enter roll number.");
      return;
    }

    const matchedTicket = tickets.find(
      (ticket) => String(ticket.roll_number) === rollNumber,
    );

    if (!matchedTicket) {
      setError("No ticket found for this roll number.");
      return;
    }

    await runAction(matchedTicket.id, "hide");
    setRollNumberInput("");
  };

  const handleNumpadPress = (value) => {
    setError("");
    setMessage("");

    if (value === "clear") {
      setRollNumberInput("");
      return;
    }

    if (value === "backspace") {
      setRollNumberInput((current) => current.slice(0, -1));
      return;
    }

    setRollNumberInput((current) => `${current}${value}`);
  };

  const handleAnnouncement = async (isRepeat = false) => {
    if (!firstTicket || announcingTicketId !== null) return;

    setAnnouncingTicketId(firstTicket.id);
    setError("");
    setMessage("");

    try {
      await createQueueAnnouncement(token, firstTicket.id);
      setLastCalledTicketId(firstTicket.id);
      setMessage(
        isRepeat
          ? `Announcement repeated for roll ${firstTicket.roll_number}.`
          : `Roll ${firstTicket.roll_number} called to counter ${assignedCounter.name}.`,
      );
    } catch (apiError) {
      console.log(apiError);
      setError(apiError.message || "Failed to call the ticket.");
    } finally {
      setAnnouncingTicketId(null);
    }
  };

  if (!assignedCenter) {
    return <VerifierState message='No test center assigned' />;
  }

  if (!assignedCounter) {
    return <VerifierState message='No counter assigned' />;
  }

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center text-2xl font-bold text-slate-400'>
        <p>Loading queue...</p>
      </div>
    );
  }

  return (
    <div className='p-4 pb-28 md:p-6'>
      <div className='mx-auto max-w-7xl space-y-5'>
        <div className='soft-panel p-5'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-sky-600'>
                Verifier Dashboard
              </p>
              <h1 className='mt-2 text-3xl font-black capitalize text-slate-800'>
                {assignedCenter.name} Queue
              </h1>
            </div>
            <div className='grid gap-3 sm:grid-cols-2'>
              <InfoPill label='Assigned Center' value={assignedCenter.name} />
              <InfoPill label='Assigned Counter' value={assignedCounter.name} />
            </div>
          </div>
        </div>

        <div className='soft-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='min-w-0'>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
              Current ticket
            </p>
            <p className='mt-1 truncate text-xl font-black text-slate-800'>
              {firstTicket
                ? `Roll ${firstTicket.roll_number}`
                : "No ticket available"}
            </p>
          </div>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <button
              type='button'
              disabled={
                !firstTicket || announcingTicketId !== null || activeId !== null
              }
              onClick={() => handleAnnouncement(false)}
              className='btn btn-primary min-h-11'>
              <Volume2 className='h-5 w-5' aria-hidden='true' />
              {announcingTicketId === firstTicket?.id
                ? "Calling..."
                : "Call ticket"}
            </button>
            {firstTicket && lastCalledTicketId === firstTicket.id && (
              <button
                type='button'
                disabled={announcingTicketId !== null || activeId !== null}
                onClick={() => handleAnnouncement(true)}
                className='btn btn-secondary min-h-11'>
                <RotateCcw className='h-5 w-5' aria-hidden='true' />
                Repeat announcement
              </button>
            )}
          </div>
        </div>

        {!isWrittenCenter && (
          <form
            onSubmit={handleBulkDefer}
            className='soft-panel grid gap-3 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end'>
            <label className='grid gap-2 text-sm font-semibold text-slate-700'>
              Start serial
              <input
                type='number'
                min='1'
                value={range.start_serial}
                onChange={(event) =>
                  setRange((current) => ({
                    ...current,
                    start_serial: event.target.value,
                  }))
                }
                className='input input-bordered w-full bg-white'
                required
              />
            </label>
            <label className='grid gap-2 text-sm font-semibold text-slate-700'>
              End serial
              <input
                type='number'
                min='1'
                value={range.end_serial}
                onChange={(event) =>
                  setRange((current) => ({
                    ...current,
                    end_serial: event.target.value,
                  }))
                }
                className='input input-bordered w-full bg-white'
                required
              />
            </label>
            <button type='submit' className='btn btn-primary min-h-11'>
              Bulk Defer
            </button>
          </form>
        )}

        {(error || queueError) && (
          <div
            role='alert'
            className='alert alert-error alert-soft flex items-center justify-between gap-3'>
            <span>{error || queueError}</span>
            <button
              type='button'
              aria-label='Dismiss error'
              onClick={() => {
                setError("");
                setQueueError("");
              }}
              className='btn btn-ghost btn-xs btn-circle shrink-0'>
              <X className='h-4 w-4' />
            </button>
          </div>
        )}

        {message && (
          <div
            role='alert'
            className='alert alert-success alert-soft flex items-center justify-between gap-3'>
            <span>{message}</span>
            <button
              type='button'
              aria-label='Dismiss message'
              onClick={() => setMessage("")}
              className='btn btn-ghost btn-xs btn-circle shrink-0'>
              <X className='h-4 w-4' />
            </button>
          </div>
        )}

        {isWrittenCenter && (
          <form onSubmit={handleRollNumberComplete} className='soft-panel p-4'>
            <div className='grid gap-4 lg:w-1/2 mx-auto '>
              <div className='grid gap-3'>
                <label className='grid gap-2 text-sm font-semibold text-slate-700'>
                  Roll Number
                  <input
                    type='text'
                    inputMode='none'
                    readOnly
                    value={rollNumberInput}
                    className='input input-bordered h-14 w-full bg-white text-center text-2xl font-black tracking-wide text-slate-800'
                    placeholder='Roll Number'
                  />
                </label>
                <button
                  type='submit'
                  disabled={!rollNumberInput || activeId !== null}
                  className='btn btn-success min-h-12 w-full text-lg font-black'>
                  সম্পন্ন
                </button>
              </div>

              <div className='grid grid-cols-3 gap-2'>
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((value) => (
                  <button
                    key={value}
                    type='button'
                    onClick={() => handleNumpadPress(value)}
                    className='btn btn-secondary min-h-12 text-xl font-black'>
                    {value}
                  </button>
                ))}
                <button
                  type='button'
                  onClick={() => handleNumpadPress("clear")}
                  className='btn btn-outline min-h-12 font-bold'>
                  Clear
                </button>
                <button
                  type='button'
                  onClick={() => handleNumpadPress("0")}
                  className='btn btn-secondary min-h-12 text-xl font-black'>
                  0
                </button>
                <button
                  type='button'
                  onClick={() => handleNumpadPress("backspace")}
                  className='btn btn-outline min-h-12 font-bold'>
                  Delete
                </button>
              </div>
            </div>
          </form>
        )}

        {!isWrittenCenter && (
          <div className='space-y-3'>
            {tickets.length < 1 ? (
              <div className='soft-panel py-10 text-center font-semibold text-slate-400'>
                No Tickets Available
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className='soft-card relative flex min-h-20 items-center justify-center overflow-hidden px-28 py-4 sm:px-36'>
                  <button
                    type='button'
                    disabled={activeId === ticket.id}
                    onClick={() => runAction(ticket.id, "defer")}
                    className=' btn btn-secondary btn-sm absolute bottom-0 left-0 top-0 min-h-full w-24 rounded-none rounded-l-2xl sm:w-32'>
                    অনুপুস্থিত
                  </button>
                  <div className='min-w-0 text-center'>
                    <p className='truncate text-xl font-black tracking-wide text-slate-800'>
                      {ticket.roll_number}
                    </p>
                    <p className='truncate text-sm  text-slate-800'>
                      {ticket.serial}
                    </p>
                  </div>
                  <button
                    type='button'
                    disabled={activeId === ticket.id}
                    onClick={() => runAction(ticket.id, "hide")}
                    className='btn btn-success btn-sm absolute bottom-0 right-0 top-0 min-h-full w-24 rounded-none rounded-r-2xl sm:w-32'>
                    সম্পন্ন
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoPill = ({ label, value }) => (
  <div className='rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3'>
    <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
      {label}
    </p>
    <p className='mt-1 font-black capitalize text-slate-800'>{value}</p>
  </div>
);

InfoPill.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const VerifierState = ({ message }) => (
  <div className='flex min-h-[60vh] items-center justify-center p-4'>
    <div role='alert' className='alert alert-warning max-w-lg shadow-sm'>
      <span className='font-bold'>{message}</span>
    </div>
  </div>
);

VerifierState.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Defer;
