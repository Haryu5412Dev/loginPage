document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault(); // 기본 제출 동작 방지

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var errorMessage = document.getElementById("errorMessage");

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("회원가입 성공");
            window.location.href = "login.html";
        } else {
            errorMessage.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.textContent = '서버 오류가 발생했습니다.';
    });
});
