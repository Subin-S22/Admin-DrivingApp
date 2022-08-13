import type { NextPage } from "next";
import React from "react";
import Head from "next/head";
import DashboardCard from "../components/dashboardCard";
import NavBar from "../components/navBar";
import NavigationBar from "../components/navigationBar";
import useLocalStorage from "../sharedHooks/useLocalStorage";

export interface DashBoardDetail {
  name: string;
  image: string;
  total?: number;
}

const dashboardInfo: DashBoardDetail[] = [
  {
    name: "Trainers",
    image: "/trainer.jpg",
  },
  {
    name: "Customers",
    image: "/users.webp",
  },
  {
    name: "Sessions",
    image: "/today.webp",
  },
];

const Home: NextPage = () => {
  useLocalStorage("token");
  return (
    <main className=" min-h-screen">
      <Head>
        <title>CarX | Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <NavigationBar />
      <section>
        <section
          className="flex gap-4 flex-wrap justify-center items-center 
        md:ml-10 md:mt-8 h-max m-1 md:m-0"
        >
          {dashboardInfo.map((info) => (
            <DashboardCard info={info} key={info.name} />
          ))}
        </section>
      </section>
    </main>
  );
};

export default Home;
