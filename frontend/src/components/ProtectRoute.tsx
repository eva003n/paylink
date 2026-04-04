import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectRoute = () => {
    const {user} = useAuth();
  return user? <Outlet/> :<Navigate to="/sign-in" replace/>
}

export default ProtectRoute