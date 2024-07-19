import { Link } from "react-router-dom";

type Props = {
    children:any;
    to:string;
    active :boolean;

}

const Button = ({children , active , to}: Props) => {
  return (
    <Link to={to}>  
    <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold sm:text-[16px] shadow-[2px_2px_0px_rgba(255,255,255,0.18)] 
            ${active ? "bg-yellow-50 text-black" : "bg-richblack-800"}
           hover:shadow-none hover:scale-95 transition-all duration-200`}>
        {children}
    </div>
    </Link>
  
  )
}

export default Button