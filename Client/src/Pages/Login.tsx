import Template from '../Component/Core/Auth/Template'
import LoginImg from '../assets/Images/login.webp'


function Login() {
  return (
    <div>
        <Template
        title="Welcome Back"
        description1="Build skills for today, tomorrow, and beyond."
        description2='Education to future-proof your career.'
        image={LoginImg}
        formType='login'
        />
    </div>
  )
}

export default Login