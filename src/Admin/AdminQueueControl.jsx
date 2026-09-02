/** @format */

import { useContext, useEffect, useState } from "react";
import moment from "moment";
import {
  getTestCenters,
  getTodayAdminQueue,
  moveAdminQueueTicket,
} from "../Api/Api";
import AuthContext from "../Context/Context";

const AdminQueueControl = () => {
  const { token } = useContext(AuthContext);
  const [centers, setCenters] = useState([]);
  const [selectedCenterCode, setSelectedCenterCode] = useState("");
  const [tickets, setTickets] = useState([]);
  const [moveForm, setMoveForm] = useState({
    ticketId: "",
    target_position: "",
  });
  const [loading, setLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selectedCenter = centers.find(
    (center) => center.code === selectedCenterCode,
  );

  const loadCenters = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getTestCenters(token);
      const data = await response.json();
      const sortedCenters = Array.isArray(data)
        ? data.toSorted((a, b) => a.order - b.order)
        : [];
      setCenters(sortedCenters);
      setSelectedCenterCode(
        (current) => current || sortedCenters[0]?.code || "",
      );
    } catch (apiError) {
      setError(apiError.message || "Failed to load test centers.");
    } finally {
      setLoading(false);
    }
  };

  const loadQueue = async (centerCode = selectedCenterCode) => {
    if (!centerCode) return;
    setQueueLoading(true);
    setError("");
    try {
      const response = await getTodayAdminQueue(token, centerCode);
      const data = await response.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (apiError) {
      setError(apiError.message || "Failed to load queue.");
      setTickets([]);
    } finally {
      setQueueLoading(false);
    }
  };

  useEffect(() => {
    loadCenters();
  }, [token]);

  useEffect(() => {
    loadQueue(selectedCenterCode);
  }, [selectedCenterCode]);

  const handleMoveTicket = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await moveAdminQueueTicket(token, moveForm.ticketId, {
        center: selectedCenterCode,
        target_position: Number(moveForm.target_position),
      });
      const data = await response.json();
      setMessage(data.message || "Ticket moved successfully.");
      setMoveForm({ ticketId: "", target_position: "" });
      await loadQueue(selectedCenterCode);
    } catch (apiError) {
      setError(apiError.message || "Failed to move ticket.");
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center text-2xl font-bold text-slate-400'>
        Loading queue control...
      </div>
    );
  }

  return (
    <div className='p-4 pb-10 md:p-6'>
      <div className='mx-auto max-w-7xl space-y-5'>
        <div className='soft-panel p-5'>
          <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-sky-600'>
                Admin Queue Control
              </p>
              <h1 className='mt-2 text-3xl font-black text-slate-800'>
                Move Tickets by Position
              </h1>
            </div>
            <label className='grid gap-2 text-sm font-semibold text-slate-700 md:min-w-64'>
              Center
              <select
                value={selectedCenterCode}
                onChange={(event) => setSelectedCenterCode(event.target.value)}
                className='select select-bordered w-full bg-white'>
                {centers.map((center) => (
                  <option key={center.id} value={center.code}>
                    {center.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <form
          onSubmit={handleMoveTicket}
          className='soft-panel grid gap-3 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end'>
          <label className='grid gap-2 text-sm font-semibold text-slate-700'>
            Ticket id
            <input
              type='number'
              min='1'
              value={moveForm.ticketId}
              onChange={(event) =>
                setMoveForm((current) => ({
                  ...current,
                  ticketId: event.target.value,
                }))
              }
              className='input input-bordered w-full bg-white'
              required
            />
          </label>
          <label className='grid gap-2 text-sm font-semibold text-slate-700'>
            Target position
            <input
              type='number'
              min='1'
              value={moveForm.target_position}
              onChange={(event) =>
                setMoveForm((current) => ({
                  ...current,
                  target_position: event.target.value,
                }))
              }
              className='input input-bordered w-full bg-white'
              required
            />
          </label>
          <button type='submit' className='btn btn-primary min-h-11'>
            Move Ticket
          </button>
        </form>

        {(error || message) && (
          <div
            role='alert'
            className={`alert alert-soft ${error ? "alert-error" : "alert-success"}`}>
            <span>{error || message}</span>
          </div>
        )}

        <div className='soft-panel mb-10 overflow-hidden'>
          <div className='border-b border-sky-100 p-5'>
            <h2 className='text-xl font-black capitalize text-slate-800'>
              {selectedCenter?.name || selectedCenterCode} Queue
            </h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='table admin-workflow-table min-w-full'>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Ticket</th>
                  <th>Roll</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th className='text-right'>Move</th>
                </tr>
              </thead>
              <tbody>
                {queueLoading ? (
                  <tr>
                    <td
                      colSpan='6'
                      className='py-10 text-center font-semibold text-slate-400'>
                      Loading queue...
                    </td>
                  </tr>
                ) : tickets.length < 1 ? (
                  <tr>
                    <td
                      colSpan='6'
                      className='py-10 text-center font-semibold text-slate-400'>
                      No tickets in this center queue
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket, index) => (
                    <tr key={ticket.id}>
                      <td className='font-bold text-slate-700'>{index + 1}</td>
                      <td>
                        <div className='font-black text-slate-800'>
                          {ticket.ticket_serial}
                        </div>
                        <div className='text-xs text-slate-500'>
                          ID: {ticket.id} | Serial: {ticket.serial ?? "N/A"}
                        </div>
                      </td>
                      <td>{ticket.roll_number}</td>
                      <td>{ticket.ticket_type}</td>
                      <td>
                        {ticket.date
                          ? moment(ticket.date).format("DD/MM/YYYY h:mm a")
                          : "N/A"}
                      </td>
                      <td className='text-right'>
                        <button
                          type='button'
                          onClick={() =>
                            setMoveForm((current) => ({
                              ...current,
                              ticketId: String(ticket.id),
                            }))
                          }
                          className='btn btn-secondary btn-sm'>
                          Select
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQueueControl;
