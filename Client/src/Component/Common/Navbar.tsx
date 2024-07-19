import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../Core/Auth/ProfileDropDown";
import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { RootState } from "../../store";

const Navbar = ({ result }: any) => {
  const { user } = useSelector((state: any) => state.auth);
  const totalItem = useSelector((state: any) => state.cart);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [loading, setLoading] = useState(false);
  const [subLinks, setSubLinks] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSubLinks(result);
      setLoading(false);
    }, 1000);
  }, [result]);

  const location = useLocation();

  const matchRoute = (route: string) => {
    return location.pathname === route;
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""} transition-all duration-200`}>
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={Logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Hamburger menu */}
        <button className="md:hidden mr-4" onClick={toggleMenu}>
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
        {/* Navigation links */}
        <nav className={`absolute top-14 right-0 w-full bg-richblack-800 md:static md:w-auto md:bg-transparent ${showMenu ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => {
              if (user && (user.role == "Instructor" || user.role == "Admin")) {
                // Show only "Home", "About Us", and "Contact Us" for non-Instructors and non-Admins
                if (link.title === "Home" || link.title === "About Us" || link.title === "Contact Us") {
                  return (
                    <li key={index}>
                      <Link to={link.path!}>
                        <p className={`${matchRoute(link.path || '') ? "text-yellow-25" : "text-richblack-25"}`}>{link.title}</p>
                      </Link>
                    </li>
                  );
                }
              } else {
                // Show all links for Instructors and Admins
                return (
                  <li key={index}>
                    {link.title === "Categories" ? (
                      <div className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute(link.path || '') ? "text-yellow-25" : "text-richblack-25"}`}>
                        <p>{link?.title}</p>
                        <BsChevronDown />
                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                          <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                          {loading ? (
                            <p className="text-center">Loading...</p>
                          ) : subLinks.length > 0 ? (
                            <>
                              {subLinks
                                ?.filter((subLink: any) => subLink?.name?.length > 0)
                                ?.map((category: any, i) => (
                                  <Link to={`/catalog/${category.name.split(" ").join("-").toLowerCase()}`} className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50" key={i}>
                                    <p>{category.name}</p>
                                  </Link>
                                ))}
                            </>
                          ) : (
                            <p className="text-center">No Courses Found</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Link to={link.path!}>
                        <p className={`${matchRoute(link.path || '') ? "text-yellow-25" : "text-richblack-25"}`}>{link.title}</p>
                      </Link>
                    )}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 sm:flex">
          {user && user?.role === "Student" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItem > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItem}
                </span>
              )}
            </Link>
          )}
          {!accessToken && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">Log in</button>
            </Link>
          )}
          {!accessToken && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">Sign up</button>
            </Link>
          )}
          {accessToken && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
