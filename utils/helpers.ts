import type { AxiosError } from "axios";
import type { NextRouter } from "next/router";
import { toast } from "react-toastify";

export const sidebarRoute = (link: string, navigate: NextRouter) => {
  switch (link) {
    case "Home":
      navigate.replace("/");
      break;
    case "Trainers":
      navigate.push("/trainer");
      break;
    case "Customers":
      navigate.push("/customer");
      break;
    case "Sessions":
      navigate.push("/todaysessions");
      break;
    default:
      navigate.replace("/");
  }
};

export const minDate = new Date()
  .toLocaleDateString("en-IN", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
  .split("/")
  .reverse()
  .join("-")
  .toString();

export const nextDate = () => {
  const time = new Date().getTime();
  const timefor1 = 1000 * 60 * 60 * 24;
  const final = new Date(time + timefor1);
  return final
    .toLocaleDateString("en-IN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .split("/")
    .reverse()
    .join("-")
    .toString();
};

export const threeDate = () => {
  const time = new Date().getTime();
  const timefor3 = 1000 * 60 * 60 * 24 * 3;
  const final = new Date(time + timefor3);
  return final
    .toLocaleDateString("en-IN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .split("/")
    .reverse()
    .join("-")
    .toString();
};

export const scheduleTimes = [
  "07:00 AM-8:00 AM",
  "08:00 AM-09:00 AM",
  "09:00 AM-10:00 AM",
  "10:00 AM-11:00 AM",
  "11:00 AM-12:00 PM",
  "12:00 PM-01:00 PM",
  "02:00 PM-03:00 PM",
  "03:00 PM-04:00 PM",
  "04:00 PM-05:00 PM",
  "05:00 PM-06:00 PM",
];

export const onError = (err: AxiosError<any, any>) => {
  toast.error(err.response?.data.message);
};
