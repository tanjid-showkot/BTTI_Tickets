/** @format */

const AccountsDashboard = () => {
  return (
    <div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 m-6'>
        <div className='bg-amber-500 rounded p-6'>
          <div className='grid grid-cols-2 gap-2'>
            <p className='font-semibold text-lg '>Ticket Sold</p>
            <p className='font-semibold text-end text-lg '>Today</p>
          </div>
          <p className=' text-center font-bold text-4xl'>100</p>
        </div>
      </div>
    </div>
  );
};

export default AccountsDashboard;
