import React from 'react';
import Tilt from 'react-tilt';
import ReactDOM from 'react-dom';
import Cookies from 'universal-cookie';

//Obrazy
import send6 from './send6.png';

const cookies = new Cookies();

document.title = "Przesyłaj i odbieraj bez logowania"

const NoLogin = () => {
  return (
    <div className="limiter">
    <div className="container-login100">
      <div className="wrap-login100">
        
        <div className="login100-form validate-form">
          <span className="login100-form-title">
            Przesyłaj i odbieraj pliki w czasie rzeczywistym
          </span>

          <div className="container-login100-form-btn">
            <a href="/p2p_send" className="login100-form-btn">
              Wyślij plik
            </a>
          </div>
          <div className="container-login100-form-btn">
            <a href="/p2p_receive" className="login100-form-btn">
              Odbierz plik
            </a>
          </div>

          <div className="text-center p-t-136">
          </div>
        </div>
        

        <div>
        <span className="login100-form-title">Odbierz plik używając kodu<br/><br/></span>
        <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
            <input className="input100" type="text" name="email" placeholder="Kod odbioru" id="email"/>
            <span className="focus-input100"></span>
            <span className="symbol-input100">
              <i className="fa fa-key" aria-hidden="true"></i>
            </span>
          </div>

        <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="button" onClick={loginSubmit}>
              Pobierz
            </button>
          </div>

          <div className="text-center p-t-136">
            <a className="txt2" href="/">
              Zaloguj się
              <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
            </a>
          </div>
      </div>
      </div>
    </div>
  </div>
  );
}



function loginSubmit(){  
  alert("Hi")
  let payload = {email: document.getElementById("email").value,
    password: document.getElementById("password").value}

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
        let path = `/main`; 
        window.location.href= path;
      }


    })
 


}

function registerSubmit(){
  let path = `/register`; 
  window.location.href= path
}

function noLoginSendSubmit(){
  window.alert("Wysyłanie bez logowania");

}

function passwordResetSubmit(){
  window.alert("Reset hasła: jakiś MIMEText niezdefiniowany na serwerze ;/")
}
export default NoLogin;