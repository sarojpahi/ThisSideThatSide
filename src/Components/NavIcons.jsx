import Link from "next/link";
import React from "react";

export const NavIcons = ({ children, link }) => {
  return (
    <Link href={link}>
      <div className="bg-blue-700 text-white p-3 rounded-lg inline-block">
        {children}
      </div>
    </Link>
  );
};
