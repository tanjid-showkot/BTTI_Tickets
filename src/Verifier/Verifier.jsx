/** @format */

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { getVerifyTicket, postRefundTicket, postUseTicket } from "../Api/Api";
import AuthContext from "../Context/Context";
import moment from "moment";
import { MdVerifiedUser } from "react-icons/md";

const Verifier = () => {
  const { register, handleSubmit, reset } = useForm();
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [ticket, setTicket] = useState({});

  const getTicket = async (id) => {
    setMessage("");
    try {
      await getVerifyTicket(token, id.id)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setTicket(data);
          reset();
        });
    } catch (error) {
      console.log(error.message);
      if (error.message === "The requested resource could not be found.")
        setMessage("Invalid Ticket Number");
      else {
        setMessage(error.message);
      }
    }
  };
  const handleUseTicket = async (data) => {
    console.log(data);
    const value = {
      id: data,
    };
    try {
      await postUseTicket(token, value);
      setTicket({});
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleRefundTicket = async (data) => {
    try {
      await postRefundTicket(token, { id: data });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='m-3'>
      <fieldset className='fieldset w-full bg-blue-100 border  border-blue-100 p-4 rounded-box'>
        <legend className='fieldset-legend text-lg '>Verify Ticket</legend>
        <form
          className='w-full pb-4'
          action=''
          onSubmit={handleSubmit(getTicket)}>
          <div className='join w-full'>
            <input
              type='number'
              {...register("id")}
              className='input join-item'
              placeholder='Ticket Number'
            />
            <input
              className='btn bg-gradient-to-r text-lg font-bold from-[#01f1fe] to-[#4fadfe] w-[40%] join-item'
              type='submit'
              value={"Verify"}
            />
          </div>
        </form>
      </fieldset>
      {message && (
        <div className=' mt-20 gap-3 mx-10 flex items-center justify-center font-bold text-2xl text-rose-600 p-4 bg-rose-100  rounded-2xl'>
          <p className='text-center'>{message}</p>
        </div>
      )}
      {Object.keys(ticket).length > 0 && (
        <div>
          <div className='text-center'>
            <div className=' mt-20 gap-3 mx-10 flex items-center justify-center font-bold text-2xl '>
              {" "}
              {/* <MdVerifiedUser /> */}
              {ticket.used ? (
                <span className='text-error'>
                  This ticket has already been used.
                </span>
              ) : ticket.refund_status === "not_refunded" ? (
                <span className='text-success'>This ticket is valid</span>
              ) : (
                <span>
                  You have already applied for a refund. Current status:{" "}
                  <strong>{ticket.refund_status}</strong> .
                </span>
              )}
            </div>
            <div
              className={`bg-blue-100  mt-3 text-xl font-medium text-gray-700  py-5 px-12 w-[70%] mx-auto text-center rounded-4xl`}>
              <p>
                Type: <strong>{ticket.ticket_type}</strong>{" "}
              </p>
              <p>
                Fee:<strong>{Number(ticket.amount)} Tk</strong>{" "}
              </p>
              <p>
                <strong>{ticket.ticket_serial}</strong>{" "}
              </p>
              <p>
                Roll No: <strong>{ticket.roll_number}</strong>{" "}
              </p>
              <p>
                Date:{" "}
                <strong>{moment(ticket.date).format("DD/MM/YYYY")}</strong>{" "}
              </p>
              <p>
                Time: <strong>{moment(ticket.date).format("h:mm a")}</strong>{" "}
              </p>
              <p>
                Sold By: <strong>{ticket.accountant}</strong>{" "}
              </p>
              {!ticket.used && ticket.refund_status !== "not_refunded" ? (
                <p className='text-2xl'>
                  Status:{" "}
                  <strong className='font-bold text-error'>
                    {ticket.refund_status}
                  </strong>
                </p>
              ) : (
                ticket.used && (
                  <p>
                    Status:{" "}
                    <strong className='font-bold text-error'>
                      Already Used
                    </strong>
                  </p>
                )
              )}
            </div>
          </div>
          <div
            className={` ${
              ticket.used || ticket.refund_status !== "not_refunded"
                ? "hidden"
                : ""
            }
 flex justify-center gap-4 mt-4`}>
            <button
              onClick={() => handleRefundTicket(ticket.id)}
              className='btn btn-error'>
              Refund
            </button>
            <button
              onClick={() => handleUseTicket(ticket.id)}
              className='btn btn-success px-8'>
              Use
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verifier;
