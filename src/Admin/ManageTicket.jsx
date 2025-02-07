/** @format */

const ManageTicket = () => {
  return (
    <div>
      <h1 className='text-3xl lg:text-3xl font-bold m-4 '>Manage Tickets</h1>
      <div className='flex justify-end me-4'>
        <button className='btn btn-primary  '>Create New Ticket</button>
      </div>
      <div>
        <h2 className='text-2xl font-bold m-4'>Active Tickets</h2>
      </div>
      <div>
        <div className='flex justify-between m-4 border border-base-content/5 p-4'>
          <div>
            <strong>Ticket Name: </strong>
            <p className='font-semibold'>Light and Motorcycle</p>
          </div>
          <div>
            <strong>Price: </strong>
            <p className='font-semibold'>300</p>
          </div>
          <div className='flex items-center'>
            <label className='toggle border-success bg-success '>
              <input type='checkbox' />

              <svg
                aria-label='enabled'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'>
                <g
                  strokeLinejoin='round'
                  strokeLinecap='round'
                  strokeWidth='4'
                  fill='none'
                  stroke='currentColor'>
                  <path d='M20 6 9 17l-5-5'></path>
                </g>
              </svg>
              <svg
                aria-label='disabled'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='4'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <path d='M18 6 6 18' />
                <path d='m6 6 12 12' />
              </svg>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTicket;
