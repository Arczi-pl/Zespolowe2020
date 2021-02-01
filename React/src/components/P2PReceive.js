import React from 'react';
import Tilt from 'react-tilt';
import ReactDOM from 'react-dom';
import Cookies from 'universal-cookie';
import Peer from 'peerjs';

//Obrazy
import send6 from './send6.png';

const cookies = new Cookies();

document.title = "Odbierz wysyłane bezpośrednio"

const P2PRecive = () => {

  initialize();

  return (
    <div className="limiter">
    <div className="container-login100">
      <div className="wrap-login100">
        
      <div className="login100-form validate-form">
          <span className="login100-form-title">
            Podaj kod połączenia
          </span>

          <div>
        <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
            <input className="input100" type="text" placeholder="Kod połączenia" id="code"/>
            <span className="focus-input100"></span>
            <span className="symbol-input100">
            </span>
          </div>

        <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="button" onClick={join}>
              Połącz
            </button>
          </div>
      </div>

      <div className="text-center p-t-136">
          </div>

        </div>


        <div>
        <span className="login100-form-title">
                    <i id="dot" style={{color: "red"}} className="fa fa-circle" aria-hidden="true"></i>
                        <span id="status"> Brak połączenia</span>
        </span>
        <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
            <input className="input100" type="text" name="email" value="Nie odebrano pliku" id="received"/>
            <span className="focus-input100"></span>
            <span className="symbol-input100">
              <i className="fa fa-file" aria-hidden="true"></i>
            </span>
          </div>

        <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="button" onClick={download}>
              Pobierz
            </button>
          </div>
          <div className="text-center p-t-136">
            <a className="txt2" href="/nologin">
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


/* Receive P2P */


var lastPeerId = null;
var peer = null; // own peer object
var conn = null;
var receivedData = null;
var recvIdInput = document.getElementById("code");


function download(){
    if (receivedData == null)
        return
    else
        saveData(receivedData.file, receivedData.filename)
}

var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var blob = new Blob([data]);
        var url = window.URL.createObjectURL(blob);
        console.log("DATA: " + data)
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

/**
 * Create the Peer object for our end of the connection.
 *
 * Sets up callbacks that handle any events related to our
 * peer object.
 */
function initialize() {

    lastPeerId = null;
    peer = null; // own peer object
    conn = null;
    receivedData = null;

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
    });
    peer.on('connection', function (c) {
        // Disallow incoming connections
        c.on('open', function() {
            c.send("Sender does not accept incoming connections");
            setTimeout(function() { c.close(); }, 500);
        });
    });
    peer.on('disconnected', function () {
        console.log('Connection lost. Please reconnect');
        
        // Workaround for peer.reconnect deleting previous id
        peer.id = lastPeerId;
        peer._lastServerId = lastPeerId;
        peer.reconnect();
    });
    peer.on('close', function() {
        document.getElementById("status").innerText = " Brak połączenia"
        document.getElementById("dot").style.color = "red"

        conn = null;
        console.log('Connection destroyed');
    });
    peer.on('error', function (err) {
        document.getElementById("status").innerText = " Brak połączenia"
        document.getElementById("dot").style.color = "red"

        console.log(err);
        alert('' + err);
    });
};

/**
 * Create the connection between the two Peers.
 *
 * Sets up callbacks that handle any events related to the
 * connection and data received on it.
 */
function join() {
    // Close old connection
    recvIdInput = document.getElementById("code")
    if (conn) {
        conn.close();
    }
    
    // Create connection to destination peer specified in the input field
    conn = peer.connect(recvIdInput.value, {
        reliable: true
    });
    
    conn.on('open', function () {
        document.getElementById("status").innerText = " Nawiązano połączenie"
        document.getElementById("dot").style.color = "green"
    
        console.log("Connected to: " + conn.peer);
        
        var command = getUrlParam("command");
        if (command)
            conn.send(command);
    });

    conn.on('data', function (data) {
        if(data instanceof Object){
            alert("Otrzymano plik: " + data.filename)
            document.getElementById("received").value = data.filename
            receivedData = data
        }
    });
    conn.on('close', function () {
        document.getElementById("status").innerText = " Brak połączenia"
        document.getElementById("dot").style.color = "red"

    });
    conn.on('error', function () {
        document.getElementById("status").innerText = " Brak połączenia"
        document.getElementById("dot").style.color = "red"

    });
};

/**
 * Get first "GET style" parameter from href.
 * This enables delivering an initial command upon page load.
 *
 * Would have been easier to use location.hash.
 */
function getUrlParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return null;
    else
        return results[1];
};

/**
 * Send a signal via the peer connection and add it to the log.
 * This will only occur if the connection is still alive.
 */
function signal(sigName) {
    if (conn && conn.open) {
        conn.send(sigName);
        console.log(sigName + " signal sent");
    } else {
        console.log('Connection is closed');
    }
}

    

export default P2PRecive;