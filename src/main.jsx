import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { FormDataProvider } from "./context/FormDataContext";
import { DataProvider } from "./context/DataContext.jsx";
import "./i18n.js";

const key = `pk_test_ZnVuLXRvbWNhdC00Mi5jbGVyay5hY2NvdW50cy5kZXYk`;
console.log(key);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <DataProvider>
      <FormDataProvider>
        <App />
      </FormDataProvider>
    </DataProvider>
  </BrowserRouter>
);
