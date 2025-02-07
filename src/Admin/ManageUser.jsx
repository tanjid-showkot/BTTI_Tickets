/** @format */

import { useForm } from "react-hook-form";
import { Label } from "../Components/UI/Label";
import { Input } from "../Components/UI/Input";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/UI/Dialog";
import { Button } from "../Components/UI/Button";

const ManageUser = () => {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState("");
  const handleCreateUser = async (data) => {
    try {
      console.log(data);
      setError("");
      reset();
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div>
      <h1 className='text-3xl lg:text-3xl font-bold m-4 '>Manage User</h1>
      <div className='flex justify-end me-4'>
        <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className='btn  btn-primary'>
          Create New User
        </button>
      </div>
      <div className='m-4 flex justify-center '>
        <div className=' w-full p-3 rounded-box border border-base-content/5 bg-base-100'>
          <div className='flex  justify-between items-center'>
            <div>
              <p>
                <strong>Name:</strong> Ruhul
              </p>
              <p>
                {" "}
                <strong>User Name:</strong> ruhul
              </p>
              <p>
                {" "}
                <strong>User Type:</strong> Accounts
              </p>
            </div>
            <div className='grid grid-cols-1'>
              <div className='grid-cols-2'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className='btn m-1 btn-success' variant='outline'>
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[425px] bg-white '>
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='name' className='text-right'>
                          Name
                        </Label>
                        <Input
                          id='name'
                          placeholder='Pedro Duarte'
                          className='col-span-3'
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='username' className='text-right'>
                          Username
                        </Label>
                        <Input
                          id='username'
                          placeholder='@peduarte'
                          className='col-span-3'
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type='submit'>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <button className='btn m-1 btn-error'>Delete</button>
              </div>
              <button className='btn  m-1 btn-warning'>Change Password</button>
            </div>
          </div>
        </div>
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
                  id='name'
                  type='text'
                  {...register("name")}
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
                  className='select w-full validator'
                  {...register("userType")}
                  id='userType'
                  required>
                  <option disabled selected value=''>
                    Choose:
                  </option>
                  <option>Admin</option>
                  <option>Accounts</option>
                  <option>Validator</option>
                </select>
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <Input
                  id='password'
                  type='password'
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
                  type='password'
                  required
                  {...register("ConfirmPassword")}
                />
              </div>
              {error && <div className='text-error text-center'>{error}</div>}
              <input
                type='submit'
                value={"Login"}
                className=' w-full btn btn-primary '
              />
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ManageUser;
