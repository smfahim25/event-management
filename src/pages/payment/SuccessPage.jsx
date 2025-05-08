import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormData } from '../../context/FormDataContext';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { Data } = useFormData();

    const ProcessEventData = async(sessionId) => {
        //verify session id
        const verifyResponse = await axios.get(`${import.meta.env.VITE_API_URL}/payment/verify-session?sessionID=${sessionId}`);
        console.log(verifyResponse)
        //console.log(verifyResponse.data.success === true && verifyResponse.data.session.payment_status ==='paid')
        if(verifyResponse.data.success === true && verifyResponse.data.session.payment_status ==='paid'){
            const storedFormData = JSON.parse(sessionStorage.getItem("formData"));
            console.log(storedFormData)
            const EventResponse = await axios.post(`${import.meta.env.VITE_API_URL}/event`, storedFormData)

           if(EventResponse.data.success === true){
            sessionStorage.removeItem("formData");
            navigate('/app/profile');
           }
           else{
               alert(EventResponse.data.message)
               console.log(EventResponse.data)
               //cancel the payment
              //navigate('/app/profile');

           }
        }
        else
        alert(verifyResponse.data.message)
    }

  useEffect(() => {
    // Extract session_id from URL parameters
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    console.log(sessionId)
    if (sessionId) {
      // Here you can call your function to verify the session or submit event data
      
      ProcessEventData(sessionId)
      // Call your function, e.g., submitEvent(sessionId);
    }
  }, [location]);



  return (
    <div>
      <h1>Payment Successful</h1>
      {/* You can display additional information or redirect the user */}
    </div>
  );
};

export default SuccessPage;
