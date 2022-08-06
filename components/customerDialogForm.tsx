import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { axiosWithAuth } from "../services";
import { MyContext } from "../store/context";
import { minDate } from "../utils/helpers";
import CustomField from "./customField";

interface CustomerProp {
  billnumber: string;
  email: string;
  phonenumber: string;
  name: string;
  startDate: string;
  endDate: string;
  allowschedule: string;
}

interface UpdateUser {
  values: CustomerProp;
  formatED: string;
}

const initial: CustomerProp = {
  billnumber: "",
  email: "",
  phonenumber: "",
  name: "",
  startDate: "",
  endDate: "",
  allowschedule: "",
};

const customerValidation = Yup.object().shape({
  billnumber: Yup.string().required("Required"),
  email: Yup.string().email().required("Required"),
  phonenumber: Yup.string()
    .min(10, "Phone number should be 10 digits")
    .required("Required"),
  name: Yup.string()
    .min(3, "Name should be atleast 3 characters")
    .required("Required."),
  startDate: Yup.date().required("Required"),
  endDate: Yup.date().required("Required"),
  allowschedule: Yup.number().required("Required"),
});

export default function CustomerFormDialog({ form }: any) {
  const [initialValues, setInitialValues] = useState<CustomerProp>(initial);
  const store = useContext(MyContext);
  const { data } = store;
  const queryClient = useQueryClient();

  function closeModal() {
    store.actions.handleFormDialogOpen(false);
  }

  const addUser = async (values: CustomerProp) => {
    return await axiosWithAuth.post("/admin/addUser", values);
  };

  const useUser = () => {
    return useMutation(addUser, {
      onSuccess: () => {
        store.actions.updateOnChange(true);
        store.actions.handleFormDialogOpen(false);
        toast.success("User added successfully");
        queryClient.invalidateQueries(["all-customers"]);
      },
      onError: (error: AxiosError<any>) => {
        toast.error(error.response?.data.message);
      },
    });
  };

  useEffect(() => {
    if (data.isEdit) {
      //data from the backend for the edit
      form.endDate = form.endDate.split("/").reverse().join("-");
      setInitialValues(form);
    } else {
      setInitialValues(initial);
    }
  }, [data.isEdit]);

  const updateUser = async ({ values, formatED }: UpdateUser) => {
    await axiosWithAuth.patch(
      `/admin/editUser/${form._id}`,
      {
        email: values.email,
        name: values.name,
        endDate: formatED,
        allowschedule: values.allowschedule,
      },
      {
        headers: {
          Authorization: `Bearer ${store.data.token}`,
        },
      }
    );
  };

  const { mutate } = useUser();

  const { mutate: patchUser } = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["all-customers"]);
    },
  });

  const handleTrainerSubmit = async (values: CustomerProp) => {
    //start date formated
    const formatSD = new Date(values.startDate).toLocaleDateString("en-IN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    //end date formated
    const formatED = new Date(values.endDate).toLocaleDateString("en-IN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    //new object
    const newObj = {
      ...values,
      startDate: formatSD,
      endDate: formatED,
    };
    try {
      if (data.isEdit) {
        patchUser({ values, formatED });
        toast.success("Customer edited succesfully", {
          position: "top-right",
        });
        store.actions.updateOnChange(true);
        store.actions.handleFormDialogOpen(false);
      } else {
        mutate(newObj);
      }
    } catch (err: any) {
      toast.error(err.response?.data.message, {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Transition appear show={data.isFormDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 font-Patua"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-25"
              aria-hidden="true"
            />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-6"
                  >
                    Add User Details
                  </Dialog.Title>
                  <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={handleTrainerSubmit}
                    validationSchema={customerValidation}
                  >
                    <Form>
                      <CustomField
                        name="name"
                        lable="Name"
                        placeholder="Enter the Customer name..."
                      />
                      {!data.isEdit && (
                        <CustomField
                          name="billnumber"
                          type="text"
                          lable="Bill Number"
                          disabled={data.isEdit}
                          placeholder="Enter the Bill number..."
                        />
                      )}
                      <CustomField
                        name="email"
                        lable="Email Address"
                        type="email"
                        placeholder="Enter email address..."
                      />
                      {!data.isEdit && (
                        <CustomField
                          name="phonenumber"
                          lable="Phone Number"
                          type="text"
                          disabled={data.isEdit}
                          placeholder="Enter the Phone number..."
                        />
                      )}

                      {!data.isEdit && (
                        <CustomField
                          name="startDate"
                          lable="Start Date"
                          type="date"
                          disabled={data.isEdit}
                          min={minDate}
                          placeholder="Enter the start date..."
                        />
                      )}
                      <CustomField
                        name="endDate"
                        lable="End Date"
                        type="date"
                        min={minDate}
                        placeholder="Enter the end date..."
                      />
                      <CustomField
                        name="allowschedule"
                        lable="Total classes"
                        placeholder="Enter the total classes..."
                      />
                      <div className="mt-4 float-right">
                        <button
                          type="submit"
                          className="btn bounce inline-flex justify-center rounded-md border border-transparent
                       px-4 py-2 text-sm font-medium "
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          className="ml-4 btn bounce inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                      </div>
                    </Form>
                  </Formik>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
