import React from 'react';
import Cookies from 'universal-cookie';
import Tilt from 'react-tilt';
import ReactDOM from 'react-dom';
import { BiLogIn } from 'react-icons/bi';
//Obrazy
import send6 from './send6.png';
import { MdCreateNewFolder } from 'react-icons/md';

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
                  <i className="fa fa-user" aria-hidden="true"></i>
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
              <div id="error_msg"></div>

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

  let payload = {"email":document.getElementById("email").value,
  "username":document.getElementById("username").value,
  "password":document.getElementById("password").value};

  let url = "/register";

  let fetchOptions = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
    }

    fetch(url, fetchOptions)
    .then(function(res){ 
      return res.json(); })
    .then(function(data){ 
      var json = JSON.stringify(data)
      var obj = JSON.parse(json)

      if(obj.hasOwnProperty('detail')){
        if(obj.detail== "Username already registered"){
          ReactDOM.render(
            <span style={{color: "red"}}>Użytkownik już zarejestrowany!</span>,
            document.getElementById('error_msg'));
        } else {
          ReactDOM.render(
            <span style={{color: "red"}}>Niepoprawny email!</span>,
            document.getElementById('error_msg'))
        }
      }
      else if(obj.hasOwnProperty("email")){
        let payload = {email: document.getElementById("email").value,
        password: document.getElementById("password").value}
        login(payload)
      }

    });
    

}

function login(payload){
  let url = "/login";

  let fetchOptions = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
    }

    fetch(url, fetchOptions)
    .then(function(res){ 
      return res.json(); })
    .then(function(data){ 
      var json = JSON.stringify(data)
      var obj = JSON.parse(json)
      if(obj.hasOwnProperty('detail')){
        ReactDOM.render(
          <span style={{color: "red"}}>Nieprawidłowy login lub hasło</span>,
          document.getElementById('error_msg')
        );
      }
      else if(obj.hasOwnProperty("access_token")){
        const cookies = new Cookies();
        cookies.set("access_token", obj.access_token);
        cookies.set("refresh_token", obj.refresh_token);
        createNewFolderForUser();
        let path = `/main`; 
        window.location.href= path;
      }


    })
}

function createNewFolderForUser(){
  let url = "/create_folder";

  let payload = {folder_name: "main"}

  let fetchOptions = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + getCookie("access_token")
    },
    body: JSON.stringify(payload)
    }

    fetch(url, fetchOptions)
    .catch(function(err){
      alert(err)
    });
}




function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export default Register;
