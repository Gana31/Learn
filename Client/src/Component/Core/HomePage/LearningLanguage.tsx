import Know_your_Progress from '../../../assets/Images/Know_your_progress.png'
import Compare_with_others from '../../../assets/Images/Compare_with_others.png'
import Plan_your_lessons from '../../../assets/Images/Plan_your_lessons.png'
import HighLightText from './HighLightText'
import CTAButton from "./Button"

const LearningLanguage = () => {
    return (
        <div>
            <div className=" text-4xl font-semibold text-center my-10">
                Your swiss knife for
                <HighLightText text={"learning any language"} />
            </div>
            <div className="text-center text-richblack-600 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
                Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>
            <div className="flex flex-col lg:flex-row item-center justify-center mt-8 lg:mt-0">
                <img
                    src={Know_your_Progress}
                    alt="Know_your_Progress"
                    className="object-contain lg:-mr-32"
                />
                <img
                    src={Compare_with_others}
                    alt="Compare_with_others"
                    className="object-contain lg:-mb-10 lg:-mt-0 -mt-12"
                />
                <img
                    src={Plan_your_lessons}
                    alt="Plan_your_lessons"
                    className="object-contain lg:-ml-36 lg:-mt-5 -mt-16"
                />
            </div>
            <div className="w-fit mx-auto lg:mb-20 mb-8 mt-5">
                <CTAButton active={true} to={"/signup"}>Learn More</CTAButton>
            </div>


        </div>
    )
}

export default LearningLanguage