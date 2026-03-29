import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from './ui'

const ProtectRoute = () => {
    const {user, loading} = useAuth();
if(loading) return (
      <div className='min-h-screen flex justify-center items-center'>
    <Spinner size="xl"/>

      </div>

  )

  return user? <Outlet/> :<Navigate to="/login" replace/>
}

export default ProtectRoute