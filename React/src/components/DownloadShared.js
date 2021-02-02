import React, { createElement } from 'react';
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
  window.onload = () => {listFiles(id)}
  console.log(typeof(board))
  //var board = [["Test", "das"], ["DAs", "das"]]
  return (
    <div className="limiter">
    <div className="container-login100">
      <div className="wrap-login101">
        <div><h3>Kliknij na wybrany plik, aby go pobrać<br/></h3></div>
        <div className="wrap-login102">
        <div id="files"><table id="mytable"><tbody></tbody>
        
        </table></div></div>

      </div>
    </div>
  </div>
  );
}


function listFiles(id){ 
  var x = document.getElementById('mytable').getElementsByTagName('tbody')[0]

  var arr = []
  var url = "/shared_folder/" + id//getCookie("share_link")
  fetch(url)
  .then(response => response.json())
  .then(data => {
    var r, c
    for (var a of data["Shared files"]){
      r = x.insertRow()
      c = r.insertCell()
      var newText = document.createTextNode(a);
      let temp = String(a)
      c.onclick = () => {
        var myurl = '/download_shared_file/' + id
        
        let fetchOptions = {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"file_name":temp})
          }

          fetch(myurl, fetchOptions)
          .then(response => response.blob())
          .then(blob => {
              var url2 = window.URL.createObjectURL(blob);
              var b = document.createElement('a');
              b.href = url2;
              b.download = temp;
              document.body.appendChild(b); // we need to append the element to the dom -> otherwise it will not work in firefox
              b.click();    
              b.remove();  //afterwards we remove the element again         
          });

      }
      c.appendChild(newText)
      r.appendChild(document.createElement("button"))
    }
    /*for (var a of data["Shared files"]){
      arr.push([a, "Pobierz"])
    }*/
  });

  console.log(arr)
  return x

}


export default DownloadShared;