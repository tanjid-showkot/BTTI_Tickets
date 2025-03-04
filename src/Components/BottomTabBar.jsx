/** @format */

import { FaHome, FaUser } from "react-icons/fa"; // Example icons
import { Link, useLocation } from "react-router";
import PropTypes from "prop-types";
import { RiRefundFill } from "react-icons/ri";

const BottomTabBar = () => {
  const location = useLocation();

  return (
    <div className='fixed bottom-0 left-0 w-full bg-white shadow-lg p-2 border-t flex justify-around md:hidden'>
      <TabItem
        to='/verifier'
        icon={<FaHome />}
        label='Home'
        active={location.pathname === "/verifier"}
      />
      <TabItem
        to='/verifier/vPendingList'
        icon={<RiRefundFill />}
        label='Refunds'
        active={location.pathname === "/verifier/vPendingList"}
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
      className={`flex flex-col items-center  ${
        active ? "text-blue-500" : "text-gray-600"
      }`}>
      <span className='text-xl'>{icon}</span>
      <span className='text-xs'>{label}</span>
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
