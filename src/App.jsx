import { Toaster } from "react-hot-toast";
import "./App.css";
import RoutesManager from "./RoutesManager";

function App() {
  return (
    <>
      <div className="main w-full overflow-clip">
        {/* <Hero />
        <Info />
        <InfoSecond />
        <Events /> */}
        <RoutesManager />
        <Toaster position="top-right" />
      </div>
    </>
  );
}

export default App;
