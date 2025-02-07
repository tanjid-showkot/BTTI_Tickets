/** @format */

const RefundApproval = () => {
  return (
    <div>
      <h1 className='text-3xl lg:text-4xl font-bold m-4 '>Approve Refund</h1>
      <div>
        <div className=' font-medium text-xl ms-4 '>
          <p>Total Refunded Amount:3250</p>
          <p>Total Request to Approve: 300</p>
        </div>
        <div className='flex justify-end gap-2 me-3'>
          <button className='btn btn-success'>Approve All</button>
          <button className='btn btn-error'>Reject All</button>
        </div>
        <div className='m-4 flex justify-center '>
          <div className=' w-full  rounded-box border border-base-content/5 bg-base-100'>
            <table className='table font-semibold text-lg text-center'>
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Roll No</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>BT019</td>
                  <td>300</td>
                  <td className=' flex justify-center items-center flex-row gap-2'>
                    <button className='btn btn-success'>Approve</button>
                    <button className='btn btn-error'>Reject</button>
                  </td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>BT019</td>
                  <td>300</td>
                  <td className=' flex flex-row justify-center items-center gap-2'>
                    <button className='btn btn-success'>Approve</button>
                    <button className='btn btn-error'>Reject</button>
                  </td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>BT019</td>
                  <td>300</td>
                  <td className=' flex flex-row justify-center items-center gap-2'>
                    <button className='btn btn-success'>Approve</button>
                    <button className='btn btn-error'>Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundApproval;
