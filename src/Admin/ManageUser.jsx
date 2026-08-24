/** @format */

import { useForm } from "react-hook-form";
import { Label } from "../Components/UI/Label";
import { Input } from "../Components/UI/Input";
import { useContext, useEffect, useState } from "react";
import { addUser, deleteUser, getUser } from "../Api/Api";
import AuthContext from "../Context/Context";
import { UserUpdate } from "./UserUpdate";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { IoCreateSharp } from "react-icons/io5";
import { ChevronDown } from "lucide-react";
import superAdmin from "/avatar/super.png";
import admin from "/avatar/Admin.png";
import account from "/avatar/account.png";
import verifier from "/avatar/varifier.png";

const ManageUser = () => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      first_name: "",
      username: "",
      user_type: "",
      password: "",
      confirm_password: "",
    },
  });
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState(null);
  const [isUserTypeOpen, setIsUserTypeOpen] = useState(false);
  const userTypeOptions = [
    { value: "account", label: "Account" },
    { value: "verifier", label: "Verifier" },
  ];

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("userTypeDropdown");
      if (dropdown && !dropdown.contains(event.target)) {
        setIsUserTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUsers = async () => {
    try {
      await getUser(token)
        .then((res) => res.json())
        .then((data) => {
          const priority = { superadmin: 1, admin: 2, account: 3, verifier: 4 };
          setUsers(
            data.sort((a, b) => priority[a.user_type] - priority[b.user_type]),
          );
        });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCreateUser = async (data) => {
    try {
      reset();
      await addUser(token, data);
      getUsers();
      setError("");
      document.getElementById("my_modal_5").close();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(token, id);
      getUsers();
      document.getElementById("my_modal_3").close();
    } catch (error) {
      console.log(error.message);
    }
  };

  const selectedUserType = watch("user_type");

  return (
    <div className='p-4 pb-10 md:p-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 flex flex-col gap-4 rounded-[1.5rem] border border-sky-100 bg-white/90 p-5 shadow-[0_24px_60px_-36px_rgba(37,99,235,0.35)] md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-sky-600'>
              Team Access
            </p>
            <h1 className='mt-2 text-3xl font-black text-slate-800'>
              Manage User
            </h1>
          </div>

          <button
            type='button'
            onClick={() => document.getElementById("my_modal_5").showModal()}
            className='app-btn app-btn-primary inline-flex items-center justify-center gap-2'>
            <IoCreateSharp className='text-lg' />
            Create New User
          </button>
        </div>

        <div className='soft-panel overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='user-table min-w-full'>
              <thead>
                <tr>
                  <th className='px-5 py-4 text-left'>User</th>
                  <th className='px-5 py-4 text-left'>Username</th>
                  <th className='px-5 py-4 text-left'>Role</th>
                  <th className='px-5 py-4 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className='px-5 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='h-11 w-11 overflow-hidden rounded-full border-2 border-sky-100 bg-sky-50'>
                          <img
                            src={
                              u.user_type === "superadmin"
                                ? superAdmin
                                : u.user_type === "admin"
                                  ? admin
                                  : u.user_type === "account"
                                    ? account
                                    : verifier
                            }
                            alt={u.user_type}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div>
                          <div className='font-bold text-slate-800'>
                            {u.first_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className='px-5 py-4 text-slate-600'>@{u.username}</td>

                    <td className='px-5 py-4'>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          u.user_type === "superadmin"
                            ? "bg-blue-100 text-blue-800"
                            : u.user_type === "admin"
                              ? "bg-orange-100 text-orange-800"
                              : u.user_type === "account"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-indigo-100 text-indigo-800"
                        }`}>
                        {u.user_type}
                      </span>
                    </td>

                    <td className='px-5 py-4'>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          onClick={() => {
                            document.getElementById("my_modal_9").showModal();
                            setId(u.id);
                          }}
                          className='inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-2 py-1 text-sm font-semibold text-sky-700 transition hover:bg-sky-100'>
                          <FaEdit /> Edit
                        </button>

                        <button
                          type='button'
                          onClick={() => {
                            document.getElementById("my_modal_3").showModal();
                            setId(u.id);
                          }}
                          className='inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-2 py-1  font-semibold text-rose-600 text-sm  transition hover:bg-rose-100'>
                          <FaTrashCan /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box w-full max-w-xl rounded-[1.5rem] border border-sky-100 bg-white p-6 shadow-[0_26px_70px_-40px_rgba(37,99,235,0.42)]'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>

          <div className='mb-5'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-sky-600'>
              New account
            </p>
            <h3 className='mt-2 text-2xl font-black text-slate-800'>
              Create New User
            </h3>
          </div>

          <form onSubmit={handleSubmit(handleCreateUser)} className='space-y-5'>
            <div className='grid gap-5 md:grid-cols-2'>
              <div className='grid gap-2'>
                <Label htmlFor='first_name'>Name</Label>
                <Input
                  id='first_name'
                  type='text'
                  {...register("first_name")}
                  placeholder='Enter your name'
                  className='app-input'
                  required
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  type='text'
                  {...register("username")}
                  placeholder='Enter username'
                  className='app-input'
                  required
                />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='userType'>User Type</Label>
              <div id='userTypeDropdown' className='relative'>
                <button
                  type='button'
                  aria-haspopup='listbox'
                  aria-expanded={isUserTypeOpen}
                  onClick={() => setIsUserTypeOpen((prev) => !prev)}
                  className='user-select w-full'>
                  <span className='truncate text-left'>
                    {selectedUserType
                      ? userTypeOptions.find(
                          (option) => option.value === selectedUserType,
                        )?.label
                      : "Select user type"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-sky-600 transition-transform ${
                      isUserTypeOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserTypeOpen && (
                  <div className='user-select-content absolute left-0 right-0 top-full z-50 mt-2'>
                    <div className='p-1'>
                      {userTypeOptions.map((option) => (
                        <button
                          key={option.value}
                          type='button'
                          onClick={() => {
                            setValue("user_type", option.value);
                            setIsUserTypeOpen(false);
                          }}
                          className={`user-select-item w-full ${
                            selectedUserType === option.value
                              ? "font-semibold"
                              : ""
                          }`}>
                          <span>{option.label}</span>
                          {selectedUserType === option.value && (
                            <span className='text-sky-600'>✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='grid gap-5 md:grid-cols-2'>
              <div className='grid gap-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='text'
                  {...register("password")}
                  placeholder='Create password'
                  className='app-input'
                  required
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <Input
                  id='confirmPassword'
                  type='text'
                  {...register("confirm_password")}
                  placeholder='Confirm password'
                  className='app-input'
                  required
                />
              </div>
            </div>

            {error && (
              <div className='rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-sm font-medium text-rose-700'>
                {error}
              </div>
            )}

            <button type='submit' className='app-btn app-btn-primary w-full'>
              Create User
            </button>
          </form>
        </div>
      </dialog>

      <dialog id='my_modal_3' className='modal'>
        <div className='modal-box w-full max-w-md rounded-[1.5rem] border border-rose-100 bg-white p-6 shadow-[0_26px_60px_-40px_rgba(244,63,94,0.34)]'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>

          <h3 className='text-xl font-black text-slate-800'>Are you sure?</h3>
          <p className='py-4 text-sm text-slate-600 lg:text-base'>
            This action cannot be undone. This will permanently delete the user
            and remove their data from the system.
          </p>

          <div className='mt-5 flex justify-end gap-3'>
            <button
              type='button'
              onClick={() => document.getElementById("my_modal_3").close()}
              className='btn btn-outline'>
              Cancel
            </button>
            <button
              type='button'
              onClick={handleDelete}
              className='btn btn-error'>
              Delete
            </button>
          </div>
        </div>

        <form method='dialog' className='modal-backdrop'>
          <button type='button'>close</button>
        </form>
      </dialog>

      <dialog id='my_modal_9' className='modal'>
        <div className='modal-box w-full max-w-2xl rounded-[1.5rem] border border-sky-100 bg-white p-5 shadow-[0_26px_70px_-36px_rgba(37,99,235,0.42)]'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <div className='flex justify-center'>
            <UserUpdate id={id} getUsers={getUsers}></UserUpdate>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ManageUser;
