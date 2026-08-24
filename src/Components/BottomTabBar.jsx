/** @format */

import { FaHome, FaUser } from "react-icons/fa"; // Example icons
import { Link, useLocation } from "react-router";
import PropTypes from "prop-types";
import { RiRefundFill, RiTimeLine } from "react-icons/ri";
import { MdOutlineSwipe } from "react-icons/md";

const BottomTabBar = () => {
  const location = useLocation();

  return (
    <div className='fixed bottom-0 left-0 z-40 flex w-full justify-around border-t border-sky-100 bg-white/95 p-2 shadow-[0_-18px_30px_-30px_rgba(37,99,235,0.42)] backdrop-blur-sm md:hidden'>
      <TabItem
        to='/verifier'
        icon={<FaHome />}
        label='Home'
        active={location.pathname === "/verifier"}
      />
      {/* <TabItem
        to='/verifier/vPendingList'
        icon={<RiRefundFill />}
        label='Refunds'
        active={location.pathname === "/verifier/vPendingList"}
      /> */}
      <TabItem
        to='/verifier/queue'
        icon={<RiTimeLine />}
        label='Queue'
        active={location.pathname === "/verifier/queue"}
      />
      <TabItem
        to='/verifier/vProfile'
        icon={<FaUser />}
        label='Profile'
        active={location.pathname === "/verifier/vProfile"}
      />
    </div>
  );
};

const TabItem = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex min-w-[58px] flex-col items-center rounded-xl px-2 py-2 transition ${
        active ? "bg-blue-50 text-blue-600" : "text-slate-500"
      }`}>
      <span className='text-xl'>{icon}</span>
      <span className='text-[10px] font-semibold'>{label}</span>
    </Link>
  );
};

export default BottomTabBar;
TabItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};
