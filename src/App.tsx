import React from "react";

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import FormBuilder from "./components/builder-elements/FormBuilder";


export default function App() {
  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FormBuilder />
      </div>
    </>
  );
}
