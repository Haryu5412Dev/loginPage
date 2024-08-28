document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault(); // 기본 제출 동작 방지

    var username = document.getElementById("username").value.toLowerCase();
    var password = document.getElementById("password").value;
    var errorMessage = document.getElementById("errorMessage");

    // 유저명 유효성 검사: 알파벳 대소문자와 숫자만 허용
    var usernamePattern = /^[a-zA-Z0-9]+$/;
    if (!usernamePattern.test(username)) {
        errorMessage.textContent = '유저명은 알파벳과 숫자만 포함할 수 있습니다.';
        return;
    }

    // 비밀번호 유효성 검사: 특수문자 포함 여부
    var specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharPattern.test(password)) {
        errorMessage.textContent = '비밀번호에는 최소 한 개의 특수문자가 포함되어야 합니다.';
        return;
    }

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
