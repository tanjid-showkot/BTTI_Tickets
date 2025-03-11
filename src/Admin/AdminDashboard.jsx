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
            data.today_total_ticket_per_accounts
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
    <div className='text-neutral-900 mb-32 '>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 m-6'>
        <div className='bg-blue-50 rounded p-5 pt-6'>
          {/* <p className='text-center font-semibold text-lg'>Today</p> */}
          <div className='grid grid-cols-2 gap-2 '>
            <div>
              <p className='font-bold textarea-xl '>
                {dashboard.today_total_sold_ticket_count}
              </p>
              <p className='font-semibold mt-2 text-zinc-500 '>Ticket Count</p>
            </div>
            <div>
              <p className='font-bold textarea-xl  '>
                {Number(dashboard.today_total_sold_ticket_amount)}
              </p>
              <p className='font-semibold mt-2  text-zinc-500 '>
                Ticket Amount
              </p>
            </div>
          </div>
          <div className='flex justify-between items-center mt-6 '>
            <p className='font-bold text-neutral-500 text-lg'>Today</p>
            <p className='text-3xl text-blue-600'>
              <IoToday />
            </p>
          </div>
        </div>

        <div className='bg-blue-50 rounded p-5 pt-6'>
          {/* <p className='text-center font-semibold text-lg'>Today</p> */}
          <div className='grid grid-cols-2 gap-2 '>
            <div>
              <p className='font-bold textarea-xl '>
                {dashboard.today_total_refund_ticket_count}
              </p>
              <p className='font-semibold mt-2 text-zinc-500 '>Refund Count</p>
            </div>
            <div>
              <p className='font-bold textarea-xl  '>
                {Number(dashboard.today_total_refund_ticket_amount)}
              </p>
              <p className='font-semibold mt-2  text-zinc-500 '>
                Refund Amount
              </p>
            </div>
          </div>
          <div className='flex justify-between items-center mt-6 '>
            <p className='font-bold text-neutral-500 text-lg'>Today</p>
            <p className='text-3xl text-blue-600'>
              <RiRefundFill />
            </p>
          </div>
        </div>

        <div className='bg-blue-50 rounded p-5 pt-6'>
          {/* <p className='text-center font-semibold text-lg'>Today</p> */}
          <div className='grid grid-cols-2 gap-2 '>
            <div>
              <p className='font-bold textarea-xl '>
                {dashboard.monthly_total_ticket_count}
              </p>
              <p className='font-semibold mt-2 text-zinc-500 '>Ticket Count</p>
            </div>
            <div>
              <p className='font-bold textarea-xl  '>
                {Number(dashboard.monthly_total_ticket_amount)}
              </p>
              <p className='font-semibold mt-2  text-zinc-500 '>
                Ticket Amount
              </p>
            </div>
          </div>
          <div className='flex justify-between items-center mt-6 '>
            <p className='font-bold text-neutral-500 text-lg'>Month</p>
            <p className='text-3xl text-blue-600'>
              <MdCalendarMonth />
            </p>
          </div>
        </div>
        <div className='bg-blue-50 rounded p-5 pt-6'>
          {/* <p className='text-center font-semibold text-lg'>Today</p> */}
          <div className='grid grid-cols-2 gap-2 '>
            <div>
              <p className='font-bold textarea-xl '>
                {dashboard.all_time_total_ticket_count}
              </p>
              <p className='font-semibold mt-2 text-zinc-500 '>Ticket Count</p>
            </div>
            <div>
              <p className='font-bold textarea-xl  '>
                {Number(dashboard.all_time_total_ticket_amount)}
              </p>
              <p className='font-semibold mt-2  text-zinc-500 '>
                Ticket Amount
              </p>
            </div>
          </div>
          <div className='flex justify-between items-center mt-6 '>
            <p className='font-bold text-neutral-500 text-lg'>All Time</p>
            <p className='text-3xl text-blue-600'>
              <FaSortAmountUp />
            </p>
          </div>
        </div>
      </div>
      {Object.entries(acc).map(([account, data]) => (
        <div key={account} className='  mb-4 '>
          <h3 className='ms-6 mb-3'>
            Account: <strong className=' capitalize'>{account}</strong>{" "}
          </h3>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 ms-6  '>
            {Object.entries(data).map(([period, details]) => (
              <div key={period} className='bg-blue-50 rounded p-5 pt-6'>
                {/* <p className='text-center font-semibold text-lg'>Today</p> */}
                <div className='grid grid-cols-2 gap-2 '>
                  <div>
                    <p className='font-bold textarea-xl '>{details.count}</p>
                    <p className='font-semibold mt-2 text-zinc-500 '>
                      Ticket Count
                    </p>
                  </div>
                  <div>
                    <p className='font-bold textarea-xl  '>
                      {Number(details.amount)}
                    </p>
                    <p className='font-semibold mt-2  text-zinc-500 '>
                      Ticket Amount
                    </p>
                  </div>
                </div>
                <div className='flex justify-between items-center mt-6 '>
                  <p className='font-bold text-neutral-500 text-lg'>
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
