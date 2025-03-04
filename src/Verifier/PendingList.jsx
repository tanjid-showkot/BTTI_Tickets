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
      <div className='flex justify-center items-center h-screen text-2xl font-bold text-gray-400'>
        <p>No Tickets Available</p>
      </div>
    );
  }

  return (
    <div>
      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr className='bg-base-200'>
              <th></th>
              <th>Roll No.</th>
              <th>Serial</th>
              <th>Amount</th>
              <th>Sold By</th>
            </tr>
          </thead>
          <tbody>
            {pendingTickets.map((ticket, index) => (
              <tr key={ticket.id}>
                <th> {index + 1} </th>
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
  );
};

export default PendingList;
