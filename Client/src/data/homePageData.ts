import Logo1 from '../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../assets/TimeLineLogo/Logo4.svg'


interface TimelineDataInterface {
    Logo : string;
    heading: string;
    description : string
}

export const TimelineData : TimelineDataInterface[] = [
    {
        Logo : Logo1,
        heading:"Leadership",
        description:"Fully Committed to this Success company"
    },
    {
        Logo : Logo2,
        heading:"Responsibility",
        description:"Students will always be our top priority"
    },
    {
        Logo : Logo3,
        heading:"Flexibility",
        description:"The ability to switch is an important skills"
    },
    {
        Logo : Logo4,
        heading:"Solve the problem",
        description:"Code your way to a solution"
    },


]

export const ACCOUNT_TYPE = {
    STUDENT: "Student",
    INSTRUCTOR: "Instructor",
    ADMIN: "Admin",
  }
  
  export const COURSE_STATUS : CourseStatus = {
    DRAFT: "Draft",
    PUBLISHED: "Published",
  }



interface tabDataInterface {
    id:number;
    tabName : string;
    type: string;
}

export const tabData : tabDataInterface[] = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ]

interface CourseStatus {
  DRAFT : string;
  PUBLISHED : string;
}

 export const RAZORPAY_KEY = "rzp_test_3uOuWNiHlg06wE"