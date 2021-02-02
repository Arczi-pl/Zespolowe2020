import React from 'react';
import ReactDOM from 'react-dom';

const Links = () => {
  getFolderContent();
  return (
    <div className="limiter">
    <div className="container-login100">
      <div className="wrap-p2p">
        
        <form className="login100-form validate-form">
          <span className="login100-form-title">
            Centrum udostępniania
          </span>
         
          <div>
            <input className="input100"  name="pass" placeholder="wpisz plik do usunięcia" id="del"/>
          </div>
          
          <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="button" onClick={downloadFiles}>
              Pobierz plik
            </button>
          </div>

          <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="button" onClick={deleteFiles}>
              Usun plik
            </button>
          </div>
          
          <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="button" onClick={shareFiles}>
              Udostępnij
            </button>
          </div>
         
          </form>

          
          <h1>PLIKI:</h1>
          <div id="table"></div>

          <span className="login100-form-title">
            <div id="delet"></div>
          </span>
        

      </div>
    </div>
  </div>

  );

}

function deleteFiles(){
  let payload = {file_name: document.getElementById("del").value}

  let url = "/delete_file/main";

  let fetchOptions = {
    method: "DELETE",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + getCookie("access_token")

    },
    body: JSON.stringify(payload)
    }

    fetch(url, fetchOptions)
    .then(function(res){ 
      return res.json(); })
    .then(function(data){ 
      var json = JSON.stringify(data)
      var obj = JSON.parse(json)

      alert(json)
      if(obj.hasOwnProperty('desc')){
        if(obj.desc == "Such file didn't exist"){
          ReactDOM.render(
            <span style={{color: "red"}}>Nie ma takiego pliku</span>,
            document.getElementById('delet')
          );
        }
        else {
          ReactDOM.render(
            <span style={{color: "green"}}>Plik usunięty pomyślnie</span>,
            document.getElementById('delet')
          );
          
        }
       
      }
      else if(obj.hasOwnProperty("access_token")){
        alert("Usunięto")
      }


    })
}


function downloadFiles(){
  let payload = {file_name: document.getElementById("del").value}

  let url = "/download_file/main";

  let fetchOptions = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + getCookie("access_token")

    },
    body: JSON.stringify(payload)
    }

    fetch(url, fetchOptions)
    .then(response => response.blob())
          .then(blob => {
              var url2 = window.URL.createObjectURL(blob);
              var b = document.createElement('a');
              b.href = url2;
              b.download = document.getElementById("del").value;
              document.body.appendChild(b); // we need to append the element to the dom -> otherwise it will not work in firefox
              b.click();    
              b.remove();  //afterwards we remove the element again         
          });
}

function shareFiles(){
  let url = "/create_sharing_link";
  let payload = {folder_name: "main"};


  let fetchOptions = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + getCookie("access_token")

    },
    body: JSON.stringify(payload)
    }

    fetch(url, fetchOptions)
    .then(function(res){ 
      return res.json(); })
    .then(function(data){ 
      var json = JSON.stringify(data)
      var obj = JSON.parse(json)

      if(obj.hasOwnProperty('link')){
        const el = document.createElement('textarea');
        el.value = "http://localhost:3000/download_shared/" + obj.link;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert("Link skopiowany do schowka!")
      }
      else{
        alert("Coś poszło nie tak, skontaktuj się z administratorem")
      }

      })
}

function getFolderContent(params) {
  let url = "/folder/main";

  let fetchOptions = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + getCookie("access_token")
      },
    }

    fetch(url, fetchOptions)
    .then(function(res){ 
      return res.json(); })
    .then(function(data){ 
      var json = JSON.stringify(data)
      var obj = JSON.parse(json)
      if(obj.hasOwnProperty('files')){
        var table = obj.files;

        var board = [];
        for (const i in table) {
          board.push([table[i]])
        }

        ReactDOM.render((
          <div>
        {board.map((row, i) => (
          <div key={i}>
            {row.map((col, j) => (
              <span key={j}>{col}</span>
                ))}
                </div>
              ))}
        </div>
        )
          ,document.getElementById('table')
        );

      }
      else {
        alert("Błąd")
      }
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

export default Links;