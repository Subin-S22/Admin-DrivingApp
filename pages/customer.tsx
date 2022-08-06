import { PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import CustomerFormDialog from "../components/customerDialogForm";
import MyDialog from "../components/Dialog";
import NavBar from "../components/navBar";
import NavigationBar from "../components/navigationBar";
import { axiosWithAuth } from "../services";
import { MyContext } from "../store/context";
import { onError } from "../utils/helpers";

const headings = [
  "Bill Number",
  "Customer Name",
  "Email",
  "Customer Mobile Number",
  "Started Date",
  "End Date",
  "Number of Classes",
];

function Customer() {
  const store = useContext(MyContext);
  const [forEdit, setForEdit] = useState<any>({});
  const { actions } = store;
  const queryClient = useQueryClient();

  const styles = {
    tableContent:
      "text-md capitalize text-gray-900 font-medium px-6 py-4 md:whitespace-nowrap",
    tableRowBorder: "border-b border-gray-300",
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter(value);
  };

  const deleteCustomer = async () => {
    try {
      await axiosWithAuth.delete(`/admin/deleteUser/${forEdit._id}`);
      store.actions.handleDialogOpen(false);
      toast.error("Deleted Successfully", {
        position: "top-right",
      });
      // fetchAllCustomers();
    } catch (err) {
      toast.error("Something went error", {
        position: "top-right",
      });
    }
  };

  const [filter, setFilter] = useState<string>("");
  const fetchCustomers = async () => {
    return await axiosWithAuth.get("/admin/getAllUsers");
  };

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery(["all-customers"], fetchCustomers, {
    onError: onError,
    select: (data) => {
      const temp = data.data.users.filter(
        (customer: any) =>
          customer.name.includes(filter) ||
          customer.email.includes(filter) ||
          customer.phonenumber.includes(filter)
      );
      return temp;
    },
  });
  const { mutate: onDelete } = useMutation(deleteCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries(["all-customers"]);
    },
  });

  if (isLoading) return <h1 className="text-center text-2xl">....Loading</h1>;

  if (isError) return <h1 className="text-center text-2xl">....Error</h1>;

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
              {users?.map((customer: any) => (
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
                        setForEdit(customer);
                        actions.handleDialogOpen(true);
                      }}
                    >
                      delete
                    </button>
                    <button
                      className="btn bounce"
                      onClick={() => {
                        setForEdit(customer);
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
      </main>
      <MyDialog doDelete={onDelete} />
      <CustomerFormDialog form={forEdit} />
    </>
  );
}

export default Customer;
