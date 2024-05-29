import { useDispatch, useSelector } from "react-redux";
import React, { ReactNode, useEffect } from "react";
import { RootState } from "../state/store";
import { useNavigate, useLocation } from "react-router-dom";
import { setRedirected } from "../state/authState/authSlice";
interface Props {
  children: ReactNode;
}

const Protector: React.FC<Props> = ({ children }) => {
  const { isAuthorized } = useSelector((state: RootState) => state.authReducer);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthorized) {
      dispatch(setRedirected(location.pathname));
      navigate("/");
    }
  }, []);
  return <div>{isAuthorized && children}</div>;
};

export default Protector;
