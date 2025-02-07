/** @format */

const AdminDashboard = () => {
  return (
    <div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 m-6'>
        <div className='bg-green-300 rounded p-6'>
          <div className='grid grid-cols-2 gap-2'>
            <p className='font-semibold text-lg '>Ticket Sold</p>
            <p className='font-semibold text-end text-lg '>Today</p>
          </div>
          <p className=' text-center font-bold text-4xl'>50</p>
        </div>
        <div className='bg-blue-300 rounded p-6'>
          <div className='grid grid-cols-2 gap-2'>
            <p className='font-semibold text-lg '>Ticket Sold</p>
            <p className='font-semibold text-end text-lg '>All Time</p>
          </div>
          <p className=' text-center font-bold text-4xl'>254</p>
        </div>
        <div className='bg-cyan-300 rounded p-6'>
          <div className='grid grid-cols-2 gap-2'>
            <p className='font-semibold text-lg '>Total Amount</p>
            <p className='font-semibold text-end text-lg '>Today</p>
          </div>
          <p className=' text-center font-bold text-4xl'>4300</p>
        </div>
        <div className='bg-emerald-300 rounded p-6'>
          <div className='grid grid-cols-2 gap-2'>
            <p className='font-semibold text-lg '>Total Amount</p>
            <p className='font-semibold text-end text-lg '>All Time</p>
          </div>
          <p className=' text-center font-bold text-4xl'>50,600</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
