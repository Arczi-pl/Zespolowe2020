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
  cookies.set("share_link", id);
  //download_file(id)
  window.onload = listFiles
  console.log(typeof(board))
  //var board = [["Test", "das"], ["DAs", "das"]]
  return (
    <div className="limiter">
    <div className="container-login100">
      <div className="wrap-login101">

        <div id="files"><table id="mytable"><tbody></tbody>
        
        </table></div>

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


function download_file(id){
    fetch('/download_shared_file/' + id)
    .then(response => response.json())
    .then(data => console.log(data));
}

function listFiles(){ 
  var x = document.getElementById('mytable').getElementsByTagName('tbody')[0]

  var url = "/shared_folder/" + getCookie("shared_link")
  fetch(url)
  .then(response => response.json())
  .then(data => {
    var r, c
    if(typeof(data["Shared files"]) == "array")
    for (var a of data["Shared files"]){
      r = x.insertRow()
      c = r.insertCell()
      var newText = document.createTextNode(a);
      c.appendChild(newText)
    }
  });

  console.log(x)
  return x

}


export default DownloadShared;