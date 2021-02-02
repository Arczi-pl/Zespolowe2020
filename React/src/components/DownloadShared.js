import React from 'react';
import Tilt from 'react-tilt';
import ReactDOM from 'react-dom';
import Cookies from 'universal-cookie';
import Peer from 'peerjs';
import { useParams } from 'react-router-dom';
//Obrazy
import send6 from './send6.png';

const cookies = new Cookies();

document.title = "Pobierz udostępniony plik"

const DownloadShared = () => {

  let { id } = useParams();
  download_file(id)

  return (
    <div className="limiter">
    <div className="container-login100">
      <div className="wrap-login101">

            <h1>{id}</h1>
        
      </div>
    </div>
  </div>
  );
}


function download_file(id){
    fetch('/download_shared_file/' + id)
    .then(response => response.json())
    .then(data => console.log(data));
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


export default DownloadShared;