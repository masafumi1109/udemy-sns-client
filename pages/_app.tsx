import "@/src/styles/globals.css";
import type {AppProps} from "next/app";
import Navbar from "@/src/components/Navbar";
import {AuthProvider} from "@/src/context/auth";

export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <AuthProvider>
        <Navbar/>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
