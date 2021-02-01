import React from 'react';
import Tilt from 'react-tilt';
//Obrazy
import send6 from './send6.png';

const Home = () => {
  return (
    <div className="limiter">
    <div className="container-login100">
      <div className="wrap-login100">
        
        <form className="login100-form validate-form">
          <span className="login100-form-title">
            Wysyłanie pliku
          </span>

          <div id="error_msg"></div>
          <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
            <input type="file" class="form-control-file" id="fileinput"/>
          </div>

          
          <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="button" onClick={sendSubmit}>
              Zaloguj
            </button>
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


function sendSubmit(){
  var files = document.getElementById("fileinput").files

  const formData = new FormData();
  alert(files[0])
  var reader = new FileReader();
  reader.readAsArrayBuffer(files[0])
  var blob = new Blob([files[0]], {type: "text/xml"})
  formData.append('files', blob)

  var requestOptions = {
       method: 'POST',
       headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + getCookie('access_token'),
      },
      body: blob
    };


  fetch('/upload_file', requestOptions)
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log(json);
    }).catch(function(err) {
    window.alert(err);
  });
}

function registerSubmit(){
  let path = `/register`; 
  window.location.href= path
}

function passwordResetSubmit(){
  let path = `/`; 
  window.location.href= path
  window.alert("Reset hasła")
}
export default Home;