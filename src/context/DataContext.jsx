import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FullScreenLoader } from "../components/FullScreenLoader";
import Eng from "../locales/en.json";
import Fr from "../locales/fr.json";
import german from "../locales/german.json";
import dutch from "../locales/dutch.json";
import spanish from "../locales/spanish.json";
import italian from "../locales/italain.json";
import portuguese from "../locales/portuges.json";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [dynamicData, setDynamicData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  const [language, setLanguage] = useState("en");
  const [defaultTexts, setDefaultTexts] = useState(Eng);

  const addEventData = (newData) => {
    setDynamicData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  useEffect(() => {
    switch (language) {
      case "EN":
        setDefaultTexts(Eng);
        break;
      case "FR":
        setDefaultTexts(Fr);
        //console.log(language);
        break;
      case "DE":
        setDefaultTexts(german);
        break;
      case "NL":
        setDefaultTexts(dutch);
        break;
      case "ES":
        setDefaultTexts(spanish);
        break;
      case "IT":
        setDefaultTexts(italian);
        break;
      case "PS":
        setDefaultTexts(portuguese);
        break;
      default:
        setDefaultTexts(Eng); // Default to English if language is not found
    }

    console.log(language);
  }, [language]);

  // useEffect(() => {
  //   console.log(dynamicData)
  // },[dynamicData])

  return (
    <DataContext.Provider
      value={{
        defaultTexts,
        setDefaultTexts,
        dynamicData,
        setDynamicData,
        addEventData,
        language,
        setLanguage,
        setLoading,
        isOrganizer,
        setIsOrganizer,
      }}
    >
      {loading ? <FullScreenLoader /> : <></>}
      {children}
    </DataContext.Provider>
  );
}

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
