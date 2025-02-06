/** @format */

import { QRCodeSVG } from "qrcode.react";

const Receipt = () => {
  const receiptData = {
    institute: "বিআরটিসি তেজগাঁও ট্রেনিং ইন্সটিটিউট",
    exam: "বিআরটিএ - এর ফিল্ড কম্পিটেন্সি টেস্ট প্র্যাক্টিক্যাল পরীক্ষা",
    date: "23/01/2025",
    time: "03:23 AM",
    examCode: "FT-A12",
    fee: "300",
    rollNo: "00018",
  };
  const qrData = JSON.stringify(receiptData);
  return (
    <div className='p-2 border border-gray-300 rounded w-[230px] text-center font-mono text-xs'>
      <h2 className='text-[8px] font-semibold'>{receiptData.institute}</h2>
      <p className='text-[10px] font-semibold'>{receiptData.exam}</p>
      <hr className='my-1' />
      <div className='text-center text-xs'>
        <p>
          <strong>তাংঃ </strong> {receiptData.date}
        </p>
        <p>
          <strong>সময়ঃ</strong> {receiptData.time}
        </p>
        <p className='text-base'>
          <strong> {receiptData.examCode}</strong>
        </p>
        <p>
          <strong>ফিঃ</strong> {receiptData.fee}
        </p>
        <p>
          <strong>রোল নম্বরঃ</strong> {receiptData.rollNo}
        </p>
      </div>
      <div className='mt-2 flex justify-center'>
        <QRCodeSVG value={qrData} size={60} />
      </div>
      <div className='text-[8px] mt-2'>A Software by: XELOTEK</div>
    </div>
  );
};

export default Receipt;
