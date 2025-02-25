/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./UI/Card";
import { cn } from "../lib/utils";
import { Input } from "./UI/Input";
import { Label } from "./UI/Label";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../Context/Context";
import { useNavigate } from "react-router";

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const { setError, error, user, UserLogin } = useContext(AuthContext);

  const handleLogin = async (data) => {
    await UserLogin(data);
    reset();
  };

  useEffect(() => {
    if (user && user.user_type) {
      if (user.user_type === "admin") {
        navigate("/admin");
      }
    }
  }, [user, navigate]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold '>Login</CardTitle>
          <CardDescription>
            Enter your username and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  type='text'
                  {...register("username")}
                  placeholder='Enter your username'
                  required
                  onFocus={() => setError(null)}
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  required
                  {...register("password")}
                  onFocus={() => setError(null)}
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
        </CardContent>
      </Card>
    </div>
  );
}
