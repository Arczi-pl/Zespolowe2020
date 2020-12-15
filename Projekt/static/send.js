function send() {
    var form = document.getElementById('file_form');
    var form_data = new FormData(form);
    console.log(form_data.get("file"));

    fetch('http://0.0.0.0:8080/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.getItem('token'),
        },
        body: form_data,
    })
        .then(function(response) {
            if (response.status === 200) {
                // location.href = "http://0.0.0.0:8080/static/index.html";
            }
        });
}
