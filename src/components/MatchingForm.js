import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectBox from './SelectBox';
import TimeTableBox from './TimeTableBox';

function MatchingForm() {
  // 상태(state) 선언: 등/하교 선택, 출발지, 도착지, 선택한 시간
  const [schoolType, setSchoolType] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // 출발지와 도착지 드롭다운 옵션 상태
  const [departureOptions, setDepartureOptions] = useState([]);
  const [arrivalOptions, setArrivalOptions] = useState([]);

  // 페이지 이동용 훅 (React Router)
  const navigate = useNavigate();

  // 등교/하교 선택 시 실행되는 함수
  const handleSchoolTypeChange = (e) => {
    const selected = e.target.value;
    setSchoolType(selected);

    // 선택한 값에 따라 출발지와 도착지 옵션 설정
    if (selected === "등교") {
      setDepartureOptions(["남춘천역", "춘천역"]);
      setArrivalOptions(["정문", "도서관"]);
    } else if (selected === "하교") {
      setDepartureOptions(["정문", "도서관"]);
      setArrivalOptions(["남춘천역", "춘천역"]);
    } else {
      // 잘못된 값일 경우 초기화
      setDepartureOptions([]);
      setArrivalOptions([]);
    }

    // 이전에 선택했던 값들 초기화
    setDeparture("");
    setArrival("");
    setSelectedTime("");
  };

  // 매칭 버튼 클릭 시 서버로 POST 요청 보내는 함수
  const handleMatchSubmit = async () => {
    const data = {
      schoolType,
      departure,
      arrival,
      time: selectedTime,
    };

    try {
      const response = await fetch('http://localhost:3001/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // JSON 형식으로 요청 본문 구성
      });

      // 요청 성공 시 매칭 대기 페이지로 이동
      if (response.ok) {
        navigate("/matchwaiting");
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
      {/* 드롭다운 섹션: 등/하교, 출발지, 도착지 */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md border border-blue-200 p-4 w-72 space-y-4">
          {/* 등교/하교 선택 박스 */}
          <SelectBox
            label="등교/하교 선택"
            options={["등교", "하교"]}
            onChange={handleSchoolTypeChange}
          />
          {/* 출발지 선택 박스 */}
          <SelectBox
            label="출발지 선택"
            options={departureOptions}
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          />
          {/* 도착지 선택 박스 */}
          <SelectBox
            label="도착지 선택"
            options={arrivalOptions}
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
          />
        </div>

        {/* 시간표 선택 컴포넌트 */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-200 p-4 w-72">
          <TimeTableBox
            schoolType={schoolType}
            departure={departure}
            arrival={arrival}
            onTimeChange={setSelectedTime}
          />
        </div>
      </div>

      {/* 매칭 버튼 */}
      <div className="mb-10 w-full flex justify-center">
        <button
          onClick={handleMatchSubmit}
          className="w-72 h-14 bg-white border border-blue-300 rounded-xl text-blue-700 text-2xl shadow-md hover:bg-blue-50 transition"
        >
          매칭
        </button>
      </div>
    </div>
  );
}

export default MatchingForm;


