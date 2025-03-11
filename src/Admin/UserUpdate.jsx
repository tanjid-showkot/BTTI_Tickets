/** @format */

import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "../Components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../Components/UI/Card";
import { Input } from "../Components/UI/Input";
import { Label } from "../Components/UI/Label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../Components/UI/Tabs";
import { updateUser } from "../Api/Api";
import AuthContext from "../Context/Context";

export function UserUpdate(props) {
  const id = props.id;
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

  return (
    <Tabs defaultValue='account' className='w-[400px]'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='account'>Account</TabsTrigger>
        <TabsTrigger value='password'>Password</TabsTrigger>
      </TabsList>
      <TabsContent value='account'>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your or user account here. Click save when you're
              done.
            </CardDescription>
          </CardHeader>
          <CardContent className=''>
            <div className='grid gap-2 '>
              <div>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => {
                    setUserError("");
                    setUserSuccess("");
                  }}
                  id='name'
                  placeholder='Enter new name'
                  className='col-span-3 input input-primary input-bordered'
                />
              </div>
              <div>
                <Label htmlFor='username' className='text-right'>
                  Username
                </Label>
                <Input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => {
                    setUserError("");
                    setUserSuccess("");
                  }}
                  id='nUsername'
                  placeholder='Enter new username'
                  className='col-span-3 input input-primary input-bordered'
                />
              </div>
              {userError && (
                <div className='text-error font-medium bg-rose-100 py-2 rounded-md text-center'>
                  {userError}
                </div>
              )}
              {userSuccess && (
                <div className='text-success font-medium bg-green-100 py-2 rounded-md text-center'>
                  {userSuccess}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className='justify-end'>
            <Button onClick={handleUpdateUser}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value='password'>
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your or user password here. After saving, you'll be logged
              out.
            </CardDescription>
          </CardHeader>
          <CardContent className=''>
            <div className='grid gap-2'>
              <div className=''>
                <Label htmlFor='name' className='text-right'>
                  Password
                </Label>
                <Input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => {
                    setPassError("");
                    setPassSuccess("");
                  }}
                  id='password'
                  placeholder='Enter new Password'
                  className=' input input-primary input-bordered'
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='name' className='text-right'>
                  Confirm Password
                </Label>
                <Input
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => {
                    setPassError("");
                    setPassSuccess("");
                  }}
                  id='confirmPassword'
                  placeholder='Enter Confirm Password'
                  className='input input-primary input-bordered'
                />
              </div>
              {passError && (
                <div className='text-error font-medium bg-rose-100 py-2 rounded-md text-center'>
                  {passError}
                </div>
              )}
              {passSuccess && (
                <div className='text-success font-medium bg-green-100 py-2 rounded-md text-center'>
                  {passSuccess}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className='justify-end'>
            <Button onClick={handleUpdatePassword}>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

UserUpdate.propTypes = {
  id: PropTypes.string.isRequired,
  getUsers: PropTypes.func,
};
