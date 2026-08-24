/** @format */

import { useContext, useEffect, useRef, useState } from "react";
import { bulkDeleteSoldTickets, bulkDeleteSoldTicketsCount } from "../Api/Api";
import AuthContext from "../Context/Context";
import moment from "moment/moment";
import { DayPicker } from "react-day-picker";
import { useForm } from "react-hook-form";

const BulkRemove = () => {
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [bulkAmount, setBulkAmount] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [soldTicket, setSoldTicket] = useState("");
  const { token } = useContext(AuthContext);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const { handleSubmit, register, reset } = useForm();

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getSoldTicketCount = async (dates) => {
    setDate(dates);
    const data = { date: moment(dates).format("YYYY-MM-D") };

    try {
      await bulkDeleteSoldTicketsCount(token, data)
        .then((res) => res.json())
        .then((data) => {
          setSoldTicket(data);
          setShowPicker(false);
        });
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };
  const deleteSoldTicketCount = async () => {
    try {
      await bulkDeleteSoldTickets(token, bulkAmount)
        .then((res) => res.json())
        .then((data) => {
          setSuccess(data.message);
          getSoldTicketCount(date);
          document.getElementById("my_modal_5").close();
        });
    } catch (error) {
      setError(error.message);
      console.log(error.message);
      document.getElementById("my_modal_5").close();
    }
  };

  const handleDeleteSoldTicketCount = async (data) => {
    setError("");
    setSuccess("");
    const value = {
      date: moment(date).format("YYYY-MM-D"),
      delete_count: data.count,
    };
    setBulkAmount(value);
    reset();
    if (Number(data.count) > Number(soldTicket.count)) {
      setError(
        "You cannot enter a value greater than the total number of sold tickets.",
      );
      return;
    }

    document.getElementById("my_modal_5").showModal();
  };

  return (
    <div className='lg:p-12 m-5  '>
      <div className='bg-neutral-50 lg:p-10 lg:w-[50%] w-[90%]  p-3  rounded-2xl  mx-auto '>
        <p className='text-xl font-bold'> Bulk Delete</p>

        <fieldset className='fieldset w-full  relative'>
          <legend className='fieldset-legend'>Select Date</legend>
          <input
            type='text'
            readOnly
            value={date ? moment(date).format("YYYY-MM-D") : ""}
            onClick={() => setShowPicker(!showPicker)}
            placeholder='Select Date'
            className='input min-w-full input-info '
          />

          {showPicker && (
            <div
              ref={pickerRef}
              className='absolute  top-full left-0  z-10 mt-2 bg-white shadow-lg  '>
              <DayPicker
                mode='single'
                className='react-day-picker  '
                onSelect={getSoldTicketCount}
                classNames={{
                  today: `border-blue-500`, // Add a border to today's date
                  selected: `bg-amber-500 border-amber-500 text-white`, // Highlight the selected day
                }}
              />
            </div>
          )}
        </fieldset>
        <div className='py-3 ms-4 text-2xl font-extrabold text-gray-500 '>
          {soldTicket && (
            <p>
              Total Sold Ticket:{" "}
              <strong className='text-black'>{soldTicket.count}</strong>{" "}
            </p>
          )}
        </div>
        <form
          className='flex flex-col justify-center mb-10 '
          onSubmit={handleSubmit(handleDeleteSoldTicketCount)}
          action=''>
          <input
            type='number'
            {...register("count")}
            className='input w-full input-primary my-4'
            required
            placeholder='Enter a number less than total sold tickets'
          />

          {error && (
            <div className='text-error text-center bg-rose-100 py-2 rounded-lg m-3'>
              {error}
            </div>
          )}
          {success && (
            <div className='text-success text-center bg-emerald-200 py-2 rounded-lg m-3'>
              {success}
            </div>
          )}

          <input
            value={"Delete"}
            type='submit'
            className='btn mt-4 btn-primary'
          />
        </form>
      </div>
      <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg pb-4'>Bulk Delete</h3>
          <p className='textarea-lg font-semibold '>
            Date:{" "}
            <strong>{moment(bulkAmount.date).format("MMM Do YYYY")}</strong>
          </p>
          <div className=' border rounded-2xl  border-gray-50 p-2'>
            <p className='text-xl font-bold'>
              <span className=' text-zinc-500'>Total Sold Ticket:</span>{" "}
              <strong className='ps-12'>{soldTicket.count}</strong>{" "}
            </p>
            <p className='text-xl font-bold'>
              <span className=' text-zinc-500'>Total Deleted Ticket:</span>{" "}
              <strong className='ps-4'>{bulkAmount.delete_count}</strong>{" "}
            </p>
            <div className='border w-[60%]'></div>
            <p className='text-xl font-bold'>
              <span className=' text-zinc-800'>Remaining Ticket:</span>{" "}
              <strong className='ps-10'>
                {soldTicket.count - bulkAmount.delete_count}
              </strong>{" "}
            </p>
          </div>
          <div className='p-2 rounded-2xl bg-rose-50'>
            <h1 className='font-bold  '>Caution!!!</h1>
            <p className='font-semibold  '>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </p>
          </div>

          <div className='modal-action'>
            <form method='dialog flex justify-end '>
              {/* if there is a button in form, it will close the modal */}
              <button
                type='button'
                onClick={() => document.getElementById("my_modal_5").close()}
                className='btn btn-outline me-4'>
                Cancel
              </button>
              <button
                onClick={deleteSoldTicketCount}
                type='button'
                className='btn btn-error'>
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default BulkRemove;
