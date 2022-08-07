import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Form, Formik } from "formik";
import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import baseAxios, { axiosWithAuth } from "../services";
import { MyContext } from "../store/context";
import CustomField from "./customField";

const trainerValidation = Yup.object().shape({
  email: Yup.string().email("Email is not valid").required("Required."),
  phonenumber: Yup.string()
    .min(10, "Phonenumber should be 10 digits")
    .required("Required."),
  trainername: Yup.string()
    .min(3, "Name should atleast have more 2 characters")
    .required("Required"),
  cardetails: Yup.object().shape({
    make: Yup.string(),
    model: Yup.string(),
    vin: Yup.string(),
  }),
});

interface UpdateTrainer {
  email: string;
  trainername: string;
  make: string;
  model: string;
  vin: string;
  status: "ONLINE" | "OFFLINE";
}

interface TrainerProp {
  email: string;
  phonenumber: string;
  trainername: string;
  cardetails: {
    make: string;
    model: string;
    vin: string;
  };
}

const initial = {
  email: "",
  trainername: "",
  phonenumber: "",
  cardetails: { make: "", model: "", vin: "" },
};

export default function FormDialog({ form }: any) {
  const [initialValues, setInitialValues] = useState<any>(initial);
  const store = useContext(MyContext);
  const { data } = store;
  const queryClient = useQueryClient();

  function closeModal() {
    store.actions.handleFormDialogOpen(false);
  }

  const addTrainer = async (values: TrainerProp) => {
    return await baseAxios.post("/admin/addTrainer", values, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
  };

  const useTrainer = () => {
    return useMutation(addTrainer, {
      onSuccess: () => {
        toast.success("Trainer Added", { position: "top-right" });
        store.actions.updateOnChange(true);
        store.actions.handleFormDialogOpen(false);
        queryClient.invalidateQueries(["all-trainers"]);
      },
      onError: (error: any) => {
        toast.error(error.response.data.message, { position: "top-right" });
      },
    });
  };

  useEffect(() => {
    if (data.isEdit) {
      //data from the backend for the edit
      setInitialValues(form);
    } else {
      setInitialValues(initial);
    }
  }, [data.isEdit]);

  const updateTrainer = async (obj: UpdateTrainer) => {
    return await axiosWithAuth.patch(
      `/admin/editTrainer/${initialValues._id}`,
      obj
    );
  };

  const { mutate } = useTrainer();
  const { mutate: patchTrainer } = useMutation(updateTrainer, {
    onSuccess: () => {
      queryClient.invalidateQueries(["all-trainers"]);
    },
  });

  const handleTrainerSubmit = async (values: TrainerProp) => {
    try {
      if (data.isEdit) {
        const obj: UpdateTrainer = {
          email: values.email,
          trainername: values.trainername,
          make: values.cardetails.make,
          model: values.cardetails.model,
          vin: values.cardetails.vin,
          status: "ONLINE",
        };
        patchTrainer(obj);
        toast.success("Trainer edited succesfully", {
          position: "top-right",
        });
        store.actions.updateOnChange(true);
        store.actions.handleFormDialogOpen(false);
      } else {
        mutate(values);
      }
    } catch (err: any) {
      toast.error(err.response.data.message, {
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
                    Add Trainer Details
                  </Dialog.Title>
                  {/* <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      If you delete this, you can not undo the actions. Please check once before you proceed.
                    </p>
                  </div> */}
                  <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={handleTrainerSubmit}
                    validationSchema={trainerValidation}
                  >
                    <Form>
                      <CustomField
                        lable="Email Address"
                        name="email"
                        placeholder="Enter the trainer email..."
                        type="email"
                      />
                      <CustomField
                        lable="Trainer Name"
                        name="trainername"
                        placeholder="Enter the trainer name..."
                        min={3}
                      />
                      {!data.isEdit && (
                        <CustomField
                          lable="Phone Number"
                          name="phonenumber"
                          placeholder="Enter the trainer phone number..."
                          disabled={data.isEdit}
                        />
                      )}
                      <CustomField
                        lable="Make"
                        name="cardetails.make"
                        placeholder="Enter the trainer car details..."
                      />
                      <CustomField
                        lable="Car Model"
                        name="cardetails.model"
                        placeholder="Enter the trainer car details..."
                      />
                      <CustomField
                        lable="Car vin"
                        name="cardetails.vin"
                        placeholder="Enter the trainer car details..."
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
