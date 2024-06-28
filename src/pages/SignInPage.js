import React, { useState } from 'react';
import './Style.css';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async (event) => {
  event.preventDefault(); // Prevents the default form submission behavior

  try {
    const response = await fetch('http://scc9811.site:8080/user/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      localStorage.setItem('token', data.jwt);  // JWT를 localStorage에 저장
      console.log('Login successful');
      window.location.href = '/';
    } else {
      alert('정보가 일치하지 않습니다.\n다시 시도해주세요.');
    }
  } catch (error) {
    alert('정보가 일치하지 않습니다.\n다시 시도해주세요.');
    console.error('An error occurred:', error); // 에러를 콘솔에 출력
  }
};

  return (
    <div>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form style={{height: '480px'}}>
        <h3>Login Here</h3>

        <label>Email</label>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

        <button onClick={handleLogin}>Log In</button>
        <br/>
        <br/>
        <p>Don't have an account? <a href="/user/signUp">Sign up</a></p>

      </form>
    </div>
  );
};

export default SignInPage;
