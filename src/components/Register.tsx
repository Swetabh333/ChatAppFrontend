import { Link } from "react-router-dom";
import React, { useState } from "react";
import "../assets/styles/register.css";
import axiosInstance from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import avatar from "../assets/images/avatar.svg";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCPassword] = useState<string>("");
  const [email, setEMail] = useState<string>("");
  const formSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const post = await axiosInstance.post("/auth/register", {
      username,
      email,
      password,
    });
    console.log(post);
    if (post.status === 200) {
      toast(
        <div className="flex ">
          <img alt="SVG" src={avatar} height={"20px"} width={"24px"} />
          <span className="ml-4 mr-2">User Created</span>
        </div>,
        {
          progressStyle: {
            background: "#1E90FF",
          },
        },
      );
    } else {
      toast.error(`${post.data.status}`);
    }
  };
  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="h-screen flex flex-col justify-center items-center bg-black">
        <p className="text-white text-5xl mb-8">
          Join <span className="text-Blue">WeChat</span>
        </p>
        <form className="bg-darkBlack rounded-xl text-white flex flex-col justify-center items-center">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="w-5/6 h-10 border-none text-white bg-darkBlack outline-none p-2 my-6"
          />
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => {
              setEMail(e.target.value);
            }}
            className="w-5/6 h-10 text-white border-none bg-darkBlack outline-none p-2 my-6"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="on"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-5/6 h-10  border-none text-white bg-darkBlack outline-none p-2 my-4"
          />
          <input
            type="password"
            autoComplete="on"
            placeholder="Confirm password"
            value={cpassword}
            onChange={(e) => {
              setCPassword(e.target.value);
            }}
            className="w-5/6 h-10  border-none text-white bg-darkBlack outline-none p-2 my-6"
          />

          <button
            onClick={formSubmit}
            className="bg-Blue w-5/6 h-10 rounded-lg  font-semibold p-2 my-6"
          >
            Register
          </button>
          <p className="nav">
            Already registered?{"  "}
            <Link to="/" className="text-Blue">
              Login.
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
