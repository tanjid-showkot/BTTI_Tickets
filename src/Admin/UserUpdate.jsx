/** @format */

import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { updateUser } from "../Api/Api";
import AuthContext from "../Context/Context";

export function UserUpdate(props) {
  const id = props.id;
  const [activeTab, setActiveTab] = useState("account");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [userError, setUserError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [userSuccess, setUserSuccess] = useState("");
  const { token } = useContext(AuthContext);

  const handleUpdateUser = async () => {
    if (!name && !username) {
      return setUserError("Please enter a name or username to update");
    }
    const data = {
      ...(name ? { first_name: name } : {}),
      ...(username ? { username: username } : {}),
    };
    console.log(data);
    setName("");
    setUsername("");

    try {
      await updateUser(token, id, data);
      setUserError("");
      props.getUsers();
      setUserSuccess("User info updated successfully.");
    } catch (error) {
      setUserError(error.message);
      console.log(error.message);
    }
  };

  const handleUpdatePassword = async () => {
    if (!password && !confirmPassword) {
      return setPassError("Please enter a password to update");
    }
    if (password !== confirmPassword) {
      return setPassError("Passwords do not match");
    }
    const data = {
      password: password,
      confirm_password: confirmPassword,
    };
    try {
      await updateUser(token, id, data);
      setPassError("");
      props.getUsers();
      setPassSuccess("User password updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPassError(error.message);
      console.log(error.message);
    }
  };

  const tabButtonClass = (tab) =>
    `tab rounded-xl px-4 py-2  text-sm font-semibold transition-all ${
      activeTab === tab
        ? "tab-active bg-white text-blue-700 hover:text-blue-800 shadow-sm ring-1 ring-sky-100"
        : "text-slate-500!  hover:text-slate-700"
    }`;

  return (
    <div className='w-full max-w-xl'>
      <div className='mb-4 rounded-[1.25rem] border border-sky-100 bg-sky-50/70 p-1.5'>
        <div
          role='tablist'
          aria-label='User settings tabs'
          className='tabs tabs-boxed w-full'>
          <button
            type='button'
            role='tab'
            aria-selected={activeTab === "account"}
            className={tabButtonClass("account")}
            onClick={() => setActiveTab("account")}>
            Account
          </button>
          <button
            type='button'
            role='tab'
            aria-selected={activeTab === "password"}
            className={tabButtonClass("password")}
            onClick={() => setActiveTab("password")}>
            Password
          </button>
        </div>
      </div>

      {activeTab === "account" ? (
        <div className='rounded-[1.5rem] border border-sky-100 bg-white p-5 shadow-[0_22px_50px_-34px_rgba(37,99,235,0.38)]'>
          <div className='mb-5'>
            <p className='text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-600'>
              Profile
            </p>
            <h3 className='mt-2 text-2xl font-black text-slate-800'>Account</h3>
            <p className='mt-2 text-sm text-slate-500'>
              Make changes to this user account here. Click save when you are
              done.
            </p>
          </div>

          <div className='grid gap-4'>
            <label className='form-control w-full'>
              <span className='mb-2 text-sm font-semibold text-slate-700'>
                Name
              </span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => {
                  setUserError("");
                  setUserSuccess("");
                }}
                id='name'
                placeholder='Enter new name'
                className='app-input w-full text-slate-700 placeholder:text-slate-400'
              />
            </label>

            <label className='form-control w-full'>
              <span className='mb-2 text-sm font-semibold text-slate-700'>
                Username
              </span>
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => {
                  setUserError("");
                  setUserSuccess("");
                }}
                id='nUsername'
                placeholder='Enter new username'
                className='app-input w-full text-slate-700 placeholder:text-slate-400'
              />
            </label>

            {userError && (
              <div className='rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-sm font-medium text-rose-700'>
                {userError}
              </div>
            )}

            {userSuccess && (
              <div className='rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700'>
                {userSuccess}
              </div>
            )}
          </div>

          <div className='mt-5 flex justify-end'>
            <button
              type='button'
              onClick={handleUpdateUser}
              className='btn btn-primary rounded-xl px-5'>
              Save changes
            </button>
          </div>
        </div>
      ) : (
        <div className='rounded-[1.5rem] border border-sky-100 bg-white p-5 shadow-[0_22px_50px_-34px_rgba(37,99,235,0.38)]'>
          <div className='mb-5'>
            <p className='text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-600'>
              Security
            </p>
            <h3 className='mt-2 text-2xl font-black text-slate-800'>
              Password
            </h3>
            <p className='mt-2 text-sm text-slate-500'>
              Change this user password here. After saving, they will be logged
              out.
            </p>
          </div>

          <div className='grid gap-4'>
            <label className='form-control w-full'>
              <span className='mb-2 text-sm font-semibold text-slate-700'>
                Password
              </span>
              <input
                required
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => {
                  setPassError("");
                  setPassSuccess("");
                }}
                id='password'
                placeholder='Enter new password'
                className='app-input w-full text-slate-700 placeholder:text-slate-400'
              />
            </label>

            <label className='form-control w-full'>
              <span className='mb-2 text-sm font-semibold text-slate-700'>
                Confirm Password
              </span>
              <input
                required
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => {
                  setPassError("");
                  setPassSuccess("");
                }}
                id='confirmPassword'
                placeholder='Enter confirm password'
                className='app-input w-full text-slate-700 placeholder:text-slate-400'
              />
            </label>

            {passError && (
              <div className='rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-sm font-medium text-rose-700'>
                {passError}
              </div>
            )}

            {passSuccess && (
              <div className='rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700'>
                {passSuccess}
              </div>
            )}
          </div>

          <div className='mt-5 flex justify-end'>
            <button
              type='button'
              onClick={handleUpdatePassword}
              className='btn btn-primary rounded-xl px-5'>
              Save password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

UserUpdate.propTypes = {
  id: PropTypes.string.isRequired,
  getUsers: PropTypes.func,
};
