import { useRouter } from "next/router";
import React from "react";

export default function withAuth<T extends object>(
  Component: React.ComponentType<T>
) {
  // eslint-disable-next-line react/display-name
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
}
