document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // 기본 제출 동작 방지

    var username = document.getElementById("username").value.toLowerCase();
    var password = document.getElementById("password").value;
    var errorMessage = document.getElementById("errorMessage");

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("로그인 성공");
            window.location.href = "final.html";
        } else {
            errorMessage.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.textContent = '서버 오류가 발생했습니다.';
    });
});
