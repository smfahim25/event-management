import { Toaster } from "react-hot-toast";
import "./App.css";
import RoutesManager from "./RoutesManager";
import { useAuthStore } from "./store/AuthStore";
import { useEffect } from "react";

function App() {
  const { user, checkUserRole } = useAuthStore();

  useEffect(() => {
    const callVerificationAPI = async () => {
      try {
        await checkUserRole();
      } catch (error) {
        console.error("❌ Verification API failed:", error);
      }
    };

    const shouldCallApi = () => {
      const today = new Date().toISOString().split("T")[0];
      const storedData = JSON.parse(
        localStorage.getItem("verificationApiCalls") || "{}"
      );

      if (!storedData[today]) {
        storedData[today] = 0;
      }

      if (storedData[today] < 3) {
        callVerificationAPI();
        storedData[today] += 1;
        localStorage.setItem(
          "verificationApiCalls",
          JSON.stringify(storedData)
        );
      } else {
        console.log("⏱️ Verification API already called twice today");
      }
    };

    if (user?.verificationStatus === "pending") {
      shouldCallApi();
    }
  }, [user?.verificationStatus, user?.id, checkUserRole]);
  return (
    <>
      <div className="main w-full overflow-clip">
        <RoutesManager />
        <Toaster position="top-right" />
      </div>
    </>
  );
}

export default App;
