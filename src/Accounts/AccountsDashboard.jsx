/** @format */

import { useContext, useEffect, useState } from "react";
import AuthContext from "../Context/Context";
import { getAccountDashboard } from "../Api/Api";

const AccountsDashboard = () => {
  const [allTickets, setAllTickets] = useState([]);
  const { token, user, server, characteristics } = useContext(AuthContext);
  const now = new Date();
  const date = now.toLocaleDateString();
  const [month, day, year] = date.split("/");
  console.log(month);
  console.log(day);
  console.log(year);
  const dates = {
    day: day,
    month: month,
    year: year,
  };

  useEffect(() => {
    getAccountsDashboard();
  }, []);
  const getAccountsDashboard = async () => {
    try {
      await getAccountDashboard(token, dates)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAllTickets(data);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const ESC = String.fromCharCode(0x1b);
  const BOLD_ON = `${ESC}E${String.fromCharCode(0x01)}`;
  const BOLD_OFF = `${ESC}E${String.fromCharCode(0x00)}`;
  const ALIGN_CENTER = `${ESC}a${String.fromCharCode(0x01)}`;
  const ALIGN_LEFT = `${ESC}a${String.fromCharCode(0x00)}`;
  const FONT_S = `${ESC}M${String.fromCharCode(0x01)}`;
  const FONT_M = `${ESC}M${String.fromCharCode(0x00)}`;
  const FONT_XL = `${ESC}!${String.fromCharCode(0x30)}`;
  const RESET_SIZE = `${ESC}!${String.fromCharCode(0x00)}`;
  const FEED_PAPER = `${ESC}d${String.fromCharCode(0x01)}`;
  const NEW_LINE = `\n`;
  const formattedDate = now.toLocaleDateString();
  const formattedTime = now.toLocaleTimeString();
  const textLines = [
    "Today Sold  Count: 0",
    "Today Sold Amount: 0",
    "Today Total Refund Count: 0",
    "Today Total Refund Amount: 0",
    "Total Count: 0",
    "Total Amount: 0",
    `Printed By: ${user.name}`,
    `Date: ${formattedDate} Time: ${formattedTime}`,
    "Developed By: XELOTEK",
  ];

  // Find the longest line (excluding heading)
  const maxWidth = Math.max(...textLines.map((line) => line.length));

  // Generate separator based on longest line width
  const separator = "-".repeat(maxWidth);

  const text_data =
    `${ALIGN_CENTER} ${BOLD_ON}${FONT_M}BRTC Tejgaon Training Institute${BOLD_OFF}${NEW_LINE}` +
    `${ALIGN_LEFT}${FONT_M}Today Sold  Count: ${allTickets.today_ticket_count}${NEW_LINE}` +
    `${FONT_M}Sold Amount: ${Number(
      allTickets.today_total_amount
    )} TK  ${NEW_LINE}` +
    `${FONT_M}Total Refund Count: 0${NEW_LINE}` +
    `${FONT_M}Total Refund Amount: 0 TK${NEW_LINE}` +
    `${separator}${NEW_LINE}` + // Separator before "Total Count"
    `${BOLD_ON}${FONT_M}Total Count: ${allTickets.today_ticket_count}${BOLD_OFF}${NEW_LINE}` +
    `${BOLD_ON}${FONT_M}Total Amount: ${Number(
      allTickets.today_total_amount
    )} TK${BOLD_OFF}${NEW_LINE}` +
    `${separator}${NEW_LINE}` + // Separator after "Total Amount"
    // `${BOLD_ON}${FONT_M}Total Count: 0${BOLD_OFF}${NEW_LINE}` +
    // `${BOLD_ON}${FONT_M}Total Amount: 0${BOLD_OFF}${NEW_LINE}` +
    `${FONT_S}Printed By: ${user.name} ${NEW_LINE}` +
    `${FONT_S}Date: ${formattedDate} Time:${formattedTime} ${NEW_LINE}` +
    `${ALIGN_CENTER}${FONT_S}Developed By: XELOTEK${NEW_LINE}${NEW_LINE}${NEW_LINE}${NEW_LINE}`;

  async function printBanglaWithCharsets(text) {
    try {
      if (!server || !server.connected) {
        console.error("GATT server is not connected yet.");
        return;
      }

      const service = await server.getPrimaryService(
        "49535343-fe7d-4ae5-8fa9-9fafd205e455"
      );
      const characteristic = await service.getCharacteristic(
        characteristics[1].uuid
      );

      const encodedText = new TextEncoder().encode(text);
      await characteristic.writeValue(encodedText);

      // // Feed paper (optional)
      // const feed = new Uint8Array([0x1b, 0x64, 0x03]); // ESC d 3 (feed 3 lines)
      // await characteristic.writeValue(feed);
    } catch (error) {
      console.error("Error printing Bangla:", error);
    }
  }

  return (
    <div>
      <div className='flex justify-around'>
        <button
          className='btn  m-4 px-4 btn-primary'
          onClick={() => printBanglaWithCharsets(text_data)}>
          Print
        </button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 m-6'>
        <div className='bg-blue-300 rounded p-6'>
          <p className='font-bold text-center text-lg '>Today</p>
          <div className='flex justify-around'>
            <div className=' text-center font-bold text-lg'>
              <p className='  '>Total Count</p>
              <p className=' '>{allTickets.today_ticket_count}</p>
            </div>
            <div className='text-center font-bold text-lg'>
              <p className='  '>Total Amount</p>
              <p className='  '>{Number(allTickets.today_total_amount)}</p>
            </div>
          </div>
        </div>
        <div className='bg-cyan-300 rounded p-6'>
          <p className='font-bold text-center text-lg '>Today</p>
          <div className='flex justify-around'>
            <div className=' text-center font-bold text-lg'>
              <p className='  '>Total Refund Count</p>
              <p className=' '>0</p>
            </div>
            <div className='text-center font-bold text-lg'>
              <p className='  '>Total Refund Amount</p>
              <p className='  '>0</p>
            </div>
          </div>
        </div>
        <div className='bg-emerald-300 rounded p-6'>
          <p className='font-bold text-center text-lg '>Today</p>
          <div className='flex justify-around'>
            <div className=' text-center font-bold text-lg'>
              <p className='  '> Subtotal Count</p>
              <p className=' '>{allTickets.today_ticket_count}</p>
            </div>
            <div className='text-center font-bold text-lg'>
              <p className='  '> Subtotal Amount</p>
              <p className='  '>{Number(allTickets.today_total_amount)}</p>
            </div>
          </div>
        </div>
        <div className='bg-fuchsia-300 rounded p-6'>
          <p className='font-bold text-center text-lg '>Monthly</p>
          <div className='flex justify-around'>
            <div className=' text-center font-bold text-lg'>
              <p className='  '> Total Count</p>
              <p className=' '>{allTickets.monthly_ticket_count}</p>
            </div>
            <div className='text-center font-bold text-lg'>
              <p className='  '> Total Amount</p>
              <p className='  '>{Number(allTickets.monthly_total_amount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsDashboard;
