const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const pool = mariadb.createPool({
    host: 'svc.sel4.cloudtype.app',
    user: 'root',
    port: 32212,
    password: '00001234',
    database: 'loginData',
    connectionLimit: 5
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));

// 로그인 요청 처리
app.post('/', async (req, res) => {
    const { username, password } = req.body;

    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM data WHERE username = ? AND password = ?', [username, password]);

        if (rows.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: '유저명이나 비밀번호가 틀렸습니다.' });
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    } finally {
        if (conn) conn.end();
    }
});

// 회원가입 요청 처리
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // 비밀번호 유효성 검사: 특수문자 포함 여부
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

// 루트 경로에 로그인 페이지 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 서버 시작
app.listen(3000, () => {
    console.log('서버가 이 링크로 열렸습니다! :  http://localhost:3000');
});
