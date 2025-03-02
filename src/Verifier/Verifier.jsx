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

  const [ticket, setTicket] = useState({});

  const getTicket = async (id) => {
    try {
      await getVerifyTicket(token, id.id)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setTicket(data);
          reset();
        });
    } catch (error) {
      console.log(error);
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
    <div>
      <fieldset className='fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box'>
        <legend className='fieldset-legend'>Verify Ticket</legend>
        <form className='w-full' action='' onSubmit={handleSubmit(getTicket)}>
          <div className='join w-full'>
            <input
              type='number'
              {...register("id")}
              className='input join-item'
              placeholder='Ticket Number'
            />
            <input
              className='btn btn-accent w-[40%] join-item'
              type='submit'
              value={"Verify"}
            />
          </div>
        </form>
      </fieldset>
      {Object.keys(ticket).length > 0 && (
        <div>
          <div className='text-center'>
            <div className='text-green-500 mt-20 gap-3 flex items-center justify-center font-bold text-2xl '>
              {" "}
              <MdVerifiedUser />
              <span>Verified</span>
            </div>
            <div
              className={` ${
                !ticket.used && ticket.refund_status === "not_refunded"
                  ? "bg-green-200 "
                  : "bg-red-200"
              }   mt-3 text-xl font-medium text-gray-700  py-5 px-12 w-[70%] mx-auto text-center rounded-4xl`}>
              <p>
                Type: <strong>{ticket.ticket_type}</strong>{" "}
              </p>
              <p>
                Amount: <strong>{ticket.amount} Tk</strong>{" "}
              </p>
              <p>
                Serial: <strong>{ticket.ticket_serial}</strong>{" "}
              </p>
              <p>
                Roll No: <strong>{ticket.roll_number}</strong>{" "}
              </p>
              <p>
                Date:{" "}
                <strong>{moment(ticket.date).format("YYYY/MM/DD")}</strong>{" "}
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
