import { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContex";
import axios from 'axios';
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
const LoginPopup = ({ setShowLogin }) => {

  const {url, setToken} = useContext(StoreContext);

  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name:"",
    email:"",
    password:""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const onLogin = async(event) =>{
    event.preventDefault();
    let newUrl = url;
    if(currentState === 'Login'){
      newUrl += "/api/user/login";
    }
    else{
      newUrl += "/api/user/register"
    }

    const response = await axios.post(newUrl,data);
    if(response.data.success){
      setToken(response.data.token)
      localStorage.setItem("token", response.data.token);
      setShowLogin(false);
      toast.success("Login successful.");
    }
    else{
      toast.error(response.data.message);
    }
  }
 
  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Login" ? (
            <></>
          ) : (
            <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="your name" required />
          )}
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="your mail" required />
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="password" required />
        </div>
        <button type="submit">
          {currentState === "sign up" ? "create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>BY continuing, i agree to the terms of use & privacy policy.</p>
        </div>

        {currentState === "Login" ? (
          <p>
            Create a new account? <span onClick={()=> setCurrentState("sign up")}>Click Here</span>
          </p>
        ) : (
          <p>Already have an account. <span onClick={()=> setCurrentState("Login")}>Click Here</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
