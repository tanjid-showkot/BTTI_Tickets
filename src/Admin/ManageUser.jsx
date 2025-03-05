/** @format */

import { useForm } from "react-hook-form";
import { Label } from "../Components/UI/Label";
import { Input } from "../Components/UI/Input";
import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/UI/Dialog";
import { Button } from "../Components/UI/Button";
import { addUser, deleteUser, getUser, updateUser } from "../Api/Api";
import AuthContext from "../Context/Context";

const ManageUser = () => {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    getUsers();
  }, []);
  const getUsers = async () => {
    try {
      await getUser(token)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUsers(data);
        });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCreateUser = async (data) => {
    try {
      await addUser(token, data);
      getUsers();
      setError("");
      reset();
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
  const handleUpdateUser = async () => {
    if (!name && !username) {
      return setError("Please enter a name or username to update");
    }
    const data = {
      ...(name ? { first_name: name } : {}),
      ...(username ? { username: username } : {}),
    };
    console.log(data);

    try {
      await updateUser(token, id, data);
      setError("");
      getUsers();
      setName("");
      setUsername("");
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleUpdatePassword = async () => {
    if (!password && !confirmPassword) {
      return setError("Please enter a password to update");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    const data = {
      password: password,
      confirm_password: confirmPassword,
    };
    try {
      await updateUser(token, id, data);
      setError("");
      getUsers();
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <h1 className='text-3xl lg:text-3xl font-bold m-4 '>Manage User</h1>
      <div className='flex justify-end me-10 '>
        <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className='btn  btn-primary'>
          Create New User
        </button>
      </div>
      {users.map((user) => (
        <div key={user.id} className='m-4 flex justify-center '>
          <div className=' w-full p-3 rounded-box border border-base-content/5 bg-base-100'>
            <div className='flex  justify-between items-center'>
              <div>
                <p>
                  <strong>Name:</strong> {user.first_name}
                </p>
                <p>
                  {" "}
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  {" "}
                  <strong>User Type:</strong> {user.user_type}
                </p>
              </div>
              <div className='grid grid-cols-1'>
                <div className='grid-cols-2'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setId(user.id)}
                        className='btn m-1 btn-success'
                        variant='outline'>
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px] bg-white '>
                      <DialogHeader>
                        <DialogTitle>Edit User Info</DialogTitle>
                      </DialogHeader>
                      <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                          <Label htmlFor='name' className='text-right'>
                            Name
                          </Label>
                          <Input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setError(null)}
                            id='name'
                            placeholder='Enter new name'
                            className='col-span-3 input input-primary input-bordered'
                          />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                          <Label htmlFor='username' className='text-right'>
                            Username
                          </Label>
                          <input
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setError(null)}
                            id='username'
                            placeholder='Enter new username'
                            className='col-span-3 input input-primary input-bordered'
                          />
                        </div>
                        {error && (
                          <div className='text-error text-center'>{error}</div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button onClick={handleUpdateUser} type='submit'>
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <button
                    onClick={() => {
                      document.getElementById("my_modal_3").showModal();
                      setId(user.id);
                    }}
                    className='btn m-1 btn-error'>
                    Delete
                  </button>
                </div>
                {/* <button className='btn  m-1 btn-warning'>
                  Change Password
                </button> */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setId(user.id)}
                      className='btn  m-1 btn-warning'
                      variant='outline'>
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[425px] bg-white '>
                    <DialogHeader>
                      <DialogTitle>Update Password</DialogTitle>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='name' className='text-right'>
                          Password
                        </Label>
                        <Input
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setError(null)}
                          id='password'
                          placeholder='Enter new Password'
                          className='col-span-3 input input-primary input-bordered'
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='confirmPassword' className='text-right'>
                          Confirm Password
                        </Label>
                        <input
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => setError(null)}
                          id='confirmPassword'
                          placeholder='Enter Confirm Password'
                          className='col-span-3 input input-primary input-bordered'
                        />
                      </div>
                      {error && (
                        <div className='text-error text-center'>{error}</div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button onClick={handleUpdatePassword} type='submit'>
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      ))}
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
              {error && <div className='text-error text-center'>{error}</div>}
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
    </div>
  );
};

export default ManageUser;
