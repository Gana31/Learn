import { useDispatch, useSelector } from "react-redux";
import { sidebarLinks } from "../../../data/dashboard-links";
import { SidebarLink } from "./SidebarLink";
import { useLogoutMutation } from "../../../Services/Operation/authApi";
import { useState } from "react";
import { VscSignOut, VscMenu, VscSettingsGear } from "react-icons/vsc";
import ConfirmationModal from "../../Common/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { LogOutState } from "../../../Slice/AuthSlice";
import { clearUser } from "../../../Slice/ProfileSlice";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { user } = useSelector((state: any) => state.auth || {});
  const dispatch = useDispatch();
  const [Logout] = useLogoutMutation({});
  const [confirmationModal, setConfirmationModal] = useState<any>(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logouthandle = async () => {
    try {
      const result = await Logout({}).unwrap();
      if (result.success === true) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        dispatch(LogOutState());
        dispatch(clearUser());
        navigate('/');
        toast.success(result?.data?.message || "Logout Successful");
      }
    } catch (error: any) {
      console.log(error);
      // toast.error(error || "Error While User Logout")
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuItemClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className="relative">
        {/* Hamburger Menu Icon */}
        <button
          className="absolute top-4 left-4 md:hidden z-50"
          onClick={handleToggleSidebar}
        >
          <VscMenu className="text-2xl text-richblack-100" />
        </button>
        
        {/* Overlay to close sidebar */}
        <div
          className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={handleToggleSidebar}
        />
        
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-56 transform bg-richblack-800 p-6 transition-transform duration-300 md:relative md:translate-x-0 md:w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex h-[calc(100vh-3.5rem)] flex-col border-r-[1px] border-r-richblack-700">
            <div className="flex flex-col mt-4">
              {sidebarLinks.map((link: any) => {
                if (link.type && user?.role !== link.type) return null;
                return (
                  <SidebarLink key={link.id} link={link} iconName={link.icon} onClick={handleMenuItemClick} />
                );
              })}
            </div>
            <div className="mx-auto my-6 h-[1px] w-10/12 bg-richblack-700" />
            <div className="flex flex-col">
              <SidebarLink
                link={{ name: "Settings", path: "/dashboard/settings" }}
                iconName="VscSettingsGear"
                onClick={handleMenuItemClick}
              />
              <button
                onClick={() =>
                  setConfirmationModal({
                    text1: "Are you sure?",
                    text2: "You will be logged out of your account.",
                    btn1Text: "Logout",
                    btn2Text: "Cancel",
                    btn1Handler: logouthandle,
                    btn2Handler: () => setConfirmationModal(null),
                  })
                }
                className="px-8 py-2 text-sm font-medium text-richblack-300 mt-4"
              >
                <div className="flex items-center gap-x-2">
                  <VscSignOut className="text-lg" />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default Sidebar;
