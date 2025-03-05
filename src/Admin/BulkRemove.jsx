/** @format */

import { useContext, useEffect, useRef, useState } from "react";
import { bulkDeleteSoldTickets, bulkDeleteSoldTicketsCount } from "../Api/Api";
import AuthContext from "../Context/Context";
import moment from "moment/moment";
import { DayPicker } from "react-day-picker";
import { useForm } from "react-hook-form";

const BulkRemove = () => {
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
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
    setError("");
    setSuccess("");
    console.log(dates);
    setDate(dates);
    const data = { date: moment(dates).format("YYYY-MM-D") };
    console.log(data);
    try {
      await bulkDeleteSoldTicketsCount(token, data)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setSoldTicket(data);
        });
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };
  const deleteSoldTicketCount = async (data) => {
    setError("");
    setSuccess("");
    console.log(data);
    const value = {
      date: moment(date).format("YYYY-MM-D"),
      delete_count: data.count,
    };
    console.log(value);
    if (Number(data.count) > Number(soldTicket.count)) {
      setError(
        "You cannot enter a value greater than the total number of sold tickets."
      );
      return;
    }

    try {
      await bulkDeleteSoldTickets(token, value)
        .then((res) => res.json())
        .then((data) => {
          setSuccess(data.message);
          reset();
        });
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  return (
    <div className='lg:p-12 m-5  '>
      <div className='bg-blue-100 lg:p-10 lg:w-[50%] w-[90%]  p-3  rounded-2xl  mx-auto '>
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
              className='absolute  top-full left-0  z-10 mt-2 bg-white shadow-lg border p-2'>
              <DayPicker
                mode='single'
                className='react-day-picker shadow-lg p-5  '
                selected={date}
                onSelect={getSoldTicketCount}
                classNames={{
                  today: `fill-green-500 bg-green-500 rounded-full text-base text-white font-bold `,
                  chevron: "w-6 h-6 fill-green-500", // Chevron (arrow) color
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
          onSubmit={handleSubmit(deleteSoldTicketCount)}
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
            type='submit'
            value={"Delete"}
            className='btn mt-4 btn-primary'
          />
        </form>
      </div>
    </div>
  );
};

export default BulkRemove;
