import Link from "next/link";
import React from "react";

import { BsFillXDiamondFill } from "react-icons/bs";
import { NavIcons } from "./NavIcons";

export const Sidebar = () => {
  return (
    <div className="flex">
      <div className="fixed w-20 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between">
        <div className="flex flex-col items-center">
          <NavIcons link={"/"}>
            <BsFillXDiamondFill size={20} />
          </NavIcons>
          <NavIcons link={"/topics"}>
            <BsFillXDiamondFill size={20} />
          </NavIcons>
          <NavIcons link={"/bets"}>
            <BsFillXDiamondFill size={20} />
          </NavIcons>
          <NavIcons link={"/users"}>
            <BsFillXDiamondFill size={20} />
          </NavIcons>
        </div>
      </div>
    </div>
  );
};
