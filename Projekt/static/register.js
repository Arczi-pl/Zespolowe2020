function register_user() {
    var form = document.getElementById('register_form');
    var form_data = new FormData(form);
    fetch('http://0.0.0.0:8080/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(form_data)),
    }).then(function(response) {
        if (response.status === 200) {
            location.href = "http://0.0.0.0:8080/static/index.html";
        }
    });
}
