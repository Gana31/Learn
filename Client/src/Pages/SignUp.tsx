import { useEffect } from "react"
import Template from "../Component/Core/Auth/Template"
import signupImg from '../assets/Images/signup.webp'
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const SignUp = () => {
  const {accessToken} = useSelector((state : any) => state.auth)
  const navigate = useNavigate();
  useEffect(()=>{
    if(accessToken) {
      navigate("/")
    }
  })

  return (
    <div>
        <Template
        title="Join the millions learning to code with StudyNotion for free"
        description1="Build skills for today, tomorrow, and beyond."
        description2='Education to future-proof your career.'
        image={signupImg}
        formType='signup'
        />
    </div>
  )
}

export default SignUp