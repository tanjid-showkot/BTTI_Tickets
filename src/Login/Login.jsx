/** @format */

import { useContext } from "react";
import { LoginForm } from "../Components/LoginForm";
import logo from "/BRTC Logo.png";
import AuthContext from "../Context/Context";
import Loading from "../Components/Loading";

const Login = () => {
  const { loading } = useContext(AuthContext);

  if (loading) return <Loading></Loading>;

  return (
    <div className='app-shell flex min-h-screen w-full flex-col'>
      <div className='flex flex-1 items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-md'>
          <div className='mb-6 flex flex-col items-center justify-center gap-3 text-center'>
            <div className='flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_18px_36px_-28px_rgba(37,99,235,0.8)] ring-4 ring-blue-100'>
              <img src={logo} className='h-16 w-16 object-contain' alt='' />
            </div>
            <div>
              <h1 className='text-2xl font-black tracking-tight text-slate-800'>
                তেজগাঁও ট্রেনিং ইন্সটিটিউট
              </h1>
              <h2 className='mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600'>
                বাংলাদেশ সড়ক পরিবহন কর্পোরেশন
              </h2>
            </div>
          </div>
          <LoginForm></LoginForm>
        </div>
      </div>

      <div className='w-full border-t border-sky-100 bg-white/95 px-4 py-3 text-[11px] text-slate-600 shadow-[0_-12px_26px_-24px_rgba(37,99,235,0.35)] backdrop-blur-sm'>
        <p className='text-center'>&copy; BRTC Tejgaon Training Institute</p>
        <p className='text-center text-blue-600'>Developed By: XELOTEK</p>
      </div>
    </div>
  );
};

export default Login;
