import React, { useState, useEffect, useRef } from 'react';

const TestPage = () => {
  const [responsesCount, setResponsesCount] = useState(0); // 응답 횟수 상태
  const [totalLatency, setTotalLatency] = useState(0); // 총 latency 상태
  const [averageLatency, setAverageLatency] = useState(null); // 평균 latency 상태
  const [socket, setSocket] = useState(null); // WebSocket 상태
  const requestCountRef = useRef(0); // 요청 횟수 useRef로 관리

  useEffect(() => {
    // WebSocket 연결
    const newSocket = new WebSocket('ws://scc9811.site:8080/networkLatencyWebSocketConnection');
    setSocket(newSocket);

    // 컴포넌트가 언마운트될 때 WebSocket 연결 닫기
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const maxRequests = 10;

    // 1초마다 요청 보내기
    const interval = setInterval(() => {
      if (requestCountRef.current < maxRequests) {
        const clientTimeStamp = new Date().getTime();
        const message = {
          clientTimeStamp: clientTimeStamp
        };
        socket.send(JSON.stringify(message));
        requestCountRef.current++; // useRef를 사용하여 requestCount 증가
        console.log('requestCount', requestCountRef.current);
        console.log('maxR', maxRequests);
      } else {
        // 요청 횟수가 maxRequests를 넘으면 interval 정리
        clearInterval(interval);
      }
    }, 1000);

    // 서버에서 메시지를 받았을 때 실행되는 이벤트 핸들러
    socket.onmessage = (event) => {
      const serverResponseData = JSON.parse(event.data);
      if (serverResponseData.hasOwnProperty('latency')) {
        const latency = serverResponseData.latency;

        // 응답 횟수와 총 latency 업데이트
        setResponsesCount(prevCount => prevCount + 1);
        setTotalLatency(prevLatency => prevLatency + latency);

        // 평균 latency 계산
        const average = totalLatency / (responsesCount + 1); // 현재 응답 횟수 포함하여 계산
        setAverageLatency(average.toFixed(2)); // 소수점 둘째 자리까지 표시
      }
    };

    // 연결이 닫혔을 때 실행되는 이벤트 핸들러
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // clearInterval을 사용하여 interval 정리
    return () => {
      clearInterval(interval);
    };
  }, [socket, responsesCount, totalLatency]);

  return (
    <div style={{color:'white'}}>
      <p>Responses received: {responsesCount}</p>
      {averageLatency !== null && (
        <p>Average latency: {averageLatency} ms</p>
      )}
    </div>
  );
};

export default TestPage;
