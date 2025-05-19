import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectBox from './SelectBox';
import TimeTableBox from './TimeTableBox';

function MatchingForm() {
  const [schoolType, setSchoolType] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [selectedTime, setSelectedTime] = useState(""); // 시간 상태 추가
  const [departureOptions, setDepartureOptions] = useState([]);
  const [arrivalOptions, setArrivalOptions] = useState([]);

  const navigate = useNavigate();

  const handleSchoolTypeChange = (e) => {
    const selected = e.target.value;
    setSchoolType(selected);

    if (selected === "등교") {
      setDepartureOptions(["남춘천역", "춘천역"]);
      setArrivalOptions(["정문", "도서관"]);
    } else if (selected === "하교") {
      setDepartureOptions(["정문", "도서관"]);
      setArrivalOptions(["남춘천역", "춘천역"]);
    } else {
      setDepartureOptions([]);
      setArrivalOptions([]);
    }
  };

  const handleMatchSubmitTest = () =>{ //페이지 이동 테스트 코드드
    navigate("/matchingwaiting");
  };

  const handleMatchSubmit = async () => {
    const data = {
      schoolType,
      departure,
      arrival,
      time: selectedTime, // 선택한 시간도 포함해서 백엔드로 전송
    };

    try {
      const response = await fetch('http://localhost:3001/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        navigate("/matchingwaiting");
      } else {
        alert("매칭 요청 실패");
      }
    } catch (error) {
      console.error("매칭 요청 중 오류:", error);
      alert("서버 오류 발생");
    }
  };

  return (
      <div className="flex flex-col items-center mt-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-md border border-blue-200 p-4 w-44 space-y-4">
            <SelectBox
              label="등교/하교 선택"
              options={["등교", "하교"]}
              onChange={handleSchoolTypeChange}
            />
            <SelectBox
              label="출발지 선택"
              options={departureOptions}
              onChange={(e) => setDeparture(e.target.value)}
            />
            <SelectBox
              label="도착지 선택"
              options={arrivalOptions}
              onChange={(e) => setArrival(e.target.value)}
            />
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-blue-200 p-4 w-44">
            <TimeTableBox onTimeChange={setSelectedTime} />
          </div>
        </div>
        <div className="mb-10 w-full flex justify-center">
          <button 
            onClick={handleMatchSubmitTest}
            className="w-44 h-12 bg-white border border-blue-300 rounded-xl text-blue-700 text-xl shadow-md hover:bg-blue-50 transition">
            매칭
          </button>
        </div>
      </div>
    );
}

export default MatchingForm;

