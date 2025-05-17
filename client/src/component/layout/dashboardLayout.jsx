import react from 'react'
import Sidebar from '../common/sidebar'
import Header from '../common/headerAgent'
import useUserStore from '../../zustand/store'
import { User } from 'lucide-react'

const DashboardLayout = ({ children }) => {
    const {user, isAuthenticated} = useUserStore();
    return (
        <div className='flex felx-col lg: flex-row h-screen  bg-slate-50 text-black'>
            <Sidebar role={user?.role}/>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <div className='flex-1 flex flex-col overflow-y-auto p-4 md:p-6'>
                    {children}
                </div>
            </div>
        </div>
    )
}
export default DashboardLayout;