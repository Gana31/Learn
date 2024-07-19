import React from "react"
import * as Icon1 from "react-icons/bi"
import * as Icon2 from "react-icons/io5"
import * as Icon3 from "react-icons/hi2"

// Define union types for each icon module
type IconKeys1 = keyof typeof Icon1;
type IconKeys2 = keyof typeof Icon2;
type IconKeys3 = keyof typeof Icon3;

interface ICon {
  icon: IconKeys1 | IconKeys2 | IconKeys3;
  heading: string;
  description: string;
  details: string;
}

const contactDetails: ICon[] = [
  {
    icon: "HiChatBubbleLeftRight",
    heading: "Chat on us",
    description: "Our friendly team is here to help.",
    details: "info@studynotion.com",
  },
  {
    icon: "BiWorld",
    heading: "Visit us",
    description: "Come and say hello at our office HQ.",
    details:
      "Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016",
  },
  {
    icon: "IoCall",
    heading: "Call us",
    description: "Mon - Fri From 8am to 5pm",
    details: "+123 456 7869",
  },
]

const ContactDetails = () => {
  return (
    <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6">
      {contactDetails.map((ele, i) => {
        // Determine the correct icon module
        let Icon: React.ElementType | undefined;
        if (Icon1[ele.icon as IconKeys1]) {
          Icon = Icon1[ele.icon as IconKeys1];
        } else if (Icon2[ele.icon as IconKeys2]) {
          Icon = Icon2[ele.icon as IconKeys2];
        } else if (Icon3[ele.icon as IconKeys3]) {
          Icon = Icon3[ele.icon as IconKeys3];
        }

        return (
          <div
            className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200"
            key={i}
          >
            <div className="flex flex-row items-center gap-3">
              {Icon && <Icon size={25} />}
              <h1 className="text-lg font-semibold text-richblack-5">
                {ele.heading}
              </h1>
            </div>
            <p className="font-medium">{ele.description}</p>
            <p className="font-semibold">{ele.details}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ContactDetails
