import { PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import MyModal from "../components/Dialog";
import Loader from "../components/Loader";
import NavBar from "../components/navBar";
import NavigationBar from "../components/navigationBar";
import SessionDialogForm from "../components/sessionDialogForm";
import { axiosWithAuth } from "../services";
import { MyContext } from "../store/context";
import { onError } from "../utils/helpers";

const headings = [
  "Trainer Name",
  "Customer Name",
  "Schedule Date",
  "Schedule Time",
  "Actions",
];

function TodaySessions() {
  const [forEdit, setForEdit] = useState<any>({});
  const store = useContext(MyContext);
  const { actions } = store;
  const queryClient = useQueryClient();

  const styles = {
    tableContent:
      "text-md capitalize text-gray-900 font-medium px-6 py-4 md:whitespace-nowrap",
    tableRowBorder: "border-b border-gray-300",
  };

  const deleteSession = async () => {
    try {
      await axiosWithAuth.delete(`/admin/delete/user/schedule/${forEdit._id}`);

      toast.error("Delete successfully");

      store.actions.handleDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const [filter, setFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("PENDING");

  const fetchSessions = async () => {
    return await axiosWithAuth.get("/admin/getAllSchedules");
  };

  const { data, isLoading } = useQuery(["all-sessions"], fetchSessions, {
    onError: onError,
    select: (data) => {
      const temp = data.data.schedules.filter((schedule: any) => {
        return (
          (schedule.scheduledate.includes(filter) ||
            schedule.scheduletime.includes(filter) ||
            schedule.trainerdetails.trainername
              .toLowerCase()
              .includes(filter?.toLowerCase()) ||
            schedule.user.name.toLowerCase().includes(filter?.toLowerCase())) &&
          schedule.status === status
        );
      });
      return temp;
    },
  });

  const { mutate: onDelete } = useMutation(deleteSession, {
    onSuccess: () => {
      queryClient.invalidateQueries(["all-sessions"]);
    },
  });

  if (isLoading) return <Loader />;

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
            <div className="relative flex items-center justify-center gap-4">
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
              <select
                className="border border-gray-200 p-[0.7rem] rounded-lg shadow-lg text-gray-500 focus:outline-none focus:border-gray-300"
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                value={status}
              >
                <option hidden>select status to filter...</option>
                <option value="PENDING" className="font-semibold">
                  Pending
                </option>
                <option value="COMPLETED" className="font-semibold">
                  Completed
                </option>
                <option value="CANCELLED" className="font-semibold">
                  Canceled
                </option>
              </select>
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
                {data?.map((item: any) => (
                  <tr className={styles.tableRowBorder} key={item._id}>
                    <td
                      className={
                        styles.tableContent + " flex items-center gap-3"
                      }
                    >
                      <label className="whitespace-nowrap">
                        {item.trainerdetails.trainername}{" "}
                      </label>
                    </td>
                    <td className={styles.tableContent}>{item.user.name}</td>
                    <td className={styles.tableContent}>{item.scheduledate}</td>
                    <td className={styles.tableContent + " flex items-center"}>
                      <label className="mr-8">{item.scheduletime}</label>
                    </td>
                    <td>
                      {item.status === "PENDING" ||
                      item.status === "CANCELLED" ? (
                        <button
                          className="btn bounce danger mr-6"
                          onClick={() => {
                            setForEdit(item);
                            actions.handleDialogOpen(true);
                          }}
                        >
                          delete
                        </button>
                      ) : (
                        <div
                          className={`text-sm font-bold ${
                            item.status === "COMPLETED"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {item.status}
                        </div>
                      )}
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
      <MyModal doDelete={onDelete} />
      <SessionDialogForm />
    </>
  );
}

export default TodaySessions;
