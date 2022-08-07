import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { Fragment, useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { axiosWithAuth } from "../services";
import { MyContext } from "../store/context";
import { nextDate, onError, scheduleTimes, threeDate } from "../utils/helpers";
import CustomField from "./customField";
import Loader from "./Loader";

interface SessionProp {
  userId?: string;
  schedulename: string;
  scheduledate: string;
  scheduletime: string;
  trainerId?: string;
  trainerdetails: {
    email: string;
    phonenumber: string;
    trainername: string;
    cardetails: {
      make: string;
      model: string;
      vin: string;
    };
  };
}

const sessionValidation = Yup.object().shape({
  userId: Yup.string().required("Required"),
  scheduledate: Yup.date().required("Required"),
  scheduletime: Yup.string().required("Required"),
  trainerId: Yup.string().required("Required"),
});

const initial: SessionProp = {
  schedulename: "",
  scheduledate: "",
  scheduletime: "",
  trainerdetails: {
    email: "",
    phonenumber: "",
    trainername: "",
    cardetails: {
      make: "",
      model: "",
      vin: "",
    },
  },
};
export default function SessionDialogForm() {
  const [initialValues] = useState<SessionProp>(initial);
  const queryClient = useQueryClient();

  const store = useContext(MyContext);
  const { data } = store;

  function closeModal() {
    store.actions.handleFormDialogOpen(false);
  }

  const trainerObj = (values: SessionProp) => {
    const selected = trainers?.data.trainers.find(
      (trainer: any) => trainer._id === values.trainerId
    );
    //
    const trainerdetails = {
      email: selected.email,
      phonenumber: selected.phonenumber,
      trainername: selected.trainername,
      cardetails: {
        make: selected.cardetails.make,
        model: selected.cardetails.model,
        vin: selected.cardetails.vin,
      },
    };

    return trainerdetails;
  };

  const handleTrainerSubmit = async (values: SessionProp) => {
    const trainerDetails = trainerObj(values);

    const formatDate = new Date(values.scheduledate).toLocaleDateString(
      "en-IN",
      {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }
    );
    try {
      const body = {
        schedulename: "driving",
        scheduledate: formatDate,
        scheduletime: values.scheduletime,
        trainerdetails: trainerDetails,
      };

      const res = await axiosWithAuth.post(
        `/admin/create/user/schedule/${values.userId}`,
        body
      );

      toast.success("Session added successfully...");

      store.actions.updateOnChange(true);
      store.actions.handleFormDialogOpen(false);

      return res;
    } catch (err: any) {
      toast.error(err.response.data.message);
      return err;
    }
  };

  /********************************************************************** */
  //// react query

  const { mutate, isLoading } = useMutation(handleTrainerSubmit, {
    onSuccess: () => {
      queryClient.invalidateQueries(["all-sessions"]);
    },
  });

  const fetchCustomer = async () => {
    return await axiosWithAuth.get("/admin/getAllUsers");
  };

  const fetchTrainers = async () => {
    return await axiosWithAuth.get("/admin/getAllTrainers");
  };

  const { data: customers } = useQuery(["all-customers"], fetchCustomer, {
    onError: onError,
  });
  const { data: trainers } = useQuery(["all-trainers"], fetchTrainers, {
    onError: onError,
  });

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
                    Add Session Details
                  </Dialog.Title>
                  {/* <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      If you delete this, you can not undo the actions. Please check once before you proceed.
                    </p>
                  </div> */}
                  <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                      mutate(values);
                    }}
                    validationSchema={sessionValidation}
                  >
                    {() => (
                      <Form>
                        <CustomField name="userId" as="select" lable="User">
                          <option hidden>Select user...</option>
                          {customers?.data.users.map((customer: any) => {
                            return (
                              <option value={customer._id} key={customer._id}>
                                {customer.name}
                              </option>
                            );
                          })}
                        </CustomField>
                        <CustomField
                          name="scheduledate"
                          lable="Schedule Date"
                          type="date"
                          placeholder="Enter the Schedule date..."
                          min={nextDate()}
                          max={threeDate()}
                        />

                        <CustomField
                          name="scheduletime"
                          lable="Schedule Time"
                          placeholder="Enter the Schedule time..."
                          as="select"
                        >
                          <option hidden>Select Time..</option>
                          {scheduleTimes.map((time) => (
                            <option value={time} key={time} className="p-4">
                              {time}
                            </option>
                          ))}
                        </CustomField>
                        <CustomField
                          name="trainerId"
                          as="select"
                          lable="Trainer"
                          // onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          //   console.log(props.values);
                          //   getTrainer(e, props);
                          // }}
                        >
                          <option hidden>Select trainer...</option>
                          {trainers?.data.trainers.map((trainer: any) => (
                            <option
                              value={trainer._id}
                              key={trainer._id}
                              className="p-4"
                            >
                              {trainer.trainername}
                            </option>
                          ))}
                        </CustomField>
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
                    )}
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
