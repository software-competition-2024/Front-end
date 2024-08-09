import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [response, setResponse] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

      // 네이버 클라우드 OCR API 호출
      const apiUrl = 'https://0k79d5u57m.apigw.ntruss.com/custom/v1/32942/47df2c2257a32e0e122c289df9fd459772e2c9f523358fa32538d9748db50757/infer';
      const secretKey = 'eWdXa3RpRm9KaWhHZldscmNLS05PUlp2SUZ4ZGF6S2Q=';

      const headers = {
        'Content-Type': 'application/json'
      };

      const body = {
        "version": "V1",
        "requestId": "test-request",
        "timestamp": Date.now(),
        "lang": "ko",
        "images": [
          {
            "format": "jpg",
            "name": "test 1",
            "data": base64String
          }
        ]
      };

      try {
        const ocrResponse = await axios.post(apiUrl, body, { headers, auth: { username: secretKey, password: '' } });
        const data = ocrResponse.data;

        // 응답 데이터에서 필요한 정보 추출
        const image = data.images[0];
        const medicineName = image.fields.find(field => field.name === '약품명').inferText;
        const precautions = image.fields.find(field => field.name === '복약안내').inferText;
        const prescriptionDate = image.fields.find(field => field.name === '조제일자').inferText.split(': ')[1];

        // expiration_date를 현재 날짜로부터 1년 후로 설정
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        // Spring Boot API로 데이터 전송
        const springBootPayload = {
          medicineName: medicineName,
          precautions: precautions,
          prescriptionDate: prescriptionDate,
          expirationDate: expirationDate.toISOString().split('T')[0],
          userEmail: userEmail,
          pushNotification: true,
          dosageNotification: false
        };

        const springBootResponse = await axios.post('http://localhost:8080/api/pst-medicines', springBootPayload);
        setResponse(springBootResponse.data);
      } catch (error) {
        console.error('Error processing the request:', error);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1>Upload Prescription</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <input type="email" placeholder="Enter your email" value={userEmail} onChange={handleEmailChange} required />
        <button type="submit">Upload</button>
      </form>
      {response && (
        <div>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
