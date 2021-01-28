import React from 'react';
import Tilt from 'react-tilt';
import ReactDOM from 'react-dom';
import Cookies from 'universal-cookie';

//Obrazy
import send6 from './send6.png';

const cookies = new Cookies();


const Home = () => {
  return (
    <div className="limiter">
    <div className="container-login100">
      <div className="wrap-login100">
        
        <form className="login100-form validate-form">
          <span className="login100-form-title">
            Zaloguj się
          </span>

          <div id="error_msg"></div>
          <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
            <input className="input100" type="text" name="email" placeholder="Email" id="email"/>
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
          
          <div className="container-login100-form-btn">
            <button className="login100-form-btn" onClick={loginSubmit}>
              Zaloguj
            </button>
          </div>

          <div className="text-center p-t-12">
            <span className="txt1">
              Zapomniałem <span style={{color: "rgba(0, 0, 0, 0)"}}>.</span>
            </span>
            <a  onClick={passwordResetSubmit} className="txt2" href="#">
               loginu / hasła?
            </a>
          </div>

          <div className="text-center p-t-136">
            <a className="txt2" href="#" onClick={registerSubmit}>
              Utwórz konto
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

async function fetchLogin() {
  var formData = new FormData()
  formData.append('emial', document.getElementById("email").value);
  formData.append('password', document.getElementById("password").value);

  var requestOptions = {
       method: 'POST',
       headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: formData
    };

  
  const response = await fetch('/login' ,requestOptions)
  .catch((error) => {
    window.alert('Error:', error);
  });
  return response
}


function loginSubmit(){
  window.alert("Logowanie")

  var payload = {email: document.getElementById("email").value,
    password: document.getElementById("password").value}

  var requestOptions = {
       method: 'POST',
       headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    };

  fetch('/login' ,requestOptions)
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    window.alert(json)
    }).catch(function(err) {
    window.alert(err.message);
  });
}

function registerSubmit(){
  let path = `/register`; 
  window.location.href= path
}

function noLoginSendSubmit(){
  let path = `/`; 
  window.location.href= path;
  window.alert("Bez logowania");

}

function passwordResetSubmit(){
  let path = `/`; 
  window.location.href= path
  window.alert("Reset hasła")
}
export default Home;