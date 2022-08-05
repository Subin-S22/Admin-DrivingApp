import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import { MyContext } from "../store/context";

export default function MyModal({ doDelete }: any) {
  const store = useContext(MyContext);
  const { data } = store;

  function closeModal() {
    store.actions.handleDialogOpen(false);
  }

  return (
    <>
      <Transition appear show={data.isDialogOpen} as={Fragment}>
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
                    className="text-lg font-medium leading-6 text-red-500"
                  >
                    Are you sure? You want to delete.
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      If you delete this, you can not undo the actions. Please
                      check once before you proceed.
                    </p>
                  </div>

                  <div className="mt-4 float-right">
                    <button
                      type="button"
                      className="btn bounce inline-flex justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium "
                      onClick={doDelete}
                    >
                      Okay
                    </button>
                    <button
                      type="button"
                      className="ml-4 btn bounce inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
