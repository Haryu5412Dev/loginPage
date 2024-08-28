app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // 알파벳 대소문자와 숫자만 허용
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    if (!usernamePattern.test(username)) {
        return res.json({ success: false, message: '유저명은 알파벳과 숫자만 포함할 수 있습니다.' });
    }

    // 특수문자 포함 여부
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharPattern.test(password)) {
        return res.json({ success: false, message: '비밀번호에는 최소 한 개의 특수문자가 포함되어야 합니다.' });
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // 유저명 중복 체크
        const existingUser = await conn.query('SELECT * FROM data WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            res.json({ success: false, message: '이미 존재하는 유저명입니다.' });
            return;
        }

        // 새로운 사용자 추가
        await conn.query('INSERT INTO data (username, password, creationDate) VALUES (?, ?, NOW())', [username, password]);
        res.json({ success: true });

    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    } finally {
        if (conn) conn.end();
    }
});
