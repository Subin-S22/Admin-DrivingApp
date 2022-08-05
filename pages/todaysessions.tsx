import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import NavBar from "../components/navBar";
import NavigationBar from "../components/navigationBar";
import { PlusIcon, SearchIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { MyContext } from "../store/context";
import MyModal from "../components/Dialog";
import SessionDialogForm from "../components/sessionDialogForm";
import baseAxios from "../services";
import { toast } from "react-toastify";
import useLocalStorage from "../sharedHooks/useLocalStorage";

type Props = {};

const headings = [
  "Trainer Name",
  "Customer Name",
  "Schedule Date",
  "Schedule Time",
];

// const schedules = [
//   {
//     trainername: "asdlfkj",
//     customername: "alskdj",
//     scheduledate: "alskdj",
//     scheduletime: "alkdfj",
//   },
// ];

function TodaySessions({}: Props) {
  const [forEdit, setForEdit] = useState<any>({});
  const [allSchedules, setAllSchedules] = useState<any>([]);
  const [filterSchedules, setFilterSchedules] = useState<any>([]);
  const store = useContext(MyContext);
  const { actions } = store;
  const token = useLocalStorage("token");

  const styles = {
    tableContent:
      "text-md capitalize text-gray-900 font-medium px-6 py-4 md:whitespace-nowrap",
    tableRowBorder: "border-b border-gray-300",
  };

  const deleteSession = async () => {
    try {
      await baseAxios.delete(`/admin/delete/user/schedule/${forEdit._id}`, {
        headers: {
          Authorization: `Bearer ${store.data.token}`,
        },
      });
      toast.error("Delete successfully");
      store.actions.handleDialogOpen(false);
      fetchAllSchedules();
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const fetchAllSchedules = async () => {
    try {
      const res = await baseAxios.get("/admin/getAllSchedules", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllSchedules(res.data.schedules);
      setFilterSchedules(res.data.schedules);
      console.log(res.data);
    } catch (err: any) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const temp = filterSchedules.filter(
      (item: any) =>
        item.trainerdetails.trainername
          .toLowerCase()
          .includes(e.target.value) ||
        item.scheduledate.includes(e.target.value)
    );
    setAllSchedules(temp);
  };

  useEffect(() => {
    if (token) fetchAllSchedules();
  }, [token]);

  useEffect(() => {
    if (store.data.onsuccess) {
      fetchAllSchedules();
      store.actions.updateOnChange(false);
    }
  }, [store.data.onsuccess]);

  return (
    <>
      <Head>
        <title>CarX | Trainers</title>
      </Head>
      <main>
        <NavBar />
        <NavigationBar />
        <div className="mt-2  flex justify-between items-end p-2">
          <div className="w-3/4">
            <h1 className="text-xl font-Patua font-bold p-2">Sessions</h1>
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-600" />
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border 
            border-gray-300 text-gray-900 text-sm rounded-lg focus:border-white 
              block pl-10 p-2.5 outline-none w-full shadow-md font-Patua"
                placeholder="Search"
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="w-full">
            <div
              className="w-max flex gap-2 justify-center items-center btn bounce float-right "
              onClick={() => actions.handleFormDialogOpen(true)}
            >
              <PlusIcon className="w-5 h-5 text-white" />
              <button>Add</button>
            </div>
          </div>
        </div>
        <section>
          <div className="overflow-auto">
            <table className="table-auto w-full mx-auto mt-5 font-Patua">
              <thead className="border-b border-gray-100 bg-gray-200 rounded-t-lg">
                <tr className={styles.tableRowBorder}>
                  {headings.map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="text-sm md:text-md text-left font-semibold text-gray-400 
            px-6 py-4 uppercase"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSchedules.map((item: any, index: number) => (
                  <tr className={styles.tableRowBorder} key={item._id}>
                    <td
                      className={
                        styles.tableContent + " flex items-center gap-3"
                      }
                    >
                      <Image
                        src="/avatar.webp"
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <label className="whitespace-nowrap">
                        {item.trainerdetails.trainername}{" "}
                      </label>
                    </td>
                    <td className={styles.tableContent}>{item.userid}</td>
                    <td className={styles.tableContent}>{item.scheduledate}</td>
                    <td className={styles.tableContent + " flex items-center"}>
                      <label className="mr-8">{item.scheduletime}</label>
                      <button
                        className="btn bounce danger mr-6"
                        onClick={() => {
                          setForEdit(allSchedules[index]);
                          actions.handleDialogOpen(true);
                        }}
                      >
                        delete
                      </button>
                      {/* <button
                        className="btn bounce"
                        onClick={() => {
                          setForEdit(allSchedules[index]);
                          actions.handleFormDialogOpen(true, true);
                        }}
                      >
                        edit
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <MyModal doDelete={deleteSession} />
      <SessionDialogForm />
    </>
  );
}

export default TodaySessions;
