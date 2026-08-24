/** @format */

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { getVerifyTicket, postRefundTicket, postUseTicket } from "../Api/Api";
import AuthContext from "../Context/Context";
import moment from "moment";

const Verifier = () => {
  const { register, handleSubmit, reset } = useForm();
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [ticket, setTicket] = useState({});
  const [other, setOther] = useState(false);
  const [causeRefund, setCauseRefund] = useState("");
  const [refundCauseOther, setRefundCauseOther] = useState("");
  const [id, setId] = useState(null);
  const [refundError, setRefundError] = useState("");

  const getTicket = async (id) => {
    const value = "FT-A" + id.id;
    // console.log(value);
    setMessage("");
    try {
      await getVerifyTicket(token, value)
        .then((res) => res.json())
        .then((data) => {
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
      setMessage("This Ticket is now used.");
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleRefundTicket = async () => {
    if (!causeRefund) {
      return setRefundError("রিফান্ডের কারন সিলেক্ট করুন।");
    }
    if (other && !refundCauseOther) {
      return setRefundError("রিফান্ডের অন্যান্য কারন লিখুন।");
    }
    const value = {
      id: id,
      refund_reason: other ? refundCauseOther : causeRefund,
    };
    console.log(value);
    try {
      await postRefundTicket(token, value);
      setMessage("Refund request successful");
      document.getElementById("my_modal_3").close();
      setTicket({});
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleCauseRefund = (e) => {
    setRefundError("");
    if (e === "other") {
      setOther(true);
      setCauseRefund(e);
    } else {
      setOther(false);
      console.log(e);
      setCauseRefund(e);
    }
  };
  return (
    <div className='m-3 p-2 md:p-4'>
      <fieldset className='fieldset w-full rounded-3xl border border-sky-100 bg-white p-4 shadow-[0_18px_48px_-32px_rgba(37,99,235,0.35)]'>
        <legend className='fieldset-legend text-lg font-bold text-slate-700'>
          Verify Ticket
        </legend>
        <form
          className='w-full pb-2'
          action=''
          onSubmit={handleSubmit(getTicket)}>
          <div className='join w-full overflow-hidden rounded-2xl border border-sky-100 bg-sky-50 p-1'>
            <input
              type='number'
              {...register("id")}
              className='app-input join-item h-12 flex-1 border-0 bg-white shadow-none'
              placeholder='Ticket Number'
            />
            <input
              className='app-btn app-btn-primary join-item h-12 w-[40%] min-w-[120px] border-0'
              type='submit'
              value={"Verify"}
            />
          </div>
        </form>
      </fieldset>
      {message && (
        <div className='mx-4 mt-8 flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-xl font-bold text-rose-600'>
          <p>{message}</p>
        </div>
      )}
      {Object.keys(ticket).length > 0 && (
        <div>
          <div className='text-center'>
            <div className='mx-4 mt-10 flex items-center justify-center text-2xl font-bold text-slate-700'>
              {ticket.used ? (
                <span className='text-rose-600'>
                  This ticket has already been used.
                </span>
              ) : ticket.refund_status === "not_refunded" ? (
                <span className='text-emerald-600'>This is a valid ticket</span>
              ) : (
                <span>
                  You have already applied for a refund. Current status:{" "}
                  <strong>{ticket.refund_status}</strong>.
                </span>
              )}
            </div>
            <div className='mx-auto mt-4 w-full max-w-2xl rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 text-xl font-medium text-slate-700 shadow-[0_22px_48px_-34px_rgba(37,99,235,0.4)]'>
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
                Time:{" "}
                <strong>{moment(ticket.date).format("h:mm a")}</strong>{" "}
              </p>
              <p>
                Sold By: <strong>{ticket.accountant}</strong>{" "}
              </p>
              {!ticket.used && ticket.refund_status !== "not_refunded" ? (
                <p className='mt-2 text-2xl'>
                  Status:{" "}
                  <strong className='font-bold text-rose-600'>
                    {ticket.refund_status}
                  </strong>
                </p>
              ) : (
                ticket.used && (
                  <p className='mt-2'>
                    Status:{" "}
                    <strong className='font-bold text-rose-600'>
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
 flex justify-center gap-4 mt-6`}>
            <button
              onClick={() => {
                document.getElementById("my_modal_3").showModal();
                setId(ticket.id);
              }}
              className='app-btn app-btn-secondary'>
              Refund
            </button>
            <button
              onClick={() => handleUseTicket(ticket.id)}
              className='app-btn app-btn-primary px-8'>
              Use
            </button>
          </div>
        </div>
      )}
      <dialog id='my_modal_3' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={() => {
                setRefundError("");
                setCauseRefund("");
              }}
              className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>রিফান্ডের কারন</h3>
          <fieldset className='fieldset'>
            <select
              value={causeRefund}
              onChange={(e) => handleCauseRefund(e.target.value)}
              defaultValue='রিফান্ডের কারন সিলেক্ট করুন'
              className='select'>
              <option value={""}>রিফান্ডের কারন সিলেক্ট করুন</option>
              <option value={"লিখিত পরীক্ষায় ফেইল"}>লিখিত পরীক্ষায় ফেইল</option>
              <option value={"ভাইভা পরীক্ষায় ফেইল"}>ভাইভা পরীক্ষায় ফেইল</option>
              <option value={"other"}>অন্যান্য</option>
            </select>
            {other && (
              <fieldset className='fieldset'>
                <legend className='fieldset-legend'>অন্যান্য</legend>
                <input
                  type='text'
                  value={refundCauseOther}
                  onChange={(e) => setRefundCauseOther(e.target.value)}
                  className='input'
                  placeholder='অন্যান্য কারন লিখুন'
                />
              </fieldset>
            )}
            {refundError && (
              <div className='text-error w-[320px] text-center bg-rose-100 py-2 rounded-lg my-2'>
                {refundError}
              </div>
            )}
            <button
              onClick={() => {
                handleRefundTicket();
                setCauseRefund("");
              }}
              className='btn btn-primary w-[320px] mt-5'>
              Refund
            </button>
          </fieldset>
        </div>
      </dialog>
    </div>
  );
};

export default Verifier;
