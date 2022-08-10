import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useLocalStorage = (key: string) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(key);

    if (!token) router.push("/login");

    setToken(token);
  }, []);

  return token;
};

export default useLocalStorage;
