import React from 'react';
import ReactDOM from 'react-dom';

const Links = () => {
  getFolderContent();
  return (
    <div className="limiter">
    <div className="container-login100">
      <div className="wrap-login100">
        
        <form className="login100-form validate-form">
          <span className="login100-form-title">
            Centrum udostępniania
          </span>

          <div>
            <input className="input100"  name="pass" placeholder="wpisz plik do usunięcia" id="del"/>
          </div>
          
          <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="button" onClick={deleteFiles}>
              Usun plik
            </button>
          </div>

          <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="button" onClick={deleteFiles}>
              Udostępnij
            </button>
          </div>

          </form>

          
          <h1>PLIKI:</h1>
          <div id="table"></div>
        

      </div>
    </div>
  </div>

  );

}

function deleteFiles(){
  alert("comming soon")
}
function shareFiles(){
  alert("coming soon")
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