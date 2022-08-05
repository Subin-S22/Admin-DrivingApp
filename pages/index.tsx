import type { NextPage } from "next";
import Head from "next/head";
import DashboardCard from "../components/dashboardCard";
import NavBar from "../components/navBar";
import NavigationBar from "../components/navigationBar";

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
  // {
  //   name: 'Add Sessions',
  //   image: '/session.webp',
  // },
  {
    name: "Sessions",
    image: "/today.webp",
  },
];

const Home: NextPage = () => {
  // const token = useLocalStorage("token");
  return (
    <main className=" min-h-screen">
      <Head>
        <title>CarX | Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <NavigationBar />
      {/* <h1 classNameName="text-2xl uppercase font-Patua text-center mt-8">welcome driving school</h1> */}
      <section>
        {/* <section className="hidden">
          <div className="w-60 p-1 px-4 mt-8  min-h-fit max-h-screen shadow-md bg-white  sticky top-[60px]">
            <ul className="relative">
              {sideBar.map((name) => {
                return <Sidebar name={name} />;
              })}
            </ul>
          </div>
        </section> */}
        {/* <section className="h-max p-4 bg-gray-100 ">
          <ul className="flex gap-2 rounded-md justify-center flex-wrap">
            {sideBar.map((name) => {
              return (
                <li className="p-2 rounded-md text-md md:text-lg">
                  <button
                    className="btn"
                    onClick={() => sidebarRoute(name, navigate)}
                  >
                    {name}
                  </button>
                </li>
              );
            })}
          </ul>
        </section> */}
        <section
          className="flex gap-4 flex-wrap justify-center items-center 
        md:ml-10 md:mt-8 h-max m-1 md:m-0"
        >
          {dashboardInfo.map((info) => (
            <DashboardCard info={info} />
          ))}
        </section>
      </section>
    </main>
  );
};

export default Home;
