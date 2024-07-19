import * as Icons from "react-icons/vsc";
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { resetCourseState } from "../../../Slice/CourseSlice";

interface LinkProps {
  path: string;
  name: string;
}

interface SidebarLinkProps {
  link: LinkProps;
  iconName: keyof typeof Icons;
  onClick: () => void;  // Add onClick prop
}

export const SidebarLink = ({ link, iconName, onClick }: SidebarLinkProps) => {
  const Icon = Icons[iconName];
  const location = useLocation();
  const dispatch = useDispatch();

  const matchRoute = (route: string) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <NavLink
      to={link.path}
      onClick={() => {
        dispatch(resetCourseState());
        onClick();  // Call onClick prop
      }}
      className={`relative px-8 py-2 text-sm font-medium ${
        matchRoute(link.path)
          ? "bg-yellow-800 text-yellow-50"
          : "bg-opacity-0 text-richblack-300"
      } transition-all duration-200`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        }`}
      ></span>
      <div className="flex items-center gap-x-2">
        <Icon className="text-lg" />
        <span>{link.name}</span>
      </div>
    </NavLink>
  );
};
