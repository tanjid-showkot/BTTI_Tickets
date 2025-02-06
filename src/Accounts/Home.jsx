/** @format */

const Home = () => {
  return (
    <div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mx-10 mt-20'>
        <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className='font-bold border-2  bg-white border-primary text-primary btn-xl btn hover:bg-primary hover:text-white '>
          300
        </button>
        <button className=' font-bold border-2 bg-white border-primary text-primary btn-xl btn hover:bg-primary hover:text-white '>
          200
        </button>
        <button className=' font-bold border-2 bg-white border-primary text-primary btn-xl btn hover:bg-primary hover:text-white '>
          100
        </button>
      </div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Hello!</h3>
          <p className='py-4'>
            Press ESC key or click the button below to close
          </p>
          <div className='modal-action'>
            <form method='dialog'>
              {/* if there is a button in form, it will close the modal */}
              <button className='btn'>Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Home;
