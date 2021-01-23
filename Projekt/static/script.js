async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
}

async function login() {
    var form = document.getElementById('login_form');
    var form_data = new FormData(form);
    let response = await fetch(
        'http://0.0.0.0:8080/login',
        {
            method: 'POST',
            headers: {
		        'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(form_data)),
        }
    );
    if (response.status != 200) {
        return;
    }
    let data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    location.href = "http://0.0.0.0:8080/static/send_form.html";
}

async function refresh_token() {
    let response = await fetch(
        'http://0.0.0.0:8080/refresh',
        {
            method: 'POST',
            headers: {
		        'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
            },
        }
    );
    if (response.status != 200) {
        return;
    }
    let data = await response.json();
    localStorage.setItem('token', data.access_token);
}

async function change_password() {
    var form = document.getElementById('change_password_form');
    var form_data = new FormData(form);
    var form_body = JSON.stringify(Object.fromEntries(form_data));
    if (form_body.password != form_body.confirm_password) {
        return;
    }
    delete form_body["confirm_password"];
    let response = await fetch(
        'http://0.0.0.0:8080/change_password',
        {
            method: 'POST',
            headers: {
		        'Content-Type': 'application/json',
            },
            body: form_body,
        }
    );
    if (response.status === 200) {
        location.href = "http://0.0.0.0:8080/static/index.html";
    }
}

async function reset_password() {
    var form = document.getElementById('reset_password_form');
    var form_data = new FormData(form);
    let response = await fetch(
        'http://0.0.0.0:8080/reset_password',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(form_data)),
        }
    );
    if (response.status === 200) {
        location.href = "http://0.0.0.0:8080/static/index.html";
    }
}

async function register_user() {
    var form = document.getElementById('register_form');
    var form_data = new FormData(form);
    var form_body = JSON.stringify(Object.fromEntries(form_data));
    if (form_body.password != form_body.confirm_password) {
        return;
    }
    delete form_body["confirm_password"];
    let response = await fetch(
        'http://0.0.0.0:8080/register',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: form_body,
        }
    );
    if (response.status === 200) {
        location.href = "http://0.0.0.0:8080/static/index.html";
    }
}
