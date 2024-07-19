import { Outlet } from "react-router-dom"
import Sidebar from "./SideBar/Sidebar"
// import { useSelector } from "react-redux"

export const Dashboard = () => {
 

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
