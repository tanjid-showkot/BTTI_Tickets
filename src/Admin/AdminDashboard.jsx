/** @format */

import { useContext, useEffect, useState } from "react";
import { adminDashboard } from "../Api/Api";
import AuthContext from "../Context/Context";
import Sales from "./Sales";
import { IoToday } from "react-icons/io5";
import { RiRefundFill } from "react-icons/ri";
import { MdCalendarMonth } from "react-icons/md";
import { FaSortAmountUp } from "react-icons/fa";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState([]);
  const [acc, setAcc] = useState({});
  const colors = [
    "bg-blue-50",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-teal-100",
    "bg-zinc-100",
  ];
  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      await adminDashboard(token)
        .then((res) => res.json())
        .then((data) => {
          setDashboard(data);
          console.log(data);
          const transformedData = Object.keys(
            data.today_total_ticket_per_accounts,
          ).reduce((acc, key) => {
            acc[key] = {
              today_total_ticket_per_accounts:
                data.today_total_ticket_per_accounts[key],
              monthly_total_ticket_per_accounts:
                data.monthly_total_ticket_per_accounts[key],
              all_time_total_ticket_per_accounts:
                data.all_time_total_ticket_per_accounts[key],
            };
            return acc;
          }, {});
          setAcc(transformedData);
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='mb-32 p-4 md:p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium uppercase tracking-[0.2em] text-blue-600'>
            Overview
          </p>
          <h1 className='text-3xl font-black text-slate-800'>Dashboard</h1>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-4'>
        <div className='soft-card border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5'>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <p className='text-2xl font-black text-slate-800'>
                {dashboard.today_total_sold_ticket_count}
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-500'>
                Ticket Count
              </p>
            </div>
            <div>
              <p className='text-2xl font-black text-slate-800'>
                {" "}
                {Number(dashboard.today_total_sold_ticket_amount)}
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-500'>
                Ticket Amount
              </p>
            </div>
          </div>
          <div className='mt-6 flex items-center justify-between'>
            <p className='text-base font-bold text-slate-600'>Today</p>
            <p className='text-3xl text-blue-600'>
              <IoToday />
            </p>
          </div>
        </div>

        <div className='soft-card border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5'>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <p className='text-2xl font-black text-slate-800'>
                {dashboard.today_total_refund_ticket_count}
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-500'>
                Refund Count
              </p>
            </div>
            <div>
              <p className='text-2xl font-black text-slate-800'>
                {Number(dashboard.today_total_refund_ticket_amount)}
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-500'>
                Refund Amount
              </p>
            </div>
          </div>
          <div className='mt-6 flex items-center justify-between'>
            <p className='text-base font-bold text-slate-600'>Today</p>
            <p className='text-3xl text-blue-600'>
              <RiRefundFill />
            </p>
          </div>
        </div>

        <div className='soft-card border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5'>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <p className='text-2xl font-black text-slate-800'>
                {dashboard.monthly_total_ticket_count}
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-500'>
                Ticket Count
              </p>
            </div>
            <div>
              <p className='text-2xl font-black text-slate-800'>
                {Number(dashboard.monthly_total_ticket_amount)}
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-500'>
                Ticket Amount
              </p>
            </div>
          </div>
          <div className='mt-6 flex items-center justify-between'>
            <p className='text-base font-bold text-slate-600'>Month</p>
            <p className='text-3xl text-blue-600'>
              <MdCalendarMonth />
            </p>
          </div>
        </div>
        <div className='soft-card border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5'>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <p className='text-2xl font-black text-slate-800'>
                {dashboard.all_time_total_ticket_count}
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-500'>
                Ticket Count
              </p>
            </div>
            <div>
              <p className='text-2xl font-black text-slate-800'>
                {Number(dashboard.all_time_total_ticket_amount)}
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-500'>
                Ticket Amount
              </p>
            </div>
          </div>
          <div className='mt-6 flex items-center justify-between'>
            <p className='text-base font-bold text-slate-600'>All Time</p>
            <p className='text-3xl text-blue-600'>
              <FaSortAmountUp />
            </p>
          </div>
        </div>
      </div>
      {Object.entries(acc).map(([account, data]) => (
        <div key={account} className='mt-8'>
          <h3 className='mb-3 text-lg font-bold text-slate-700'>
            Account: <span className='capitalize text-blue-600'>{account}</span>
          </h3>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-4'>
            {Object.entries(data).map(([period, details]) => (
              <div
                key={period}
                className='soft-card border-sky-100 bg-white p-5'>
                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <p className='text-2xl font-black text-slate-800'>
                      {details.count}
                    </p>
                    <p className='mt-2 text-sm font-semibold text-slate-500'>
                      Ticket Count
                    </p>
                  </div>
                  <div>
                    <p className='text-2xl font-black text-slate-800'>
                      {Number(details.amount)}
                    </p>
                    <p className='mt-2 text-sm font-semibold text-slate-500'>
                      Ticket Amount
                    </p>
                  </div>
                </div>
                <div className='mt-6 flex items-center justify-between'>
                  <p className='text-base font-bold text-slate-600'>
                    {period === "today_total_ticket_per_accounts"
                      ? "Today"
                      : period === "monthly_total_ticket_per_accounts"
                        ? "Monthly"
                        : "All Time"}
                  </p>
                  <p className='text-3xl text-blue-600'>
                    {period === "today_total_ticket_per_accounts" ? (
                      <IoToday />
                    ) : period === "monthly_total_ticket_per_accounts" ? (
                      <MdCalendarMonth />
                    ) : (
                      <FaSortAmountUp />
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;

// today
// import { IoTodaySharp } from "react-icons/io5";
{
  /* <IoTodaySharp /> */
}
