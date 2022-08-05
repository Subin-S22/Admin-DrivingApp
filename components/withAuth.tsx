import { useRouter } from "next/router";
import React from "react";

const withAuth = <T extends object>(Component: React.ComponentType<T>) => {
  return (props: any) => {
    if (typeof window !== "undefined") {
      const router = useRouter();

      const localToken = localStorage.getItem("token");

      if (!localToken) {
        router.replace("/login");
        return null;
      }

      return <Component {...props} />;
    }
    return null;
  };
};

export default withAuth;
