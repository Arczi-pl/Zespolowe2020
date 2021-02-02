import React from 'react';
import Cookies from 'universal-cookie';
import Tilt from 'react-tilt';
import ReactDOM from 'react-dom';
import { BiLogIn } from 'react-icons/bi';
//Obrazy
import send6 from './send6.png';
import { MdCreateNewFolder } from 'react-icons/md';

const ResetPassword = () => {
  return (
    <div className="limiter">
    <div className="container-login100">
      <div className="wrap-login100">
            
            <form className="login100-form validate-form">
              <span className="login100-form-title">
                Reset hasła
              </span>
              <div id="error_msg"></div>
              <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
                <input className="input100" type="text" name="email" placeholder="Email" id="email"/>
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>

              <div className="container-login100-form-btn">
                <button className="login100-form-btn" type="button" onClick={registerSubmit}>
                  Wyślij
                </button>
              </div>
    

              <div className="text-center p-t-136">
                <a className="txt2" href="#" onClick={goHomeSubmit}>
                  Zaloguj się
                  <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
                </a>
              </div>
            </form>
          
          </div>
        </div>
        </div>

  );
}



function goHomeSubmit(){
  let path = "/"; 
  window.location.href= path;
}

function registerSubmit() {

  let payload = {"email":document.getElementById("email").value};

  let url = "/reset_password";

  let fetchOptions = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
    }    
   fetch(url, fetchOptions);
}
export default ResetPassword;
