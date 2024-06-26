import image1 from '../assets/1.png';
import image2 from '../assets/2.png';
import image3 from '../assets/3.png';
import image4 from '../assets/4.png';
import image5 from '../assets/5.png';
import image6 from '../assets/6.png';
import image7 from '../assets/7.png';
import image8 from '../assets/8.png';
import image9 from '../assets/9.png';
import image10 from '../assets/10.png';
import React, { useState } from 'react';



const FirewallGuidePage = () => {
  const [loading, setLoading] = useState(false);
  const handleButtonClick = async () => {
    setLoading(true); // 요청 시작 전에 로딩 상태 설정
    try {
      const response = await fetch('http://localhost:8080/ping/isICMPInboundAllowed');
      const data = await response.json();
      console.log('allowed = ', data.allowed);
      if (data.allowed) {
        alert('설정이 완료되었습니다.\n 테스트 페이지로 이동합니다.')
        window.location.href = '/';
      } else {
        // setMessage('방화벽 설정을 다시 확인해주세요.');
        alert('설정이 완료되지 않았습니다.\n 다시 확인해주세요.')
      }
    } catch (error) {
      alert('설정이 완료되지 않았습니다.\n 다시 확인해주세요.')

      // console.error('Error fetching data:', error);
      // setMessage('방화벽 설정을 다시 확인해주세요. ');
    }
  };

  const styles = {

    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px',
    },
    heading: {
      top: '5%',
      color: '#e5e5e5',
      textAlign: 'center'
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      borderRadius: '5px',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    message: {
      marginTop: '20px',
      color: 'red',
      fontSize: '14px',
    },
  };
  const images = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
  ];

  return (
    <div>
      <br/>
      <h1 style={styles.heading}>
        ICMP 패킷이 허용되지 않았습니다.<br/>
        순서대로 설정을 진행해주세요.<br></br></h1>
      <br/>
      <div className="gallery-container">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index + 1}`} className="gallery-image" />
        ))}
      </div>
      {loading &&
      <h1 style={styles.heading}>
        확인중입니다...
      </h1>}
      <button
        style={styles.button}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
        onClick={handleButtonClick}
      >
        방화벽 설정 완료. <br />
        다시 테스트 시도하기.
      </button>
    </div>
    // <div className='a'>
    // <div className='gallery-container'> 
    //   <img src={image1} className='responsive-image' />
    //     <img src={image2} className='responsive-image' />
    //     <img src={image3} className='responsive-image' />
    //     <img src={image4} className='responsive-image' />
    //     <img src={image5} className='responsive-image' />
    //     <img src={image6} className='responsive-image' />
    //     <img src={image7} className='responsive-image' />
    //     <img src={image8} className='responsive-image' />
    //     <img src={image9} className='responsive-image' />
    //     <img src={image10} className='responsive-image' />
    // </div>

    // </div>
    // <div>
    //   <h1 style={styles.heading}>이미지 순서대로 진행해주세요.</h1>
      
      // <button
      //   style={styles.button}
      //   onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
      //   onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
      //   onClick={handleButtonClick}
      // >
      //   방화벽 설정 완료. <br />
      //   다시 테스트 시도하기.
      // </button>
      // {message && <p style={styles.message}>{message}</p>}
    // </div>
  );
};

export default FirewallGuidePage;
