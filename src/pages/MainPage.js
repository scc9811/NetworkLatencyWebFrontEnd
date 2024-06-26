import React, { useState, useEffect, useRef } from 'react';

function MainPage() {
  const [publicIP, setPublicIP] = useState('');
  const [responsesCount, setResponsesCount] = useState(0); // 응답 횟수 상태
  const [totalLatency, setTotalLatency] = useState(0); // 총 latency 상태
  const [averageLatency, setAverageLatency] = useState(null); // 평균 latency 상태
  const [isTestCompleted, setIsTestCompleted] = useState(false); // 핑 테스트 완료 상태
  const [serverLocation, setServerLocation] = useState(null); // 서버 위치 상태
  const [clientLocation, setClientLocation] = useState(null); // 클라이언트 위치 상태

  const storeResult = async () => {
    const token = localStorage.getItem('token');

    console.log('token : ', token);
    if (token) {
      try {
        const response = await fetch('http://scc9811.site:8080/ping/storeResult', {
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
        const response = await fetch('http://scc9811.site:8080/ping/getClientIP');
        const data = await response.text();
        setPublicIP(data);
      } catch (error) {
        console.error('Error fetching public IP:', error);
      }
    };
    fetchPublicIP();
  }, []);

  useEffect(() => {
    const maxRequests = 10;

    const pingServer = async () => {
      const start = new Date().getTime();
      try {
        await fetch('http://scc9811.site/', { method: 'HEAD', mode:'no-cors' });
        const end = new Date().getTime();
        const latency = end - start;

        setResponsesCount(prevCount => prevCount + 1);
        setTotalLatency(prevLatency => prevLatency + latency);

        const average = (totalLatency + latency) / (responsesCount + 1);
        setAverageLatency(average.toFixed(2));
      } catch (error) {
        console.error('Error pinging server:', error);
      }
    };

    const interval = setInterval(() => {
      if (responsesCount < maxRequests) {
        pingServer();
      } else {
        setIsTestCompleted(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [responsesCount, totalLatency]);

  useEffect(() => {
    const fetchServerLocation = async () => {
      try {
        const response = await fetch('http://scc9811.site:8080/map/getServerLocation');
        const data = await response.json();
        if (data.latitude && data.longitude) {
          setServerLocation({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
        }
      } catch (error) {
        console.error('Error fetching server location:', error);
      }
    };

    const fetchClientLocation = async () => {
      try {
        const response = await fetch('http://scc9811.site:8080/map/getClientLocation');
        const data = await response.json();
        if (data.latitude && data.longitude) {
          setClientLocation({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
        }
      } catch (error) {
        console.error('Error fetching client location:', error);
      }
    };

    fetchServerLocation();
    fetchClientLocation();
  }, []);

  useEffect(() => {
    const initMap = () => {
      if (!serverLocation || !clientLocation) return;

      const centerPoint = { lat: 37.5665, lng: 126.9780 };

      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: centerPoint
      });

      const markerA = new window.google.maps.Marker({
        position: clientLocation,
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

      const markerB = new window.google.maps.Marker({
        position: serverLocation,
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
        path: [clientLocation, serverLocation],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      line.setMap(map);
    };
    console.log(serverLocation);
    console.log(clientLocation);

    if (window.google && serverLocation && clientLocation) {
      initMap();
    } else if (serverLocation && clientLocation) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2n27g34TSYRbMdDrdl3ZxlwtvAZa05tA`;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [serverLocation, clientLocation]);

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
        {isTestCompleted && ( // 핑 테스트가 완료되었을 때만 버튼 표시
          <div>
            <button className='storeButton' onClick={storeResult}>결과 저장하기</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
