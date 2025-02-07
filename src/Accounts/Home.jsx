/** @format */

import { Input } from "../Components/UI/Input";
import { Label } from "../Components/UI/Label";

const Home = () => {
  return (
    <div>
      <h1 className='text-center font-bold text-xl m-4'>Entry Ticket</h1>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mx-10 mt-10'>
        <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className=' border-2 flex flex-col h-22  bg-white border-primary text-primary  btn hover:bg-primary hover:text-white '>
          <span className='font-semibold text-xl'>Light And Motorcycle</span>{" "}
          <span className='font-bold'>300</span>
        </button>
        <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className=' border-2 flex flex-col h-22  bg-white border-primary text-primary  btn hover:bg-primary hover:text-white '>
          <span className='font-semibold text-xl'>Light </span>{" "}
          <span className='font-bold'>200</span>
        </button>
        <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className=' border-2 flex flex-col h-22  bg-white border-primary text-primary  btn hover:bg-primary hover:text-white '>
          <span className='font-semibold text-xl'>Motorcycle</span>{" "}
          <span className='font-bold'>100</span>
        </button>
      </div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Print Ticket</h3>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Roll No:
              </Label>
              <Input
                id='roll_no'
                placeholder='Enter your Roll No'
                className='col-span-3'
              />
            </div>
          </div>
          <div className='modal-action'>
            <form method='dialog'>
              {/* if there is a button in form, it will close the modal */}
              <button className='btn btn-accent'>Print</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Home;
