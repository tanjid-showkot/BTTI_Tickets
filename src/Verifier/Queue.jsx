/** @format */

import { useContext, useEffect, useState } from "react";
import { getTodayVerifierQueue } from "../Api/Api";
import AuthContext from "../Context/Context";

const Queue = () => {
  const { token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError(apiError.message || "Failed to load verifier queue.");
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

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center text-2xl font-bold text-slate-400'>
        <p>Loading queue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 md:p-6'>
        <div className='mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-600'>
          {error}
        </div>
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
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className='soft-card flex min-h-[84px] items-center justify-center border-sky-100 bg-white px-2 py-4 text-center'>
            <p className='text-base font-black tracking-wide text-slate-800'>
              {ticket.ticket_serial}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;
