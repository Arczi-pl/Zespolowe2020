function login() {
    var form = document.getElementById('login_form');
    var form_data = new FormData(form);
    var request_body = 'grant_type=&username=' + form_data.get("username") + '&password='
        + form_data.get("password") + "&scope=&client_id=&client_secret=";

    fetch('http://0.0.0.0:8080/login', {
        method: 'POST',
        mode: 'cors',
        body: request_body,
	    headers: {
		    'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(function(response) {
            if (response.status === 200) {
                response.json()
                    .then(function(data) {
                        localStorage.setItem('token', data.access_token);
                    });
                location.href = "http://0.0.0.0:8080/static/index.html";
            }
        });
}
