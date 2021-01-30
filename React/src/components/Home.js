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
            <button className="login100-form-btn" type="button" onClick={loginSubmit}>
              Zaloguj
            </button>
          </div>

          <div className="text-center p-t-12">
            
            <a  type="button" onClick={passwordResetSubmit} className="txt2" href="">
            <span className="txt1">
              Nie pamiętasz hasła? <span style={{color: "rgba(0, 0, 0, 0)"}}>.</span>
            </span>
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
        <a href ="/nologin"><span className="login100-form-title">Lub przesyłaj bez logowania</span>
        <Tilt className="Tilt">
        <div className="login100-pic js-tilt"><img src={send6}  alt="IMG"/></div>         
        </Tilt></a>
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

function passwordResetSubmit(){
  window.alert("Reset hasła: jakiś MIMEText niezdefiniowany na serwerze ;/")
}
export default Home;