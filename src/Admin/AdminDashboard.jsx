/** @format */

import { useContext, useEffect, useState } from "react";
import { adminDashboard } from "../Api/Api";
import AuthContext from "../Context/Context";
import Sales from "./Sales";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState([]);
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
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 m-6'>
        <div className='bg-green-300 rounded p-3'>
          <p className='text-center font-semibold text-lg'>Today</p>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <p className='font-semibold text-lg text-center '>Ticket Count</p>
              <p className='font-semibold text-lg text-center '>
                {dashboard.today_total_sold_ticket_count}
              </p>
            </div>
            <div>
              <p className='font-semibold text-lg text-center '>
                Ticket Amount
              </p>
              <p className='font-semibold text-lg text-center '>
                {Number(dashboard.today_total_sold_ticket_amount)}
              </p>
            </div>
          </div>
        </div>
        <div className='bg-blue-300 rounded p-3'>
          <p className='text-center font-semibold text-lg'>Today</p>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <p className='font-semibold text-lg text-center '>Refund Count</p>
              <p className='font-semibold text-lg text-center '>
                {dashboard.today_total_refund_ticket_count}
              </p>
            </div>
            <div>
              <p className='font-semibold text-lg text-center '>
                Refund Amount
              </p>
              <p className='font-semibold text-lg text-center '>
                {Number(dashboard.today_total_refund_ticket_amount)}
              </p>
            </div>
          </div>
        </div>
        <div className='bg-amber-300 rounded p-3'>
          <p className='text-center font-semibold text-lg'>Monthly</p>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <p className='font-semibold text-lg text-center '>Total Count</p>
              <p className='font-semibold text-lg text-center '>
                {dashboard.monthly_total_ticket_count}
              </p>
            </div>
            <div>
              <p className='font-semibold text-lg text-center '>Total Amount</p>
              <p className='font-semibold text-lg text-center '>
                {Number(dashboard.monthly_total_ticket_amount)}
              </p>
            </div>
          </div>
        </div>
        <div className='bg-cyan-300 rounded p-3'>
          <p className='text-center font-semibold text-lg'>All Time</p>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <p className='font-semibold text-lg text-center '>Total Count</p>
              <p className='font-semibold text-lg text-center '>
                {dashboard.all_time_total_ticket_count}
              </p>
            </div>
            <div>
              <p className='font-semibold text-lg text-center '>Total Amount</p>
              <p className='font-semibold text-lg text-center '>
                {Number(dashboard.all_time_total_ticket_amount)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='hidden lg:block'>
        <Sales></Sales>
      </div>
    </div>
  );
};

export default AdminDashboard;
