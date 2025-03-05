/** @format */

const Footer = () => {
  return (
    <div
      className='fixed  gap-3 flex justify-center
      bottom-0 left-0 w-full bg-gray-100 shadow-lg py-2 text-xs'>
      <p className='text-black text-center'>
        {" "}
        &copy; BRTC Tejgaon Training Institute
      </p>
      <a
        target='_blank'
        className='text-black text-center '
        href='https://www.xelotek.com/'>
        Developed By: <strong className=' underline'>XELOTEK</strong>
      </a>
    </div>
  );
};

export default Footer;
