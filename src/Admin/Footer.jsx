/** @format */

const Footer = () => {
  return (
    <footer className='footer footer-center sm:footer-horizontal fixed bottom-0 left-0 w-full border-t border-sky-100 bg-white/95 px-4 py-3 text-[11px] text-slate-600 shadow-[0_-12px_26px_-24px_rgba(37,99,235,0.35)] backdrop-blur-sm'>
      <nav className='flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-3'>
        <p className='text-center'>&copy; BRTC Tejgaon Training Institute</p>
        <span className='hidden text-slate-300 sm:inline'>|</span>
        <a
          target='_blank'
          rel='noreferrer'
          className='link link-primary text-center font-medium no-underline hover:text-blue-700'
          href='https://www.xelotek.com/'>
          Developed By: <strong className='font-bold underline'>XELOTEK</strong>
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
