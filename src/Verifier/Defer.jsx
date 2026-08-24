/** @format */

import { useContext, useEffect, useState } from "react";
import {
  deferVerifierTicket,
  getTodayVerifierQueue,
  hideVerifierTicket,
} from "../Api/Api";
import AuthContext from "../Context/Context";

const SWIPE_THRESHOLD = 70;

const Defer = () => {
  const { token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState(null);

  const loadQueue = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError("");
    try {
      const response = await getTodayVerifierQueue(token);
      const data = await response.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (apiError) {
      console.log(apiError);
      setError(apiError.message || "Failed to load defer list.");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadQueue();

    const intervalId = setInterval(() => {
      loadQueue(true);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [token]);

  const runAction = async (id, action) => {
    if (activeId === id) return;
    setActiveId(id);
    try {
      if (action === "hide") {
        await hideVerifierTicket(token, id);
      } else {
        await deferVerifierTicket(token, id);
      }

      // Always re-fetch latest queue from server after every action.
      await loadQueue(true);
    } catch (apiError) {
      console.log(apiError);
      setError(apiError.message || "Action failed.");
    } finally {
      setActiveId(null);
    }
  };

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center text-2xl font-bold text-slate-400'>
        <p>Loading defer list...</p>
      </div>
    );
  }

  if (tickets.length < 1) {
    return (
      <div className='flex h-screen items-center justify-center text-2xl font-bold text-slate-400'>
        <p>No Tickets Available</p>
      </div>
    );
  }

  return (
    <div className='p-4 md:p-6'>
      <div className='mb-5 rounded-[1.5rem] border border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50 p-5 shadow-[0_18px_40px_-30px_rgba(37,99,235,0.45)]'>
        <p className='text-center text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
          Swipe To Process
        </p>
        <p className='mt-2 text-center text-sm font-semibold text-slate-600'>
          Left swipe: Hide, Right swipe: Defer
        </p>
      </div>

      {error && (
        <div className='mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-sm font-semibold text-rose-600'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 gap-3'>
        {tickets.map((ticket) => (
          <SwipeTicketRow
            key={ticket.id}
            ticket={ticket}
            disabled={activeId === ticket.id}
            onHide={() => runAction(ticket.id, "hide")}
            onDefer={() => runAction(ticket.id, "defer")}
          />
        ))}
      </div>
    </div>
  );
};

const SwipeTicketRow = ({ ticket, onHide, onDefer, disabled }) => {
  const [dragX, setDragX] = useState(0);
  const [startPoint, setStartPoint] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (event) => {
    if (disabled) return;
    setIsDragging(true);
    setStartPoint({ x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isDragging || !startPoint) return;
    const deltaX = event.clientX - startPoint.x;
    const deltaY = event.clientY - startPoint.y;

    // Ignore mostly vertical drags so normal page scrolling still feels natural.
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      setDragX(0);
      return;
    }

    setDragX(deltaX);
  };

  const finalizeSwipe = (deltaX) => {
    if (deltaX <= -SWIPE_THRESHOLD) {
      onHide();
      return;
    }

    if (deltaX >= SWIPE_THRESHOLD) {
      onDefer();
    }
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    finalizeSwipe(dragX);
    setIsDragging(false);
    setStartPoint(null);
    setDragX(0);
  };

  const onPointerCancel = () => {
    setIsDragging(false);
    setStartPoint(null);
    setDragX(0);
  };

  const swipeStateClass =
    dragX <= -SWIPE_THRESHOLD
      ? "border-rose-300 bg-rose-50"
      : dragX >= SWIPE_THRESHOLD
        ? "border-emerald-300 bg-emerald-50"
        : "border-sky-100 bg-white";

  const swipeHint =
    dragX <= -SWIPE_THRESHOLD
      ? "Release to Hide"
      : dragX >= SWIPE_THRESHOLD
        ? "Release to Defer"
        : disabled
          ? "Processing..."
          : "Swipe";

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      className={`soft-card flex items-center justify-between gap-3 p-4 transition ${swipeStateClass}`}
      style={{
        transform: `translateX(${dragX * 0.25}px)`,
        touchAction: "pan-y",
      }}>
      <div>
        <p className='text-lg font-black tracking-wide text-slate-800'>
          {ticket.ticket_serial}
        </p>
      </div>
      <div className='text-right text-xs font-semibold text-slate-400'>
        {swipeHint}
      </div>
    </div>
  );
};

export default Defer;
