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
          : [...prevSelected, id] // Add if not selected
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
            data.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
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
    <div>
      <h1 className='text-3xl lg:text-4xl font-bold m-4 '>Approve Refund</h1>
      <div>
        <div className=' ms-4 '>
          <p>
            Total Request to Approve: <strong>{approval.length}</strong>{" "}
          </p>
          <p>
            Total Refunded Amount: <strong>{Number(refundAmount)}</strong>{" "}
          </p>
        </div>
        <div
          className={`${
            selectedItems.length > 1 ? "flex" : "hidden"
          } justify-end gap-2 mt-3 lg:me-12 me-3`}>
          <button
            onClick={handleBulkApprove}
            className='btn btn-outline text-success '>
            Approve All
          </button>
          <button
            onClick={handleBulkReject}
            className='btn btn-outline text-error'>
            Reject All
          </button>
        </div>
        <div className='m-4 flex justify-center '>
          <div className=' w-full  rounded-box border border-base-content/5 bg-base-100'>
            <div className=' overflow-x-auto'>
              <table className='table font-semibold text-lg text-center '>
                {/* head */}
                <thead>
                  <tr>
                    <th>
                      <input
                        type='checkbox'
                        className=' checkbox checkbox-info'
                        onChange={handleSelectAll}
                        checked={selectedItems.length === approval.length}
                      />
                    </th>

                    <th>Roll No</th>
                    <th>Ticket Id</th>
                    <th>Ticket No</th>
                    <th>Sold By</th>
                    <th>Refunded By</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {approval.map((approve) => (
                    <tr key={approve.id}>
                      <th>
                        <input
                          type='checkbox'
                          className=' checkbox checkbox-info'
                          checked={selectedItems.includes(approve.id)}
                          onChange={() => handleCheckboxChange(approve.id)}
                        />
                      </th>

                      <td>{approve.roll_number}</td>
                      <td>{approve.id}</td>
                      <td> {approve.ticket_serial} </td>
                      <td className=' capitalize'> {approve.accountant} </td>
                      <td className=' capitalize'>
                        {" "}
                        {approve.refund_verifier}{" "}
                      </td>
                      <td> {Number(approve.amount)} </td>
                      <td className=' flex justify-center items-center flex-row gap-2'>
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
    </div>
  );
};

export default RefundApproval;
