/** @format */

import { useContext, useEffect, useState } from "react";
import {
  adminApproval,
  adminRefundApprove,
  adminRefundBulkApprove,
  adminRefundBulkReject,
  adminRefundReject,
} from "../Api/Api";
import AuthContext from "../Context/Context";
// import { FcApproval } from "react-icons/fc";
import { RxCrossCircled } from "react-icons/rx";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const RefundApproval = () => {
  const { token } = useContext(AuthContext);
  const [approval, setApproval] = useState([]);
  const [refundAmount, setRefundAmount] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  // Handle selecting/deselecting an individual row
  const handleCheckboxChange = (id) => {
    setSelectedItems(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((item) => item !== id) // Remove if already selected
          : [...prevSelected, id], // Add if not selected
    );
  };

  // Handle selecting/deselecting all rows
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(approval.map((item) => item.id)); // Select all IDs
    } else {
      setSelectedItems([]); // Deselect all
    }
  };

  useEffect(() => {
    fetchApproval();
  }, []);
  const fetchApproval = async () => {
    try {
      await adminApproval(token)
        .then((res) => res.json())
        .then((data) => {
          setApproval(data);

          setRefundAmount(
            data.reduce((sum, d) => sum + (Number(d.amount) || 0), 0),
          );
          console.log(data);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSingleApprove = async (id) => {
    try {
      await adminRefundApprove(token, { id: id });
      fetchApproval();
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleSingleReject = async (id) => {
    try {
      await adminRefundReject(token, { id: id });
      fetchApproval();
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleBulkApprove = async () => {
    try {
      await adminRefundBulkApprove(token, { ticket_ids: selectedItems });
      fetchApproval();
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleBulkReject = async () => {
    console.log(selectedItems);
    try {
      await adminRefundBulkReject(token, { ticket_ids: selectedItems });
      fetchApproval();
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='p-4 md:p-6'>
      <h1 className='m-4 text-3xl font-black text-slate-800 lg:text-4xl'>
        Approve Refund
      </h1>
      <div className='mb-5 rounded-[1.5rem] border border-sky-100 bg-white p-4 shadow-[0_18px_42px_-32px_rgba(37,99,235,0.35)]'>
        <div className='flex flex-col gap-1 text-slate-600 md:flex-row md:items-center md:gap-6'>
          <p>
            Total Request to Approve:{" "}
            <strong className='text-slate-800'>{approval.length}</strong>{" "}
          </p>
          <p>
            Total Refunded Amount:{" "}
            <strong className='text-slate-800'>
              {Number(refundAmount)}
            </strong>{" "}
          </p>
        </div>
      </div>
      <div
        className={`${
          selectedItems.length > 1 ? "flex" : "hidden"
        } justify-end gap-2 mt-3 lg:me-12 me-3`}>
        <button onClick={handleBulkApprove} className='app-btn app-btn-primary'>
          Approve All
        </button>
        <button
          onClick={handleBulkReject}
          className='app-btn app-btn-secondary'>
          Reject All
        </button>
      </div>
      <div className='m-4 flex justify-center'>
        <div className='w-full overflow-hidden rounded-[1.5rem] border border-sky-100 bg-white shadow-[0_18px_48px_-34px_rgba(37,99,235,0.35)]'>
          <div className='overflow-x-auto'>
            <table className='minimal-table table w-full text-center text-lg font-semibold text-slate-700'>
              <thead>
                <tr>
                  <th>
                    <input
                      type='checkbox'
                      className='checkbox checkbox-info'
                      onChange={handleSelectAll}
                      checked={selectedItems.length === approval.length}
                    />
                  </th>

                  <th>Roll No</th>
                  <th>Ticket Id</th>
                  <th>Ticket No</th>
                  <th>Sold By</th>
                  <th>Refunded By</th>
                  <th>Refunded Cause</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {approval.map((approve) => (
                  <tr key={approve.id}>
                    <th>
                      <input
                        type='checkbox'
                        className='checkbox checkbox-info'
                        checked={selectedItems.includes(approve.id)}
                        onChange={() => handleCheckboxChange(approve.id)}
                      />
                    </th>

                    <td>{approve.roll_number}</td>
                    <td>{approve.id}</td>
                    <td> {approve.ticket_serial} </td>
                    <td className='capitalize'> {approve.accountant} </td>
                    <td className='capitalize'> {approve.refund_verifier} </td>
                    <td className='capitalize'> {approve.refund_reason} </td>
                    <td> {Number(approve.amount)} </td>
                    <td className='flex flex-row items-center justify-center gap-2'>
                      <button
                        onClick={() => handleSingleApprove(approve.id)}
                        className='btn btn-circle text-2xl text-green-600'>
                        <IoCheckmarkCircleOutline />
                      </button>
                      <button
                        onClick={() => handleSingleReject(approve.id)}
                        className='btn btn-circle text-2xl text-red-600'>
                        <RxCrossCircled />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundApproval;
