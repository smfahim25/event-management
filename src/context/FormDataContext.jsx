import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context to store form data
const FormDataContext = createContext();

// Create a provider component
export const FormDataProvider = ({ children }) => {
  const [Data, setData] = useState(null);

  useEffect(() => {
    console.log(Data)
  },[Data])

  return (
    <FormDataContext.Provider value={{ Data, setData }}>
      {children}
    </FormDataContext.Provider>
  );
};

// Custom hook to use form data context
export const useFormData = () => useContext(FormDataContext);
