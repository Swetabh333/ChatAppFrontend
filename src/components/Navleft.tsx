import React from "react";
import { Dispatch, SetStateAction } from "react";
import "../assets/styles/navleft.css";

interface props {
  username: string;
  search: Dispatch<SetStateAction<string>>;
}

const Navleft: React.FC<props> = ({ username, search }) => {
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };
  const bgColors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-purple",
    "bg-pink-200",
    "bg-yellow-200",
    "bg-teal-200",
  ];
  const hash = Math.abs(hashCode(username));
  const color = bgColors[hash % bgColors.length];

  return (
    <div className="my-4 p-3 h-12 flex w-full border-b-gray-200">
      <div className="w-1/5 flex justify-center flex-col items-center">
        <div
          className={
            "rounded-full bg-yellow-100 h-8 w-7 flex items-center justify-center text-gray-700 " +
            color
          }
        >
          {username.slice(0, 2)}
        </div>
      </div>
      <div className="mx-3 w-4/5 flex items-center justify-center text-white">
        <input
          className="w-full bg-black  rounded-md text-white p-2"
          type="text"
          placeholder="Search a user..."
          onChange={(e) => search(e.target.value)}
        />
        <i className="fa-solid fa-magnifying-glass ml-4"></i>
      </div>
    </div>
  );
};
export default Navleft;
