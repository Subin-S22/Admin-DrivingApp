import { PlusIcon, SearchIcon } from "@heroicons/react/solid";
import Head from "next/head";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomerFormDialog from "../components/customerDialogForm";
import MyDialog from "../components/Dialog";
import NavBar from "../components/navBar";
import NavigationBar from "../components/navigationBar";
import baseAxios from "../services";
import useLocalStorage from "../sharedHooks/useLocalStorage";
import { MyContext } from "../store/context";

// interface customerProps {
//   billnumber: string;
//   email: string;
//   phonenumber: string;
//   name: string;
//   startDate: string;
//   endDate: string;
//   password: string;
//   allowschedule: string;
// }

const headings = [
  "Bill Number",
  "Customer Name",
  "Email",
  "Customer Mobile Number",
  "Started Date",
  "End Date",
  "Number of Classes",
];

// const customerDetails: customerProps[] = [
//   {
//     billNumber: 1,
//     customerName: 'saldkfj',
//     customerMobileNumber: '8979823749873',
//     date: '21/2/2020',
//     numberOfClasses: 3,
//   },
//   {
//     billNumber: 2,
//     customerName: 'glkjlkr',
//     customerMobileNumber: '8979823749873',
//     date: '21/2/2020',
//     numberOfClasses: 3,
//   },
//   {
//     billNumber: 3,
//     customerName: 'kgjuri',
//     customerMobileNumber: '8979823749873',
//     date: '21/2/2020',
//     numberOfClasses: 3,
//   },
//   {
//     billNumber: 4,
//     customerName: 'jlkdjsflkj',
//     customerMobileNumber: '8979823749873',
//     date: '21/2/2020',
//     numberOfClasses: 3,
//   },
//   {
//     billNumber: 5,
//     customerName: 'jlkdjsflkj',
//     customerMobileNumber: '8979823749873',
//     date: '21/2/2020',
//     numberOfClasses: 3,
//   },
//   {
//     billNumber: 6,
//     customerName: 'jlkdjsflkj',
//     customerMobileNumber: '8979823749873',
//     date: '21/2/2020',
//     numberOfClasses: 3,
//   },
// ];

function Customer() {
  const store = useContext(MyContext);
  const [allCustomer, setAllCustomer] = useState<any>([]);
  const [copyallCustomer, setcopyAllCustomer] = useState<any>([]);
  const [forEdit, setForEdit] = useState<any>({});
  const { actions, data } = store;
  const token = useLocalStorage("token");
  const styles = {
    tableContent:
      "text-md capitalize text-gray-900 font-medium px-6 py-4 md:whitespace-nowrap",
    tableRowBorder: "border-b border-gray-300",
  };

  // const [trainer, setTrainer] = useState<customerProps[]>(customerDetails);
  // const [trainerCopy, setTrainerCopy] =
  //   useState<customerProps[]>(customerDetails);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const allcust = copyallCustomer.filter((item: any) => {
      return (
        item.name.toLowerCase().includes(value) ||
        item.phonenumber.includes(value)
      );
    });
    setAllCustomer(allcust);
  };

  useEffect(() => {
    if (data.onsuccess) {
      fetchAllCustomers();
      actions.updateOnChange(false);
    }
  }, [data.onsuccess]);
  useEffect(() => {
    console.log(token);
    if (token) {
      fetchAllCustomers();
    }
  }, [token]);

  const fetchAllCustomers = async () => {
    try {
      const res = await baseAxios.get("/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setAllCustomer(res.data.users);
      setcopyAllCustomer(res.data.users);
      return res;
    } catch (err) {
      console.log(err);
      toast.error("Error while fetching!", {
        position: "top-right",
      });
    }
  };

  const deleteCustomer = () => {
    try {
      baseAxios.delete(`/admin/deleteUser/${forEdit._id}`, {
        headers: {
          Authorization: `Bearer ${store.data.token}`,
        },
      });
      store.actions.handleDialogOpen(false);
      toast.error("Deleted Successfully", {
        position: "top-right",
      });
      fetchAllCustomers();
    } catch (err) {
      toast.error("Something went error", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Head>
        <title>CarX | Customer</title>
      </Head>
      <main>
        <NavBar />
        <NavigationBar />
        <div className=" mt-2  flex justify-between items-end p-2">
          <div className="w-3/4">
            <h1 className="text-xl font-Patua font-bold p-2">Customer</h1>
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
              onClick={() => actions.handleFormDialogOpen(true)}
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
              {allCustomer.map((customer: any, index: number) => (
                <tr className={styles.tableRowBorder} key={customer._id}>
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
                      {customer.billnumber}
                    </label>
                  </td>
                  <td className={styles.tableContent}>{customer.name}</td>
                  <td className={styles.tableContent}>{customer.email}</td>
                  <td className={styles.tableContent}>
                    {customer.phonenumber}
                  </td>
                  <td className={styles.tableContent}>{customer.startDate}</td>
                  <td className={styles.tableContent}>{customer.endDate}</td>
                  <td className={styles.tableContent + " flex items-center"}>
                    <label className="mr-8">{customer.allowschedule}</label>
                    <button
                      className="btn bounce danger mr-6"
                      onClick={() => {
                        setForEdit(allCustomer[index]);
                        actions.handleDialogOpen(true);
                      }}
                    >
                      delete
                    </button>
                    <button
                      className="btn bounce"
                      onClick={() => {
                        setForEdit(allCustomer[index]);
                        actions.handleFormDialogOpen(true, true);
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
      <MyDialog doDelete={deleteCustomer} />
      <CustomerFormDialog form={forEdit} />
    </>
  );
}

export default Customer;
