import React from 'react';
import Tilt from 'react-tilt';
import Cookies from 'universal-cookie';

//Obrazy
import send6 from './send6.png';

const Main = () => {
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
            <button type="button" className="login100-form-btn" onClick={uploadFileSubmit}>
              Prześlij
            </button>
          </div>


          <div className="text-center p-t-136">
            <a type="button" className="txt2" href="#" onClick={goHomeSubmit}>
              Wyloguj się
              <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
            </a>
          </div>
        </form>

        <div>
        <a type="button" onClick={getFileSubmit} href =""><span className="login100-form-title">Pobierz plik</span>
        <Tilt className="Tilt">
        <div className="login100-pic js-tilt"><img src={send6}  alt="IMG"/></div>         
        </Tilt></a>
        </div>
      
      </div>
    </div>
  </div>
  );

}

function getFileSubmit(){
    window.alert("Pobierz plik");
  }

function goHomeSubmit(){
    const cookies = new Cookies();
    cookies.set("access_token", "None");
    cookies.set("refresh_token", "None");
    let path = "/"; 
    window.location.href= path;
}

function uploadFileSubmit(){
    window.alert("Wyślij plik");
}

export default Main;
