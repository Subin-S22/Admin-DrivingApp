import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import Head from "next/head";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomField from "../components/customField";
import CarLogo from "../public/carlogo.webp";
import baseUrl from "../services";
import Loader from "../components/Loader";

interface LoginProps {
  email: string;
  password: string;
}
function login() {
  //navigation
  const navigate = useRouter();

  //initial values for the login page
  const initialValues: LoginProps = { email: "", password: "" };

  const adminLogin = async (values: LoginProps) => {
    return await baseUrl.post("/admin/login", values);
  };

  const useAdminLogin = () => {
    return useMutation(adminLogin, {
      onSuccess: (data: any) => {
        localStorage.setItem("token", data.data.access_token);
        toast.success("Welcome!!", {
          position: "top-right",
        });
        navigate.push("/");
      },
      onError: (error: any) => {
        toast.error(error.response?.data.message, {
          position: "top-right",
        });
      },
    });
  };

  const { mutate, isLoading } = useAdminLogin();

  //submit on login clicked
  const handleSubmit = async (values: LoginProps) => {
    try {
      mutate(values);
    } catch (err) {
      toast.error("Invalid Credentials", {
        position: "top-right",
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Fragment>
      <Head>
        <title>CarX | Login</title>
      </Head>
      <div
        className="flex min-h-screen flex-col items-center justify-center py-2 
          bg-gradient-to-tr from-gray-200 via-gray-400 to-gray-600"
      >
        <div
          className="rounded shadow-md p-4 md:p-8 lg:p-12 bg-gray-200 flex 
        flex-col md:flex-row md:items-center md:gap-4 w-[70%] md:w-[30%]"
        >
          <div className="w-full">
            <div className="relative w-full aspect-square mx-auto hidden md:block">
              <h1
                className="text-center font-Tiro underline font-bold text-2xl
               whitespace-nowrap"
              >
                Driving School
              </h1>
              <Image src={CarLogo} layout="fill" />
            </div>
            <div className="relative w-full mb-6 mx-auto md:hidden block">
              <h1 className="text-center font-Tiro underline font-bold text-2xl">
                Driving School
              </h1>
            </div>
            <div>
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                  <CustomField
                    name="email"
                    type="email"
                    lable="Email"
                    placeholder="email address"
                  />
                  <CustomField
                    name="password"
                    type="password"
                    lable="Password"
                    placeholder="password"
                  />
                  <button
                    className="w-full rounded-md btn mt-4 
                  p-1 font-Patua bounce"
                    type="submit"
                  >
                    Login
                  </button>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default login;
