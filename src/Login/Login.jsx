/** @format */

import { LoginForm } from "../Components/LoginForm";
import logo from "/BRTC Logo.png";

const Login = () => {
  return (
    <div className='flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='flex flex-col items-center justify-center gap-3 mb-5 '>
        <img src={logo} className='h-24 w-24' alt='' />
        <h1 className='text-center font-black'>তেজগাঁও ট্রেনিং ইন্সটিটিউট </h1>
        <h2 className='text-center font-black'>
          বাংলাদেশ সড়ক পরিবহন কর্পোরেশন
        </h2>
      </div>
      <div className='w-full  max-w-sm'>
        <LoginForm></LoginForm>
      </div>
    </div>
  );
};

export default Login;
