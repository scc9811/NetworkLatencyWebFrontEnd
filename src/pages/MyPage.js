import React, { useState, useEffect } from 'react';

function MyPage() {
    const [nickName, setNickName] = useState('');
    const [testResults, setTestResults] = useState([]);

    const getDayOfWeek = (day) => {
        switch (day) {
            case 1:
                return '월요일';
            case 2:
                return '화요일';
            case 3:
                return '수요일';
            case 4:
                return '목요일';
            case 5:
                return '금요일';
            case 6:
                return '토요일';
            case 7:
                return '일요일';
            default:
                return '';
        }
    };


  useEffect(() => {
    const fetchNickName = async () => {
      try {
        const response = await fetch('http://localhost:8080/user/getUserNickName', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const nickName = await response.text();
          setNickName(nickName);
        } else {
            alert('로그인이 필요합니다.');
            window.location.href = '/user/signIn';
        }
      } catch (error) {
        alert('로그인이 필요합니다.');
        window.location.href = '/user/signIn';
      }
    };

    fetchNickName();
  }, []);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await fetch('http://localhost:8080/ping/getTestResult', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
            const data = await response.json();
            setTestResults(data);
        }
        else {
            alert('로그인이 필요합니다.');
            window.location.href = '/user/signIn';
        }
      } catch (error) {
        alert('로그인이 필요합니다.');
        window.location.href = '/user/signIn';
      }
    };

    fetchTestResults();
  }, []);


  return (
    <div>
      <h1 className='userIP'>{nickName ? `${nickName}'s Page` : 'Loading...'}</h1>
      <div className='myBox'>
        <table className='testResultsTable'>
            <thead>
                <tr>
                    <th>요일</th>
                    <th>시간대</th>
                    <th>평균 응답시간</th>
                </tr>
            </thead>
            <tbody>
                {testResults
                    .sort((a, b) => {
                        if (a.id.day !== b.id.day) {
                            return a.id.day - b.id.day;
                        } else {
                            return a.id.hour - b.id.hour;
                        }
                    })
                    .map((result, index) => (
                        <tr key={index}>
                            <td>{getDayOfWeek(result.id.day)}</td>
                            <td>{result.id.hour}시</td>
                            <td>{result.averageTime} ms</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    </div>
    </div>
  );
}

export default MyPage;
