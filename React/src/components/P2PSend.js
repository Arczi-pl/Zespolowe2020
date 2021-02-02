import React from 'react';
import Tilt from 'react-tilt';
import ReactDOM from 'react-dom';
import Cookies from 'universal-cookie';
import Peer from 'peerjs';

//Obrazy
import send6 from './send6.png';

const cookies = new Cookies();

document.title = "Wyślij bezpośrednio"

const P2PSend = () => {

  initialize();

  return (
    <div className="limiter">
    <div className="container-login100">

      <div className="wrap-p2p">
        <div className="login100-form validate-form">
          <span className="login100-form-title">
            Kod połączenia
          </span>

          <div>
        <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
            <input className="input100" type="text" value="Kod odbioru" id="code" disabled/>
            <span className="focus-input100"></span>
            <span className="symbol-input100">
            </span>
          </div>

        <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="button" onClick={copyToClipboard}>
              Skopiuj kod
            </button>
          </div>
      </div>

      <div className="text-center p-t-136">
          </div>

        </div>
        

        <div className="login100-form validate-form">
            <span className="login100-form-header">Status połączenia:<br/></span>
                <span className="login100-form-text">
                    <i id="dot" style={{color: "red"}} className="fa fa-circle" aria-hidden="true"></i>
                        <span id="status"> Brak odbiorcy</span>
                </span>
            <div class="custom-file-block">
                <input className="custom-file-upload" type="file" id="file_input" onChange={fileChange}/>
                <label class="custom-file-upload" for="file_input"><i class="fa fa-cloud-upload"></i><span id="chosen_file"> Wybierz plik</span></label>
            </div>

        <div className="container-login100-form-btn">
            <button id="sendBtn" className="login100-form-btn" type="button" onClick={fileChosen}>
              Wyślij
            </button>
          </div>
          <div className="text-center p-t-136">
            <a className="txt2" href="/main">
              Powrót
              <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
            </a>
          </div>

      </div>
      </div>
    </div>
  </div>
  );
}


function copyToClipboard() {
    var copyText = document.getElementById("code");
    
    copyText.removeAttribute("disabled");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    
    document.execCommand("copy");
    copyText.setSelectionRange(0, 0); /* For mobile devices */
    copyText.setAttribute("disabled", "disabled");  
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


/* Send P2P */

var lastPeerId = null;
var peer = null; // Own peer object
var conn = null;

/**
 * Create the Peer object for our end of the connection.
 *
 * Sets up callbacks that handle any events related to our
 * peer object.
 */
function initialize() {
// Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
        debug: 2
    });

    peer.on('open', function (id) {
        // Workaround for peer.reconnect deleting previous id
        if (peer.id === null) {
            console.log('Received null id from peer open');
            peer.id = lastPeerId;
        } else {
            lastPeerId = peer.id;
        }

        console.log('ID: ' + peer.id);
        document.getElementById('code').value = peer.id;
    });
    peer.on('connection', function (c) {
        // Allow only a single connection
        if (conn && conn.open) {
            c.on('open', function() {
                c.send("Already connected to another client");
                setTimeout(function() { c.close(); }, 500);
            });
            return;
        }

        conn = c;
        console.log("Connected to: " + conn.peer);
        ready();
    });
    peer.on('disconnected', function () {
        alert("Połączenie utracone 1")
        console.log('Connection lost. Please reconnect');
        
        // Workaround for peer.reconnect deleting previous id
        peer.id = lastPeerId;
        peer._lastServerId = lastPeerId;
        peer.reconnect();
    });
    peer.on('close', function() {
        document.getElementById("status").innerText = " Brak odbiorcy"
        document.getElementById("dot").style.color = "red"
        document.getElementById("sendBtn").setAttribute("disabled", "disabled");  
    
        conn = null;
        console.log('Connection destroyed');
    });
    peer.on('error', function (err) {
        document.getElementById("status").innerText = " Brak odbiorcy"
        document.getElementById("dot").style.color = "red"
        document.getElementById("sendBtn").setAttribute("disabled", "disabled");  
    
        console.log(err);
        alert('' + err);
    });
};

/**
 * Triggered once a connection has been achieved.
 * Defines callbacks to handle incoming data and connection events.
 */
function ready() {
    document.getElementById("status").innerText = " Połączono z odbiorcą"
    document.getElementById("dot").style.color = "green"
    document.getElementById("sendBtn").removeAttribute("disabled");

    conn.on('data', function (data) {
        console.log("Data recieved");
    });
    conn.on('close', function () {
        conn = null;
    });
    conn.on('error', function () {
        alert("Utracono połączenie err")
        conn = null;
    });
    
}


function fileChosen() {
    try {
      const file = document.getElementById('file_input').files[0]
      const blob = new Blob(document.getElementById('file_input').files, { type: file.type })

      conn.send({
        file: blob,
        filename: file.name,
        filetype: file.type
      })

    } catch (e) {
        }

};

function fileChange(){
    const files = document.getElementById('file_input').files
    if (files.length > 0){
        document.getElementById("chosen_file").innerText = " " + files[0].name
    }
    else{
        document.getElementById("chosen_file").innerText = " Wybierz plik"
    }
}

export default P2PSend;
