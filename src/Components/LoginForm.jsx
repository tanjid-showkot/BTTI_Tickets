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
import { useContext, useEffect } from "react";
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
      if (user.user_type === "admin" || user.user_type === "superadmin") {
        navigate("/admin");
      } else if (user.user_type === "verifier") {
        navigate("/verifier");
      }
    }
  }, [user, navigate]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className='soft-card border-0 p-1'>
        <CardHeader className='rounded-t-2xl bg-sky-50 px-6 pb-4 pt-6'>
          <CardTitle className='text-2xl font-bold text-slate-800'>
            Login
          </CardTitle>
          <CardDescription className='text-sm text-slate-600'>
            Enter your username and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className='px-6 pb-6 pt-5'>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className='flex flex-col gap-5'>
              <div className='grid gap-2'>
                <Label
                  htmlFor='username'
                  className='text-sm font-semibold text-slate-700'>
                  Username
                </Label>
                <Input
                  id='username'
                  type='text'
                  {...register("username")}
                  placeholder='Enter your username'
                  required
                  className='app-input h-12'
                  onFocus={() => setError(null)}
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label
                    htmlFor='password'
                    className='text-sm font-semibold text-slate-700'>
                    Password
                  </Label>
                </div>
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  required
                  {...register("password")}
                  className='app-input h-12'
                  onFocus={() => setError(null)}
                />
              </div>
              {error && (
                <div className='rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-sm font-medium text-rose-600'>
                  {error}
                </div>
              )}
              <input
                type='submit'
                value={"Login"}
                className='app-btn app-btn-primary w-full border-0 cursor-pointer'
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
