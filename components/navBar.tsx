import { useRouter } from "next/router";
import React from "react";
import { axiosWithAuth } from "../services";
import { onError } from "../utils/helpers";

export default function NavBar() {
  const navigate = useRouter();

  const handleLogout = async () => {
    try {
      await axiosWithAuth.post("/admin/logout", {});
      localStorage.removeItem("token");
      navigate.push("/login");
    } catch (err: any) {
      onError(err);
    }
  };
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
        <div className="block">
          <button
            className="btn bounce"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
