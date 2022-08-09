import "../styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import Provider from "../store/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { useRef } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = useRef(new QueryClient());

  return (
    <Provider>
      <QueryClientProvider client={queryClient.current}>
        <Component {...pageProps} />
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
