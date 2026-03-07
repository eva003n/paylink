import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectRoute = () => {
    const {isSignedIn} = useUser()
  return (
    {!isSignedIn? <Navigate></Navigate>}
  )
}

export default ProtectRoute