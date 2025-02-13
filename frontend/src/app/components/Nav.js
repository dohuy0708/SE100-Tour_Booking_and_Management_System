import React from "react";
import { NavLink } from "react-router-dom";

export default function Nav() {
  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Tour trong nước", path: "/search?type=domestic" },
    { name: "Tour nước ngoài", path: "/search?type=abroad" },
    { name: "Liên hệ", path: "/contact" },
  ];
  return (
    <div className="h-hnavbar flex-1 items-center bg-secd">
      <div className="max-w-7xl h-full mx-auto ">
        <div className="flex h-full">
          <ul className="flex h-full ">
            {navItems.map((items) => {
              return (
                <NavLink to={items.path}>
                  <li className="px-6 text-lg text-main font-medium cursor-pointer leading-[48px] hover:text-white hover:bg-main ">
                    {items.name}
                  </li>
                </NavLink>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
