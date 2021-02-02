import React from 'react';
import ReactDOM from 'react-dom';

const Account = () => {
  return (
    <div className="limiter">
    <div className="container-main">
    <div id="username"></div>

    <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="button" onClick={getUsername}>
              Poznaj swój email
            </button>
          </div>
    </div>
  </div>
  );

}

function getUsername() {
  let url = "/get_username"

  let fetchOptions = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      "Authorization": "Bearer " + getCookie("access_token")

    }
    }

    fetch(url, fetchOptions)
    .then(function(res){ 
      return res.json(); })
    .then(function(data){ 
      var json = JSON.stringify(data)
      var obj = JSON.parse(json)

      if(obj.hasOwnProperty('detail')){
        
        ReactDOM.render(
          <span style={{color: "red"}}>Username...</span>,
          document.getElementById('username')
        );
      }
      else if(obj.hasOwnProperty("user")){
        ReactDOM.render(
          <span style={{color: "black"}}>{obj.user}</span>,
          document.getElementById('username')
        );
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

export default Account;
