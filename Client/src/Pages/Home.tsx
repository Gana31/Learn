import { Link } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa";
import HighLightText from "../Component/Core/HomePage/HighLightText";
import CTAButton from "../Component/Core/HomePage/Button"
import Banner from '../assets/Images/banner.mp4';
import CodeBlocks from "../Component/Core/HomePage/CodeBlocks";


import InstructorSection from "../Component/Core/HomePage/InstructorSection";
import ExploreMore from "../Component/Core/HomePage/ExploreMore";
import TimeLIneSection from "../Component/Core/HomePage/TimeLIneSection";
import LearningLanguage from "../Component/Core/HomePage/LearningLanguage";
import ReviewSlider from "../Component/Common/ReviewSlider";

const Home = () => {
  return (
    <div>
      <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent gap-8">
        <Link to={"/signup"}>
          <div className=" group mt-16 p-1 mx-aut0 rounded-full bg-richblue-800 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 w-fit hover:drop-shadow-none ">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]  group-hover:bg-richblack-900 ">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        <div className="text-center text-4xl font-semibold">
          Empower Your Future With
          <HighLightText text={"Coding Skills"} />
        </div>

        <div className="-mt-3 w-[90%] text-center text-lg  font-bold text-richblue-300">
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
        </div>

        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} to={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} to={"/login"}>
            Book A Demo
          </CTAButton>
        </div>

        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video muted loop autoPlay
            className="shadow-[20px_20px_rgba(255,255,255)]">
            <source src={Banner} type="video/mp4" />
          </video>
        </div>



        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                unlock Your
                <HighLightText text={"coding Potential"} />
                with our online courses
              </div>
            }
            subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
            ctabtn1={{
              text: "Try it Yourself",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              text: "Learn More",
              link: "/login",
              active: false,
            }}

            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><ahref="/">Header</a></h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a>\n<ahref="three/">Three</a>\n</nav>`}
            CodeColor={"text-yellow-25"}
            bgColor={<div className="codeblock1 absolute"></div>}
          />
        </div>


        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighLightText text={"coding in seconds"} />
              </div>
            }
            subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
            ctabtn1={{
              text: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              text: "Learn More",
              link: "/login",
              active: false,
            }}

            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><ahref="/">Header</a></h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a>\n<ahref="three/">Three</a>\n</nav>`}
            CodeColor={"text-reddis-5"}

            bgColor={<div className="codeblock2 absolute "></div>}
          />
        </div>
        <ExploreMore/>
      </div>



      <div className=" bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[320px]">
          <div className="w-11/12 max-w-maxContent flex flex-col justify-between item-center gap-8 mx-auto">
            <div className="lg:h-[150px]"></div>
            <div className=" flex flex-row gap-7 justify-center text-white lg:mt-8">
              <CTAButton active={true} to={"/signup"}>
                <div className="flex gap-2 item-center">
                  Explore Full Catelog
                  <FaArrowRight />
                </div>
              </CTAButton>

              <CTAButton active={false} to={"/signup"}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8">
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%]">
              Get the Skills you need for a{" "}
              <HighLightText text={"Job that is in Demand"} />
            </div>
            <div className=" flex flex-col gap-10 lg:w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
              </div>
              <CTAButton active={true} to={"/signup"}>Learn More</CTAButton>
            </div>
          </div>

            <TimeLIneSection/>
            <LearningLanguage/>
        </div>
      </div>


      {/* Section3  */}
      <div className="relative w-11/12 mx-auto my-20 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <InstructorSection/>
          <h2 className="text-center text-4xl font-semibold mt-10">Reivew From Other Learners</h2>
                <ReviewSlider/>
      </div>
    </div>
  )
}

export default Home