import React, { useState } from 'react';
import './Style.css';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

const handleLogin = async (event) => {
  event.preventDefault(); // Prevents the default form submission behavior

  // setError(''); // Clear previous errors
  try {
    const response = await fetch('http://localhost:8080/user/signIn', {
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
      // Redirect to home or another page
      window.location.href = '/';
    } else {
      // setError(data.message || 'Login failed');
      alert('정보가 일치하지 않습니다.\n다시 시도해주세요.');
      // -> 페이지 유지
    }
  } catch (error) {
    // setError('An error occurred. Please try again.');
    alert('정보가 일치하지 않습니다.\n다시 시도해주세요.');
    // -> 페이지 유지
    console.error('An error occurred:', error); // 에러를 콘솔에 출력
  }
};

  // const handleLogin = async () => {
  //   // setError(''); // Clear previous errors
  //   try {
  //       // getJwt --> signIn 수정 필요.
  //     const response = await fetch('http://localhost:8080/user/signIn', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ email, password })
  //     });
      

  //     const data = await response.json();
  //     console.log(data);
  //     if (response.ok) {
  //       localStorage.setItem('token', data.jwt);  // JWT를 localStorage에 저장
  //       console.log('Login successful');
  //     } else {
  //       // setError(data.message || 'Login failed');
  //       alert('정보가 일치하지 않습니다.\n다시 시도해주세요.');
  //       // -> 페이지 유지
  //     }
  //   } catch (error) {
  //   //   setError('An error occurred. Please try again.');
  //   // alert('정보가 일치하지 않습니다.\n다시 시도해주세요.');
  //       // -> 페이지 유지
  //       // alert('11');
  //       console.error('An error occurred:', error); // 에러를 콘솔에 출력
        
  //   }
  // };

  return (
    <div>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form style={{height: '480px'}}>
        <h3>Login Here</h3>

        {/* <label htmlFor="username">Email</label> */}
        <label>Email</label>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        {/* <label htmlFor="password">Password</label> */}
        <label>Password</label>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

        <button onClick={handleLogin}>Log In</button>
        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
        <br/>
        <br/>
        <p>Don't have an account? <a href="/user/signUp">Sign up</a></p>

      </form>
    </div>
  );
};

export default SignInPage;
