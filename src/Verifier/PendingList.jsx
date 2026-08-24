/** @format */

import moment from "moment/moment";
import { getPendingRefundTicket } from "../Api/Api";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Context/Context";

const PendingList = () => {
  const date = moment().format("D/M/YYYY");
  const [pendingTickets, setPendingTickets] = useState([]);
  const { token } = useContext(AuthContext);
  useEffect(() => {
    getPendingTickets();
  }, []);
  const getPendingTickets = async () => {
    try {
      await getPendingRefundTicket(token, date)
        .then((res) => res.json())
        .then((data) => {
          setPendingTickets(data);
        });
    } catch (error) {
      console.log(error);
    }
  };
  if (pendingTickets.length < 1) {
    return (
      <div className='flex h-screen items-center justify-center text-2xl font-bold text-slate-400'>
        <p>No Tickets Available</p>
      </div>
    );
  }

  return (
    <div className='p-4 md:p-6'>
      <div className='mb-5 rounded-[1.5rem] border border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50 p-5 shadow-[0_18px_40px_-30px_rgba(37,99,235,0.45)]'>
        <div className='flex flex-col gap-4 text-center sm:flex-row sm:justify-around'>
          <div className='rounded-2xl bg-white/80 px-6 py-4'>
            <p className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Ticket Count
            </p>
            <strong className='mt-2 block text-3xl text-blue-600'>
              {pendingTickets.length}
            </strong>
          </div>
          <div className='rounded-2xl bg-white/80 px-6 py-4'>
            <p className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Ticket Amount
            </p>
            <strong className='mt-2 block text-3xl text-blue-600'>
              {Number(
                pendingTickets.reduce((sum, ticket) => sum + ticket.amount, 0),
              )}
            </strong>
          </div>
        </div>
      </div>
      <div className='overflow-hidden rounded-[1.5rem] border border-sky-100 bg-white shadow-[0_18px_48px_-34px_rgba(37,99,235,0.35)]'>
        <div className='overflow-x-auto'>
          <table className='minimal-table table w-full'>
            <thead>
              <tr>
                <th>#</th>
                <th>Roll No.</th>
                <th>Serial</th>
                <th>Amount</th>
                <th>Sold By</th>
              </tr>
            </thead>
            <tbody>
              {pendingTickets.map((ticket, index) => (
                <tr key={ticket.id}>
                  <th>{index + 1}</th>
                  <td>{ticket.roll_number}</td>
                  <td>{ticket.ticket_serial}</td>
                  <td>{Number(ticket.amount)}</td>
                  <td>{ticket.accountant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingList;
