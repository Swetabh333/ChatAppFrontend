import React, { useState } from "react";
import "../assets/styles/contact.css";
import { Dispatch, SetStateAction } from "react";

type Online = {
  userId: string;
  username: string;
};

interface props {
  onlinePeople: Online[] | null;
  username: string;
  selected: boolean;
  id: string;
  clickHandler: Dispatch<SetStateAction<string>>;
}

const Contact: React.FC<props> = ({
  username,
  selected,
  id,
  clickHandler,
  onlinePeople,
}) => {
  const check = (name:string)=>{
		if(onlinePeople){
			for(let i of onlinePeople){
				if(i.username == name){
					return true;
				}
			}
			return false;
		}
	}

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
    "bg-orange-200",
    "bg-pink-200",
    "bg-yellow-200",
    "bg-teal-200",
  ];
  const hash = Math.abs(hashCode(username));
  const color = bgColors[hash % bgColors.length];

  return (
    <div className="w-full h-20  flex b" onClick={() => clickHandler(id)}>
      {selected && <div className="w-2 mr-3 bg-Blue h-full"></div>}
      <div className="w-full flex mx-2  items-center">
        <div
          className={
            "rounded-full h-8 w-8 flex items-center justify-center text-gray-700 relative " +
            color
          }
        >
          {username.slice(0, 2)}
          {check(username) && (
            <div className="rounded-full h-2 w-2 bg-green-600 absolute bottom-0 left-0"></div>
          )}
        </div>
        <div className="mx-4 text-lg text-white">{username}</div>
      </div>
    </div>
  );
};

export default Contact;
