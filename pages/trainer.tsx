import { PlusIcon, SearchIcon } from "@heroicons/react/solid";
import Head from "next/head";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import MyModal from "../components/Dialog";
import FormDialog from "../components/FormDialog";
import NavBar from "../components/navBar";
import NavigationBar from "../components/navigationBar";
import baseAxios from "../services";
import { MyContext } from "../store/context";

const headings = [
  "Trainer Name",
  "Mobile Number",
  "Email Address",
  "Car Details",
];

function trainer() {
  const store = useContext(MyContext);
  const [allTrainers, setAllTrainers] = useState<any[]>([]);
  const [forEdit, setForEdit] = useState<any>();
  const [trainerCopy, setTrainerCopy] = useState<any[]>([]);

  const fetchAllTrainer = async () => {
    try {
      const res = await baseAxios.get("/admin/getAllTrainers", {
        headers: {
          Authorization: `Bearer ${store.data.token}`,
        },
      });
      console.log(res);
      setAllTrainers(res.data.trainers);
      setTrainerCopy(res.data.trainers);
      return res;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  useEffect(() => {
    if (store.data.onsuccess) {
      fetchAllTrainer();
      store.actions.updateOnChange(false);
    }
  }, [store.data.onsuccess]);

  useEffect(() => {
    console.log(store.data.token);
    if (store.data.token) {
      fetchAllTrainer();
    }
  }, [store.data.token]);

  // if (isLoading) return '....loading'

  // if (isError) return '...error'

  // console.log(isError, isLoading, data, error);

  const styles = {
    tableContent:
      "text-md capitalize text-gray-900 font-medium px-6 py-4 md:whitespace-nowrap",
    tableRowBorder: "border-b border-gray-300",
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const tempTrainer = trainerCopy.filter((item) => {
      return (
        item.trainername.toLowerCase().includes(value.toLowerCase()) ||
        item.phonenumber.includes(value)
      );
    });
    setAllTrainers(tempTrainer);
  };

  const deleteTrainer = async () => {
    try {
      await baseAxios.delete(`/admin/deleteTrainer/${forEdit._id}`, {
        headers: { Authorization: `Bearer ${store.data.token}` },
      });
      toast.error("Deleted successfully", { position: "top-right" });
      fetchAllTrainer();
      store.actions.handleDialogOpen(false);
    } catch (err) {
      toast.error("Something went wrong!", { position: "top-right" });
    }
  };

  const changeStatus = async (trainer: any) => {
    let status = "";
    try {
      if (trainer.status === "ONLINE") {
        status = "OFFLINE";
      } else {
        status = "ONLINE";
      }
      await baseAxios.patch(
        `/admin/editTrainer/${trainer._id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${store.data.token}`,
          },
        }
      );

      toast.success("Trainer Status updated...");
      const temp = allTrainers.map((item) => {
        if (item._id === trainer._id) return { ...item, status: status };
        return item;
      });
      setAllTrainers(temp);

      // fetchAllTrainer();
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

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
            <h1 className="text-xl font-Patua font-bold p-2">Trainers</h1>
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
          {/* <h1 className="hidden md:block text-4xl text-center w-full">Trainers</h1> */}
          <div className="w-full">
            <div
              className="w-max flex gap-2 justify-center items-center btn bounce float-right "
              onClick={() => store.actions.handleFormDialogOpen(true, false)}
            >
              <PlusIcon className="w-5 h-5 text-white" />
              <button>Add</button>
            </div>
          </div>
        </div>
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
              {allTrainers.map((trainer, index) => (
                <tr className={styles.tableRowBorder} key={trainer.phonenumber}>
                  <td
                    className={styles.tableContent + " flex items-center gap-3"}
                  >
                    <Image
                      src="/avatar.webp"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <label className="whitespace-nowrap">
                      {trainer.trainername}
                    </label>
                  </td>
                  <td className={styles.tableContent}>{trainer.phonenumber}</td>
                  <td className={styles.tableContent}>{trainer.email}</td>
                  <td className={styles.tableContent + " flex items-center"}>
                    <label className="mr-8">
                      {trainer.cardetails.make +
                        " " +
                        trainer.cardetails.model +
                        " " +
                        trainer.cardetails.vin}
                    </label>
                    <button
                      className={`btn bounce lowercase ${
                        trainer.status === "ONLINE"
                          ? "bg-green-500 hover:bg-green-600"
                          : "danger"
                      } mr-6 p-2`}
                      onClick={() => {
                        changeStatus(trainer);
                      }}
                    >
                      {trainer.status}
                    </button>
                    <button
                      className="btn bounce danger mr-6"
                      onClick={() => {
                        setForEdit(trainer);
                        store.actions.handleDialogOpen(true);
                      }}
                    >
                      delete
                    </button>
                    <button
                      className="btn bounce"
                      onClick={() => {
                        setForEdit(trainer);
                        store.actions.handleFormDialogOpen(true, true);
                      }}
                    >
                      edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <div>
          <div>

          </div>
        </div> */}
      </main>
      <MyModal doDelete={deleteTrainer} />
      <FormDialog form={forEdit} />
    </>
  );
}

export default trainer;
