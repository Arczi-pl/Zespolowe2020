import React from 'react';
import Tilt from 'react-tilt';
//Obrazy
import send6 from './send6.png';

const Register = () => {
  return (
    <div className="limiter">
    <div className="container-login100">
      <div className="wrap-login100">
            
            <form className="login100-form validate-form">
              <span className="login100-form-title">
                Zarejestruj się
              </span>

              <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
                <input className="input100" type="text" name="email" placeholder="Email" id="email"/>
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
                <input className="input100" type="text" name="username" placeholder="Użytkownik" id="username"/>
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>

              <div className="wrap-input100 validate-input" data-validate = "Password is required">
                <input className="input100" type="password" name="pass" placeholder="Hasło" id="password"/>
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-validate = "Password is required">
                <input className="input100" type="password" name="pass" placeholder="Potwtórz hasło"/>
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>
              
              <div className="container-login100-form-btn">
                <button className="login100-form-btn" type="button" onClick={registerSubmit}>
                  Zarejestruj
                </button>
              </div>


              <div className="text-center p-t-136">
                <a className="txt2" href="#" onClick={goHomeSubmit}>
                  Zaloguj się
                  <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
                </a>
              </div>
            </form>

            <div>
            <a onClick={noLoginSendSubmit} href ="#"><span className="login100-form-title">Lub przesyłaj bez logowania</span>
            <Tilt className="Tilt">
            <div className="login100-pic js-tilt"><img src={send6}  alt="IMG"/></div>         
            </Tilt></a>
            </div>
          
          </div>
        </div>
        </div>

  );
}

function noLoginSendSubmit(){
  window.alert("Bez logowania")

}

function goHomeSubmit(){
  window.alert("Do Home")

}

function registerSubmit(){
  window.alert("Zarejestruj")

  let data = {"email":document.getElementById("email").value,"username":document.getElementById("username").value,"password":document.getElementById("password").value};

  fetch('http://localhost:8080/register', {
       method: 'POST',
       body: JSON.stringify(data),
    });
}

export default Register;
