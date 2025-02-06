/** @format */

const SettleRefund = () => {
  return (
    <div>
      <h1 className='text-3xl lg:text-4xl font-bold m-4 '>Settle Refund</h1>
      <div>
        <div className='lg:flex font-medium text-xl ms-4 '>
          <p>Total Refunded Amount:3250</p>
          <p>Total Refund to settle: 300</p>
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
                  <td>Settled</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>BT019</td>
                  <td>300</td>
                  <td className='text-success'>Settled</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>BT019</td>
                  <td>300</td>
                  <td>
                    <button className='btn btn-error'>Settle</button>
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

export default SettleRefund;
