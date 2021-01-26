import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'universal-cookie';
//import './index.css';
//import App from './App';
import send6 from './send6.png';
import reportWebVitals from './reportWebVitals';
import Tilt from 'react-tilt';
import { render } from '@testing-library/react';


const cookies = new Cookies();


class StartScreen extends React.Component {
  render() {
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
                <a className="txt2" href="#">
                   loginu / hasła?
                </a>
              </div>

              <div className="text-center p-t-136">
                <a className="txt2" href="#" onClick={() => {State = <RegisterScreen />; renderState();}}>
                  Utwórz konto
                  <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
                </a>
              </div>
            </form>
            

            <div>
            <a onClick={shoot} href ="#"><span className="login100-form-title">Lub przesyłaj bez logowania</span>
            <Tilt className="Tilt">
            <div className="login100-pic js-tilt"><img src={send6}  alt="IMG"/></div>         
            </Tilt></a>
          </div>
          </div>
        </div>
      </div>
    );
  }
}


class RegisterScreen extends React.Component {
  render() {
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
                <button className="login100-form-btn" onClick={registerSubmit}>
                  Zarejestruj
                </button>
              </div>


              <div className="text-center p-t-136">
                <a className="txt2" href="#" onClick={ () => {State=<StartScreen />; renderState(); }}>
                  Zaloguj się
                  <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
                </a>
              </div>
            </form>

            <div>
            <a onClick={shoot} href ="#"><span className="login100-form-title">Lub przesyłaj bez logowania</span>
            <Tilt className="Tilt">
            <div className="login100-pic js-tilt"><img src={send6}  alt="IMG"/></div>         
            </Tilt></a>
            </div>
          
          </div>
        </div>
      </div>
    )}
}

class LoggedScreen extends React.Component {
  render() {
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            
            <form className="login100-form validate-form">
              <span className="login100-form-title">
                Prześlij plik
              </span>

              <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
                <input className="input100" type="file" name="email" placeholder="Email" id="fileinput"/>
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>
              
              
              <div className="container-login100-form-btn">
                <button className="login100-form-btn" onClick={sendSubmit}>
                  Prześlij
                </button>
              </div>


              <div className="text-center p-t-136">
                <a className="txt2" href="#" onClick={ () => {State=<StartScreen />; renderState(); }}>
                  Zaloguj się
                  <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
                </a>
              </div>
            </form>

            <div>
            <a onClick={shoot} href ="#"><span className="login100-form-title">Pobierz plik</span>
            <Tilt className="Tilt">
            <div className="login100-pic js-tilt"><img src={send6}  alt="IMG"/></div>         
            </Tilt></a>
            </div>
          
          </div>
        </div>
      </div>
    )}
}


function renderState(){
  ReactDOM.render(
    State,
    document.getElementById('root')
  );
}

function registerSubmit(){
  alert("Register")
  var payload = {email: document.getElementById("email").value,
    username: document.getElementById("username").value,
    password: document.getElementById("password").value}
  var data = new FormData();
  data.append("json", JSON.stringify( payload ) );
  
  fetch("/register",
  {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
  })
  .then(function(res){ 
    if(res.status >= 400){
      ReactDOM.render(
        <span style={{color: "red"}}>Nieprawidłowy login lub hasło</span>,
        document.getElementById('error_msg')
      );
    }
    return res.json(); })
  .then(function(dat){ 
    var tokens = JSON.stringify( dat )
    cookies.set("access_token", tokens.access_token)
    cookies.set("refresh_token", tokens.refresh_token)
    console.log( JSON.stringify( dat ) ) })
}

function loginSubmit(){
  var payload = {email: document.getElementById("email").value,
    password: document.getElementById("password").value}
  var data = new FormData();
  data.append("json", JSON.stringify( payload ) );
  
  fetch("/login",
  {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
  })
  .then(function(res){ 
    if(res.status >= 400){
      ReactDOM.render(
        <span style={{color: "red"}}>Nieprawidłowy login lub hasło</span>,
        document.getElementById('error_msg')
      );
    }
    return res.json(); })
  .then(function(dat){ 
    var tokens = JSON.stringify( dat )
    cookies.set("access_token", tokens.access_token)
    cookies.set("refresh_token", tokens.refresh_token)
    State = <LoggedScreen />
    renderState()
  })
}

function sendSubmit(){  
  fetch("/upload_file",
  {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: document.getElementById("fileinput").files[0]
  })
  .then(function(res){ 
    if(res.status >= 400){
      ReactDOM.render(
        <span style={{color: "red"}}>Nieprawidłowy login lub hasło</span>,
        document.getElementById('error_msg')
      );
    }
    return res.json(); })
  .then(function(dat){ 
    var tokens = JSON.stringify( dat )
    cookies.set("access_token", tokens.access_token)
    cookies.set("refresh_token", tokens.refresh_token)
    State = <LoggedScreen />
    renderState()
  })
}

function shoot(){
  ReactDOM.render(
    <RegisterScreen />,
    document.getElementById('root')
  );
}

var State = <StartScreen />;


renderState();


reportWebVitals();
