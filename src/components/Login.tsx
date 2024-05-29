import React, { useEffect, useState } from "react";
import "../assets/styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setAuthorized, setUser, setId } from "./state/authState/authSlice";
import { RootState } from "@reduxjs/toolkit/query";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthorized, redirected } = useSelector(
    (state: RootState) => state.authReducer,
  );
  useEffect(() => {
    axiosInstance.get("/auth/verifytoken/").then((res) => {
      if (res.status === 200) {
        dispatch(setAuthorized(true));
        if (res.data.user && res.data.id) {
          dispatch(setUser(res.data.user));
          dispatch(setId(res.data.id));
        }
        if (redirected) {
          navigate(redirected, { replace: true });
        } else {
          navigate("/chat");
        }
      }
    });
  }, [dispatch, isAuthorized]);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const sendLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    try {
      const test = await axiosInstance.post("/auth", {
        username,
        password,
      });
      if (test.status === 200) {
        if (!test.data.msg) {
          if (username) {
            dispatch(setUser(username));
            dispatch(setId(test.data.id));
          }
          navigate("/chat");
        } else {
          toast.error(`${test.data.msg}`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="h-screen flex flex-col justify-center items-center bg-black">
        <p className="text-white text-5xl mb-8">
          Login to <span className="text-Blue">WeChat</span>
        </p>
        <form className="bg-darkBlack rounded-xl text-white flex flex-col justify-center items-center">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="w-5/6 h-10  text-white bg-darkBlack border-none p-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="on"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-5/6 h-10  border-none text-white bg-darkBlack outline-none p-2 second"
          />
          <button
            onClick={sendLogin}
            className="bg-Blue w-5/6 h-10 rounded-lg  font-semibold p-2"
          >
            Login
          </button>
          <p className="nav">
            Don't have an account?{"  "}
            <Link to="/register" className="text-Blue">
              Signup.
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
