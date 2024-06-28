import React, { useState, useEffect, useRef } from 'react';

function MainPage() {
  const [publicIP, setPublicIP] = useState('');
  const [responsesCount, setResponsesCount] = useState(0); // 응답 횟수 상태
  const [totalLatency, setTotalLatency] = useState(0); // 총 latency 상태
  const [averageLatency, setAverageLatency] = useState(null); // 평균 latency 상태
  const [socket, setSocket] = useState(null); // WebSocket 상태
  const [isSocketClosed, setIsSocketClosed] = useState(false); // WebSocket 종료 상태
  const requestCountRef = useRef(0); // 요청 횟수 useRef로 관리

  const storeResult = async () => {
    const token = localStorage.getItem('token');

    console.log('token : ', token);
    if (token) {
      try {
        const response = await fetch('http://localhost:8080/ping/storeResult', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ averageLatency })
        });
        console.log('요청결과 : ', response);
        if (response.ok) {
          alert('저장 완료');
          window.location.href = '/user/myPage';
        } else {
          alert('로그인이 필요합니다');
          window.location.href = '/user/signIn';
        }
      } catch (error) {
        alert('로그인이 필요합니다');
        window.location.href = '/user/signIn';
      }
    } else {
      window.location.href = '/user/signIn';
    }
  }

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
    const newSocket = new WebSocket('ws://localhost:8080/networkLatencyWebSocketConnection');
    setSocket(newSocket);

    newSocket.onopen = () => {
      setIsSocketClosed(false); // WebSocket이 열렸을 때 상태 업데이트
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsSocketClosed(true); // WebSocket이 닫혔을 때 상태 업데이트
    };

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const maxRequests = 10;

    const interval = setInterval(() => {
      if (requestCountRef.current < maxRequests) {
        const clientTimeStamp = new Date().getTime();
        const message = {
          clientTimeStamp: clientTimeStamp
        };
        socket.send(JSON.stringify(message));
        requestCountRef.current++;
      } else {
        socket.close();
        clearInterval(interval);
      }
    }, 1000);

    socket.onmessage = (event) => {
      const serverResponseData = JSON.parse(event.data);
      if (serverResponseData.hasOwnProperty('latency')) {
        const latency = serverResponseData.latency;

        setResponsesCount(prevCount => prevCount + 1);
        setTotalLatency(prevLatency => prevLatency + latency);

        const average = (totalLatency + latency) / (responsesCount + 1);
        setAverageLatency(average.toFixed(2));
      }
    };

    return () => {
      clearInterval(interval);
    };
  }, [socket, responsesCount, totalLatency]);

  useEffect(() => {
    const initMap = () => {
      const centerPoint = { lat: 37.5665, lng: 126.9780 };

      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: centerPoint
      });

      const pointA = { lat: 37.8747, lng: 127.7342 };
      const markerA = new window.google.maps.Marker({
        position: pointA,
        map: map,
        title: 'YOU',
        label: {
          text: 'YOU',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '12px',
          className: 'map-label'
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 25,
          fillColor: '#FF0000',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#FFFFFF'
        }
      });

      const pointB = { lat: 37.5665, lng: 126.9780 };
      const markerB = new window.google.maps.Marker({
        position: pointB,
        map: map,
        title: 'SERVER',
        label: {
          text: 'SERVER',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '12px',
          className: 'map-label'
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 25,
          fillColor: '#0000FF',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#FFFFFF'
        }
      });

      const line = new window.google.maps.Polyline({
        path: [pointA, pointB],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      line.setMap(map);
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2n27g34TSYRbMdDrdl3ZxlwtvAZa05tA`;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div>
      <h1 className='userIP'>
        Your Public IP : {publicIP} <br />
        Server IP : 54.180.58.154 <br />
      </h1>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
      <div className='myBox'>
        <h1>Latency Time : {averageLatency}ms</h1>
        <h2>Test Count : {responsesCount}</h2> {/* 응답 횟수 표시 */}
        {isSocketClosed && ( // WebSocket이 닫혔을 때만 버튼 표시
          <div>
            <button className='storeButton' onClick={storeResult}>결과 저장하기</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
