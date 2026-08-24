/** @format */

import { useContext } from "react";
import AuthContext from "../Context/Context";
import { useNavigate } from "react-router";
import avatar from "/account.png";
import logOut from "/logout.png";

const VProfile = () => {
  const { logOutUser, user } = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();
  const handleLogout = () => {
    logOutUser();
    navigate("/", { replace: true });
  };
  return (
    <div className='p-4 md:p-6'>
      <div className='soft-card mx-auto max-w-lg border-blue-100 bg-gradient-to-br from-sky-50 to-white p-4'>
        <div className='flex items-center gap-4'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white'>
            <img src={avatar} alt='' className='h-10 w-10 object-contain' />
          </div>
          <div>
            <p className='text-xl font-black capitalize text-slate-800'>
              {user.name}
            </p>
            <p className='text-sm font-medium uppercase tracking-[0.16em] text-blue-600'>
              {user.user_type}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className='soft-card mx-auto mt-6 flex max-w-lg items-center justify-center gap-3 border-blue-100 bg-white px-4 py-3 text-left text-xl font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50'>
        <img src={logOut} alt='' className='h-7 w-7' />
        <span>Log Out</span>
      </button>
    </div>
  );
};

export default VProfile;
