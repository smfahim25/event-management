import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CancelPage() {

    const navigate = useNavigate();

    useEffect(() => {
        navigate('/app/profile')
    },[])

    useEffect(() => {
        sessionStorage.clear('formData')
    },[])

  return (
    <div>CancelPage</div>
  )
}

export default CancelPage