import InstrictorImage from "../../../assets/Images/Instructor.png"
import HighLightText from "./HighLightText"
import CTAButton from './Button'
import { FaArrowRight } from "react-icons/fa"


const InstructorSection = () => {
  return (
    <div>
        <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-[50%]">
                <img src={InstrictorImage} alt="InstructorImage" className="shadow-white shadow-[-20px_-20px_rgba(255,255,255)]" />
            </div>
            <div className="lg:w-[50%] flex flex-col gap-10">
                <div className="text-4xl font-semibold lg:w-[50%]">
                    Become an 
                    <HighLightText text={"instructor"}/>
                </div>

                <p className=" font-medium  text-[16px] w-[90%] text-richblack-300">
                Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </p>

                <div className=" w-fit">
                    
                <CTAButton active={true} to={"/signup"}>
                    <div className="flex flex-row gap-2 items-center">
                        Start Learning Today
                        <FaArrowRight/>
                    </div>
                </CTAButton>
                </div>

            </div>
        </div>
    </div>
  )
}

export default InstructorSection