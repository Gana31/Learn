import CTAButton from './Button'
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';

interface Props {
    position: any;
    heading: any;
    subheading: string;
    ctabtn1: {
        active: boolean,
        text: string,
        link: string,
    };
    ctabtn2: {
        active: boolean,
        text: string,
        link: string,
    };
    codeblock: string;
    bgColor: any;
    CodeColor : string;
}

const CodeBlocks = ({ position, heading, subheading, ctabtn2, ctabtn1, codeblock, bgColor , CodeColor }: Props) => {
    const countNewLines = (str : string) => {
        const regex = /\n/g;
        const newLineCount = (str.match(regex) || []).length;
        return newLineCount;
    }

    // Call the function to count new lines in codeblock
    const newLineCount = countNewLines(codeblock);

    const lineNumbers = Array.from({ length: newLineCount + 2 }, (_, index) => index + 1);

    return (
        <div className={`flex ${position} my-20 justify-between gap-10 flex-col lg:gap-10`}>
            
            <div className='w-[100%] lg:w-[50%] flex flex-col gap-8'>
                {heading}
                <div className=' text-richblack-300 font-bold text-base w-[85%] -mt-3'>
                    {subheading}
                </div>
                <div className='flex gap-7 mt-7'>
                    <CTAButton active={ctabtn1.active} to={ctabtn1.link}>
                        <div className='flex gap-2 items-center'>
                            {ctabtn1.text}
                            <FaArrowRight />
                        </div>
                    </CTAButton>

                    <CTAButton active={ctabtn2.active} to={ctabtn2.link}>{ctabtn2.text}</CTAButton>
                </div>
            </div>


            <div className='h-fit code-border flex flex-row text-[10px] w-[100%] py-3 sm:text-sm leading-[18px] sm:leading-6 relative lg:w-[470px]'>
                {bgColor}
                <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                {lineNumbers.map((lineNumber) => (
                        <p key={lineNumber}>{lineNumber}</p>
                    ))}
                </div>
                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${CodeColor} pr-1`}>
                <TypeAnimation
                sequence={[codeblock,5000,""]}
                repeat={Infinity}
                style={{
                    whiteSpace : "pre-line",
                    display:"block",
                }}
                omitDeletionAnimation={true}
                />
                </div>
            </div>

        </div>
    )
}

export default CodeBlocks