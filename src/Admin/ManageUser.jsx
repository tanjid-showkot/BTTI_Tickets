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
import superAdmin from "/avatar/super.png";
import admin from "/avatar/Admin.png";
import account from "/avatar/account.png";
import verifier from "/avatar/varifier.png";

const ManageUser = () => {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState("");
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);
  const getUsers = async () => {
    try {
      await getUser(token)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          const priority = { superadmin: 1, admin: 2, account: 3, verifier: 4 };
          setUsers(
            data.sort((a, b) => priority[a.user_type] - priority[b.user_type])
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

  return (
    <div className='pb-10'>
      <h1 className='text-3xl lg:text-3xl font-bold m-4 '>Manage User</h1>
      <div className='flex justify-end me-[110px] '>
        <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className='btn  btn-primary'>
          <IoCreateSharp /> Create New User
        </button>
      </div>

      <div className='grid lg:grid-cols-4 grid-cols-1 w-[80%] lg:w-[90%] mx-auto'>
        {users.map((u) => (
          <div
            key={u.id}
            className='bg-[#FDFBEE] h-[300px] w-[300px] m-5 rounded-2xl relative'>
            {/* Header Background */}
            <div className='bg-[#57B4BA] w-full h-[110px] rounded-t-2xl'></div>

            {/* Profile Image */}
            <div className='absolute top-10 left-1/2 -translate-x-1/2'>
              <div className='w-28 h-28 rounded-full overflow-hidden'>
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
                  alt='Super Admin'
                  className='w-full h-full object-cover'
                />
              </div>
            </div>

            {/* User Info */}
            <div className='text-center mt-11'>
              <p className='text-xl font-bold'>{u.first_name}</p>
              <p>@{u.username}</p>
              <p
                className={` font-bold rounded-2xl px-2 text-center inline-block ${
                  u.user_type === "superadmin"
                    ? "bg-blue-100 text-blue-800"
                    : u.user_type === "admin"
                    ? " bg-orange-100 text-orange-800 "
                    : u.user_type === "account"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-indigo-100 text-indigo-800"
                }   `}>
                {u.user_type}
              </p>
            </div>

            {/* Buttons Section (Placed Properly) */}
            <div className='absolute bottom-0 left-0 w-full flex'>
              {/* Edit Button (75% width) */}
              <button
                onClick={() => {
                  document.getElementById("my_modal_9").showModal();
                  setId(u.id);
                }}
                className='w-3/4 py-2 font-bold bg-cyan-800 text-white rounded-bl-2xl transition-all duration-200 hover:bg-emerald-800 active:scale-95 flex items-center justify-center gap-2'>
                <FaEdit /> Edit
              </button>

              {/* Delete Button (25% width) */}
              <button
                onClick={() => {
                  document.getElementById("my_modal_3").showModal();
                  setId(u.id);
                }}
                className='w-1/4 py-2 bg-red-500 text-white rounded-br-2xl transition-all duration-200 text-2xl hover:bg-red-600 active:scale-95 flex justify-center'>
                <FaTrashCan />
              </button>
            </div>
          </div>
        ))}
      </div>

      <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <form onSubmit={handleSubmit(handleCreateUser)}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='first_name'
                  type='text'
                  {...register("first_name")}
                  placeholder='Enter your name'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  type='text'
                  {...register("username")}
                  placeholder='Enter your username'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='userType'>User Type</Label>

                <select
                  className='select select-neutral capitalize w-full validator'
                  {...register("user_type")}
                  id='userType'
                  required>
                  <option disabled selected value=''>
                    Select User Type
                  </option>
                  <option className=' capitalize'>account</option>
                  <option className=' capitalize'>validator</option>
                </select>
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <Input
                  id='password'
                  type='text'
                  required
                  {...register("password")}
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='confirmPassword'>Confirm Password</Label>
                </div>
                <Input
                  id='confirmPassword'
                  type='text'
                  required
                  {...register("confirm_password")}
                />
              </div>
              {error && (
                <div className='text-error font-medium bg-rose-100 py-2 rounded-md text-center'>
                  {error}
                </div>
              )}
              <input
                type='submit'
                value={"Create User"}
                className=' w-full btn btn-primary '
              />
            </div>
          </form>
        </div>
      </dialog>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      <dialog id='my_modal_3' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Are you sure? </h3>
          <p className='py-4 text-sm lg:text-base'>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our systems.
          </p>
          <div className='modal-action'>
            <form method='dialog flex justify-end '>
              {/* if there is a button in form, it will close the modal */}
              <button
                type='button'
                onClick={() => document.getElementById("my_modal_3").close()}
                className='btn btn-outline me-4'>
                Cancel
              </button>
              <button
                type='button'
                onClick={() => {
                  handleDelete();
                }}
                className='btn btn-error'>
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      <dialog id='my_modal_9' className='modal'>
        <div className='modal-box  '>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
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
