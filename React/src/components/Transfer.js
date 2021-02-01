import React from 'react';
import Tilt from 'react-tilt';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
//Obrazy
import send6 from './send6.png';

const Transfer = () => {
  return (
    <div className="limiter">
    <div className="container-main">

            <form className="login100-form validate-form">
            <span className="login100-form-title">
              Prześlij plik
            </span>
            <input className="custom-file-upload" type="file" id="file_input" onChange={fileChange}/>
            <label class="custom-file-upload" for="file_input"><i class="fa fa-cloud-upload"></i><span id="chosen_file">Choose file(s)</span></label>
          
          <div className="container-login100-form-btn">
            <button type="button" className="login100-form-btn" onClick={uploadFileSubmit}>
              Prześlij
            </button>
          </div>
          <div id="error_msg"></div></form>

        <div>
        <a type="button" onClick={getFileSubmit} href =""><span className="login100-form-title">Pobierz plik</span>
        <Tilt className="Tilt">
        <div className="login100-pic js-tilt"><img src={send6}  alt="IMG"/></div>         
        </Tilt></a>

      </div>
    </div>
  </div>
  );

}

function fileChange(){
    const files = document.getElementById('file_input').files
    if (files.length > 0){
        document.getElementById("chosen_file").innerText = " " + files[0].name
    }
    else{
        document.getElementById("chosen_file").innerText = " Wybierz plik"
    }
}

function getFileSubmit(){
    window.alert("Pobierz plik");
  }


function uploadFileSubmit(){
  const my_file = document.getElementById("fileinput")
  const plik = new Blob([my_file.files[0]], {type: my_file.files[0].type})
  const filename = my_file.value.split(/[\s\\]+/).pop();
  const data = new FormData()
  data.append("files", plik, filename);

  var url = "/upload_file";
  var fetchOpiotns = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      "Authorization": "Bearer " + getCookie("access_token")
    },
    body: data
    
  };

  fetch(url, fetchOpiotns)
  .then(function(res){ 
    return res.json(); })
  .then(function(data){ 
    var json = JSON.stringify(data);
    var obj = JSON.parse(json)
    //TODO: To by można ulepszyć :/
    if(obj.hasOwnProperty('detail')){
      ReactDOM.render(
        <span style={{color: "red"}}>Na serwerze jest plik o takiej nazwie</span>,
        document.getElementById('error_msg')
      );}

    else if(obj.hasOwnProperty('desc')){
      ReactDOM.render(
        <span style={{color: "green"}}>Plik dodany na serwer</span>,
        document.getElementById('error_msg')
      );}
    
  })
  .catch(function(err) {
    alert("ERROR: " + err)  
  })
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
export default Transfer;
