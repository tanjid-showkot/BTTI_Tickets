/** @format */

import { useContext, useEffect, useRef, useState } from "react";
import {
  createTicket,
  deleteTicket,
  editTicketSetting,
  getTickets,
  getTicketSetting,
  updateTicketStatus,
} from "../Api/Api";
import AuthContext from "../Context/Context";
import { FaTrashCan } from "react-icons/fa6";

const ManageTicket = () => {
  const { token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [id, setId] = useState(null);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [header, setHeader] = useState("");
  const [title, setTitle] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isHeaderEditing) {
      inputRef.current?.focus();
    }
  }, [isHeaderEditing]);

  useEffect(() => {
    if (isTitleEditing) {
      inputRef.current?.focus();
    }
  }, [isTitleEditing]);

  const handleDoubleClick = () => {
    setIsHeaderEditing(true);
    // setTimeout(() => inputRef.current?.focus(), 0); // Focus input after render
  };

  const handleDoubleClickTitle = () => {
    setIsTitleEditing(true);
    // setTimeout(() => inputRef.current?.focus(), 0); // Focus input after render
  };

  useEffect(() => {
    getTicket();
    getTicketSettings();
  }, []);

  const getTicketSettings = async () => {
    try {
      await getTicketSetting(token)
        .then((res) => res.json())
        .then((data) => {
          setHeader(data.header);
          setTitle(data.title);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getTicket = async () => {
    try {
      await getTickets(token)
        .then((res) => res.json())
        .then((data) => {
          setTickets(data);
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === id ? { ...ticket, status: updatedStatus } : ticket
        )
      );
      await updateTicketStatus(token, id, { status: updatedStatus });
    } catch (error) {
      console.error("Error updating ticket status:", error);
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === id ? { ...ticket, status: currentStatus } : ticket
        )
      );
    }
  };

  const handleDelete = async () => {
    console.log(id);
    try {
      await deleteTicket(token, id);
      getTicket();
      document.getElementById("my_modal_4").close();
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleCreateTicket = async () => {
    if (!type || !amount) {
      setError("Please fill in all the fields");
      return;
    }
    try {
      await createTicket(token, { type, amount });
      getTicket();
      setType("");
      setAmount("");
      document.getElementById("my_modal_3").close();
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
    console.log(type, amount);
  };
  const handleEditTicket = async () => {
    if (!header || !title) {
      setError("Header and Title can not leave empty.");
      return;
    }
    const data = {
      header,
      title,
    };
    try {
      await editTicketSetting(token, data);
      getTicketSettings();
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };
  return (
    <div>
      <h1 className='text-3xl lg:text-3xl font-bold m-4 '>Manage Tickets</h1>
      <div className='flex gap-4 justify-end me-4'>
        <button
          onClick={() => document.getElementById("my_modal_3").showModal()}
          className='btn btn-primary  '>
          Create New Ticket
        </button>
        <button
          onClick={() => {
            setError("");
            document.getElementById("my_modal_5").showModal();
          }}
          className='btn btn-info'>
          Manage Receipt
        </button>
      </div>
      <div>
        <h2 className='text-2xl font-bold m-4'>Active Tickets</h2>
      </div>
      <div>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className='flex justify-between m-4 border border-base-content/15 p-4'>
            <div>
              <strong>Ticket Name </strong>
              <p className='font-semibold'>{ticket.type}</p>
            </div>
            <div>
              <strong>Price </strong>
              <p className='font-semibold text-center '>
                {Number(ticket.amount)}
              </p>
            </div>
            <div className='flex flex-col items-center'>
              <strong>Status </strong>
              <input
                type='checkbox'
                checked={ticket.status}
                onChange={() => handleToggle(ticket.id, ticket.status)}
                className='toggle border-error bg-error checked:bg-success checked:text-green-950 checked:border-success'
              />
            </div>
            <div className='flex items-center  gap-2'>
              <button
                onClick={() => {
                  setId(ticket.id);
                  document.getElementById("my_modal_4").showModal();
                }}
                className=' text-2xl btn btn-circle text-red-700 btn-ghost'>
                <FaTrashCan />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      <dialog id='my_modal_3' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Create A New Ticket</h3>

          <form>
            <div className='grid gap-2'>
              <label htmlFor='type'>Ticket Type</label>
              <input
                type='text'
                id='type'
                value={type}
                onFocus={() => setError(null)}
                onChange={(e) => setType(e.target.value)}
                className='input input-bordered'
                placeholder='Enter ticket type'
              />
            </div>
            <div className='grid mt-2 gap-2'>
              <label htmlFor='amount'>Ticket Amount</label>
              <input
                type='number'
                value={amount}
                onFocus={() => setError(null)}
                onChange={(e) => setAmount(e.target.value)}
                id='amount'
                className='input input-bordered'
                placeholder='Enter ticket amount'
              />
            </div>
            {error && (
              <div className='text-error w-[65%] text-center bg-rose-100 py-2 rounded-lg m-3'>
                {error}
              </div>
            )}

            <div className='flex mt-4 justify-end gap-2'>
              <button
                type='button'
                onClick={() => {
                  document.getElementById("my_modal_3").close();
                }}
                className='btn btn-outline'>
                Cancel
              </button>
              <button
                type='button'
                onClick={() => {
                  handleCreateTicket();
                }}
                className='btn btn-primary'>
                Create Ticket
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <dialog id='my_modal_4' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Are you sure? </h3>
          <p className='py-4 text-sm lg:text-base'>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our systems.
          </p>
          <div className='modal-action'>
            <form method='dialog flex justify-end '>
              {/* if there is a button in form, it will close the modal */}
              <button
                type='button'
                onClick={() => document.getElementById("my_modal_4").close()}
                className='btn btn-outline me-4'>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                type='button'
                className='btn btn-error'>
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold mb-5 text-lg'>Receipt Template</h3>

          <div className='flex h-[400px]  w-full items-center justify-center bg-gray-600'>
            <div
              className='relative w-80 rounded bg-gray-50 px-6 pt-8 shadow-lg'
              style={{
                "--mask":
                  "linear-gradient(0,#0000 8px,#000 0) 0 4px, radial-gradient(4px,#000 calc(100% - 1px),#0000) 50%/7.4px 8px repeat space",
                WebkitMask: "var(--mask)",
                mask: "var(--mask)",
              }}>
              {/* <div className='absolute  left-0 w-full  bg-gray-50 clip-paper'></div> */}

              <div className='flex flex-col justify-center items-center gap-2'>
                {/* <h4 className='font-semibold text-[14px]/3 text-center'>
                  বিআরটিসি তেজগাঁও ট্রেনিং ইন্সটিটিউট
                </h4> */}
                <div className='inline-block  cursor-pointer '>
                  {isHeaderEditing ? (
                    <input
                      ref={inputRef}
                      type='text'
                      onFocus={() => setError("")}
                      value={header}
                      onChange={(e) => setHeader(e.target.value)}
                      onBlur={() => setIsHeaderEditing(false)}
                      className='input-neutral min-w-[300px] text-center  w-full bg-transparent'
                    />
                  ) : (
                    <p
                      onClick={handleDoubleClick}
                      className='font-semibold text-[14px]/5 text-center'>
                      {header}
                    </p>
                  )}
                </div>
                <div className='inline-block  cursor-pointer '>
                  {isTitleEditing ? (
                    <input
                      ref={inputRef}
                      type='text'
                      value={title}
                      onFocus={() => setError("")}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={() => setIsTitleEditing(false)}
                      className='input-neutral min-w-[300px] text-center  w-full bg-transparent'
                    />
                  ) : (
                    <p
                      onClick={handleDoubleClickTitle}
                      className='font-semibold  text-[14px]/5 text-center'>
                      {title}
                    </p>
                  )}
                </div>
                {/* <p className='text-base/5 font-bold text-center'>
                  বিআরটিএ ড্রাইভিং টেস্টের জন্যে স্থাপনা,ক্লাসরুম এবং গাড়ি
                  ব্যবহার
                </p> */}
                <p className='text-base/4 font-semibold text-center'>
                  তারিখঃ ২/২২/২০২৫
                </p>
                <p className='text-base/4 font-semibold text-center'>
                  সময়ঃ ৭ঃ২৮ঃ০৪ PM
                </p>
                <p className='text-xl/4 font-bold text-center'>ফিঃ ৩০০ টাকা</p>
                <p className='text-xl/4 font-black text-center'>FT-A০০১</p>
                <p className='text-base/4 font-semibold text-center'>
                  রোল নংঃ ০০৯১
                </p>
                <p className='text-base/4 font-semibold text-center'>
                  নামঃ মোঃ শাহিন আহমেদ
                </p>
                <p className='text-base/4 font-semibold text-center'>
                  ধরনঃ মাঝারী ও মোটরসাইকেল
                </p>
                <p className='text-base/4 mb-3 font-semibold text-center'>
                  Developed By: XELOTEK
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className='text-error text-center bg-rose-100 py-2 rounded-lg m-3'>
              {error}
            </div>
          )}
          <div className='modal-action'>
            <form method='dialog'>
              {/* if there is a button in form, it will close the modal */}
              <button
                type='button'
                onClick={() => {
                  handleEditTicket();
                }}
                className='btn btn-info me-4'>
                Save
              </button>
              <button
                type='button'
                onClick={() => {
                  handleEditTicket();
                  document.getElementById("my_modal_5").close();
                }}
                className='btn btn-accent'>
                Save and Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ManageTicket;
