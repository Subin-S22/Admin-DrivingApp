import { useRouter } from "next/router";
import React from "react";

// const links = ["Home", "Customer", "Trainer"];
// type Props = {};

export default function NavBar() {
  const navigate = useRouter();

  //handling the link in the navbar
  // const handleLinks = (link: string) => {
  //   switch (link) {
  //     case "Home":
  //       navigate.replace("/");
  //       break;
  //     case "Trainer":
  //       navigate.push("/trainer");
  //       break;
  //     case "Customer":
  //       navigate.push("/customer");
  //       break;
  //     default:
  //       navigate.replace("/");
  //   }
  // };

  return (
    <nav
      className="bg-gray-500  border-gray-200 px-2 sm:px-4 py-2.5 sticky top-0
     dark:bg-gray-800 z-[2]"
    >
      <div className="flex justify-between">
        <div>
          <h1
            className="text-lg sm:text-xl md:text-3xl text-white cursor-pointer"
            onClick={() => navigate.push("/")}
          >
            CarX
          </h1>
        </div>
        {/* <div className="hidden md:block">
          <ul className=" md:flex md:gap-4 font-Patua">
            {links.map((link) => (
              <li
                key={link}
                className="text-lg md:text-xl text-white hover:text-gray-400 bounce 
              cursor-pointer"
                onClick={() => handleLinks(link)}
              >
                {link}
              </li>
            ))}
          </ul>
        </div> */}
        <div className="block">
          <button
            className="btn bounce"
            onClick={() => {
              localStorage.removeItem("token");
              navigate.push("/login");
            }}
          >
            Logout
          </button>
        </div>
        {/* <div className="md:hidden relative">
          <DotsHorizontalIcon className="w-5 h-5 text-gray-700 border-white border m-2" />
          <ul className="absolute -right-2 w-max isolate">
            {links.map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </div> */}
      </div>
    </nav>
  );
}
