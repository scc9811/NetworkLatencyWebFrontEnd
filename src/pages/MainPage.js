import React, { useState, useEffect } from 'react';

function MainPage() {
  // const [socketData, setSocketData] = useState(null);
  // const [isAllowed, setIsAllowed] = useState(null);
  const [publicIP, setPublicIP] = useState('');
  // const [responseCount, setResponseCount] = useState(0); // 응답 횟수 상태 추가

  const [responsesCount, setResponsesCount] = useState(0); // 응답 횟수 상태
  const [totalLatency, setTotalLatency] = useState(0); // 총 latency 상태
  const [averageLatency, setAverageLatency] = useState(null); // 평균 latency 상태
  const [socket, setSocket] = useState(null); // WebSocket 상태
  const requestCountRef = useRef(0); // 요청 횟수 useRef로 관리

  
  useEffect(() => {
    const fetchPublicIP = async () => {
      try {
        const response = await fetch('http://localhost:8080/ping/getClientIP');
        const data = await response.text();
        setPublicIP(data);
      } catch (error) {
        console.error('Error fetching public IP:', error);
      }
    };
    fetchPublicIP();
  }, []);

  useEffect(() => {
    if (isAllowed) {
      // WebSocket 연결
      const ws = new WebSocket('ws://localhost:8080/networkLatencyWebSocketConnection');

      // 소켓 연결될 때 실행되는 함수
      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      // 메시지를 수신할 때 실행되는 함수
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setSocketData(data);
        setResponseCount(prevCount => prevCount + 1);
      };

      // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
      return () => {
        
        ws.close();
      };
    }
  }, [isAllowed]);

  if (isAllowed === null) {
    return (
      <div>
        <div className='guideButtonBox'>
          <h1 className='userIP'>방화벽 확인 필요.</h1>
          <button onClick={() => window.location.href = '/guidePage'}>
            방화벽 가이드로 이동
          </button>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div>
        <div className='guideButtonBox'>
          <h1 className='userIP'>방화벽 확인 필요.</h1>
          <button onClick={() => window.location.href = '/guidePage'}>
            방화벽 가이드로 이동
          </button>
        </div>
      </div>
    );
  }

  if (!socketData) {
    return (
      <div>
        <div className='guideButtonBox'>
          <h1 className='userIP'>방화벽 확인 필요.</h1>
          <button onClick={() => window.location.href = '/guidePage'}>
            방화벽 가이드로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className='userIP'>
        Your Public IP : {publicIP} <br />
        Server IP : 54.180.58.154 <br />
      </h1>
      <div className='myBox'>
        <h1>평균 응답시간 : {socketData.averageResponseTime}ms</h1>
        {socketData.running ? null : (
          <div>
            <h1>패킷 손실 비율 : {socketData.packetLossRate}</h1>
            <button className='storeButton' onClick={storeResult}>결과 저장하기</button>
          </div>
        )}
        <h2>응답 횟수 : {responseCount}</h2> {/* 응답 횟수 표시 */}
      </div>
    </div>
  );
}

export default MainPage;
