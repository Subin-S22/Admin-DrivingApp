import React, { useState } from "react";
import useLocalStorage from "../sharedHooks/useLocalStorage";

interface ContextProp {
  children: React.ReactNode;
}

interface StoreProp {
  data: {
    isDialogOpen: boolean;
    isFormDialogOpen: boolean;
    auth: string | undefined;
    isEdit: boolean | undefined;
    token: string | null;
    onsuccess: boolean;
  };
  actions: {
    handleDialogOpen: (isOpen: boolean) => void;
    handleFormDialogOpen: (isOpen: boolean, edit?: boolean) => void;
    handleAuthInfo: (token: string) => void;
    isUserAuth: () => boolean | undefined;
    updateOnChange: (isSuccess: boolean) => void;
  };
}

export const MyContext = React.createContext<StoreProp>({
  data: {
    isDialogOpen: false,
    isFormDialogOpen: false,
    auth: undefined,
    isEdit: false,
    token: null,
    onsuccess: false,
  },
  actions: {
    handleDialogOpen(isOpen: boolean) {
      return;
    },
    handleFormDialogOpen(isOpen: boolean, edit?: boolean) {
      return;
    },
    handleAuthInfo(token: string) {
      return;
    },
    isUserAuth() {
      return false;
    },
    updateOnChange(isSuccess: boolean) {
      return;
    },
  },
});

const Provider = ({ children }: ContextProp) => {
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean | undefined>(false);
  const [auth, setAuth] = useState<string | undefined>();
  const token = useLocalStorage("token");
  const [onsuccess, setonSuccess] = useState(false);

  const isUserAuth = () => {
    if (!auth) return false;
  };

  const data = {
    isDialogOpen,
    isFormDialogOpen,
    auth,
    isEdit,
    token,
    onsuccess,
  };

  const actions = {
    handleDialogOpen: (isOpen: boolean) => {
      setDialogOpen(isOpen);
    },
    handleFormDialogOpen: (isOpen: boolean, edit?: boolean) => {
      setIsFormDialogOpen(isOpen);
      setIsEdit(edit);
    },
    handleAuthInfo: (token: string) => {
      localStorage.setItem("token", token);
      setAuth(token);
    },
    isUserAuth,
    updateOnChange: (isSuccess: boolean) => {
      setonSuccess(isSuccess);
    },
  };

  const store: StoreProp = {
    data,
    actions,
  };

  return <MyContext.Provider value={store}>{children}</MyContext.Provider>;
};

export default Provider;
