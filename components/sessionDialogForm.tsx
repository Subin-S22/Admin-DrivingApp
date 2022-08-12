import React, { ChangeEvent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik, FormikProps } from "formik";
import { Fragment, useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { axiosWithAuth } from "../services";
import { MyContext } from "../store/context";
import { nextDate, onError, scheduleTimes, threeDate } from "../utils/helpers";
import CustomField from "./customField";

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

const _formatDate = (date: string) => {
  console.log(date, "date in format dte");

  return new Date(date).toLocaleDateString("en-IN", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};
export default function SessionDialogForm() {
  const [initialValues] = useState<SessionProp>(initial);
  const queryClient = useQueryClient();
  const [scheduletimes, setSchedulestimes] = useState<string[]>(
    () => scheduleTimes
  );
  const [selectedTrainer, setSelectedTrainer] = useState({});

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

  const handleDateSelected = (date: string) => {
    const selecteddate = _formatDate(date);
    const dateavail = (selectedTrainer as any).dayScheduleTimeList.filter(
      (item: any) => item.scheduledate === selecteddate
    );

    const trainertime = dateavail.map((time: any) => time.scheduletime);
    console.log(trainertime);

    const remainingtime = scheduleTimes.filter((times) => {
      // console.log(times, trainertime.includes(times), trainertime);
      return !trainertime.includes(times);
    });
    // console.log("temp time", temptime, temptime.length);

    setSchedulestimes(remainingtime);
  };

  const handleTrinerSelected = (
    e: ChangeEvent<HTMLInputElement>,
    props: FormikProps<SessionProp>
  ) => {
    const selectedtrainer = trainers?.data.trainers.find(
      (trainer: any) => trainer._id === e.target.value
    );

    setSelectedTrainer(selectedtrainer);

    if (props.values.scheduledate) {
      handleDateSelected(props.values.scheduledate);
    }
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

  const { mutate } = useMutation(handleTrainerSubmit, {
    onSuccess: () => {
      queryClient.invalidateQueries(["all-sessions"]);
      queryClient.invalidateQueries(["all-trainers"]);
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

                  <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                      mutate(values);
                    }}
                    validationSchema={sessionValidation}
                  >
                    {(props: FormikProps<SessionProp>) => (
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
                          name="trainerId"
                          as="select"
                          lable="Trainer"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            props.setFieldValue("trainerId", e.target.value);
                            console.log(props.values);
                            handleTrinerSelected(e, props);
                          }}
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
                        <CustomField
                          name="scheduledate"
                          lable="Schedule Date"
                          type="date"
                          placeholder="Enter the Schedule date..."
                          min={nextDate()}
                          max={threeDate()}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            props.setFieldValue("scheduledate", e.target.value);
                            handleDateSelected(e.target.value);
                          }}
                        />
                        <CustomField
                          name="scheduletime"
                          lable="Schedule Time"
                          placeholder="Enter the Schedule time..."
                          as="select"
                        >
                          <option hidden>Select Time..</option>
                          {scheduletimes.map((time) => (
                            <option value={time} key={time} className="p-4">
                              {time}
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
