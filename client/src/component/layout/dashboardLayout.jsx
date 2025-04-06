import react from 'react'
import Sidebar from '../common/sidebar'
import Header from '../common/headerAgent'

const DashboardLayout = ({ children }) => {
    return (
        <div className='flex felx-col lg: flex-row h-screen  bg-white text-black'>
            <Sidebar />
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