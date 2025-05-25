import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 hook
import TimeTableBox from './TimeTableBox'; // 시간표 선택 컴포넌트
import DropdownCheckbox from './DropdownCheckbox'; // 다중 선택 가능한 드롭다운 컴포넌트

// 등교/하교 타입 매핑
const schoolTypeMap = { "등교": 1, "하교": 0 };

// 교통수단 매핑
const transitTypeMap = { "경춘선": 0, "ITX": 1 };

// 캠퍼스 내 위치 매핑
const locationMap = {
  "정문": 0, "백록관": 1, "기숙사(새롬관 CU)": 2,
  "중앙도서관": 3, "미래도서관": 4, "동문": 5, "후문": 6
};

// 텍스트 배열을 ID 배열로 바꾸는 헬퍼 함수
const reverseMap = (arr, map) => arr.map(name => map[name]);

function MatchingForm() {
  // 상태 변수 선언
  const [schoolType, setSchoolType] = useState(""); // 등교 or 하교
  const [departureOptions, setDepartureOptions] = useState([]); // 출발지 옵션
  const [arrivalOptions, setArrivalOptions] = useState([]); // 도착지 옵션

  const [selectedDepartures, setSelectedDepartures] = useState([]); // 선택된 출발지(확정 전)
  const [selectedArrivals, setSelectedArrivals] = useState([]); // 선택된 도착지(확정 전)
  const [confirmedDepartures, setConfirmedDepartures] = useState([]); // 확정된 출발지
  const [confirmedArrivals, setConfirmedArrivals] = useState([]); // 확정된 도착지

  const [selectedTime, setSelectedTime] = useState(""); // 선택된 시간
  const navigate = useNavigate(); // 페이지 이동 함수

  // 등교/하교 선택 변경 시 호출
  const handleSchoolTypeChange = (e) => {
    const selected = e.target.value;
    setSchoolType(selected); // 등교/하교 상태 설정
    setSelectedDepartures([]); // 기존 출발지 초기화
    setSelectedArrivals([]); // 기존 도착지 초기화
    setConfirmedDepartures([]);
    setConfirmedArrivals([]);
    setSelectedTime("");

    // 등교일 경우: 출발지는 경춘선/ITX, 도착지는 학교 위치
    if (selected === "등교") {
      setDepartureOptions(["경춘선", "ITX"]);
      setArrivalOptions(Object.keys(locationMap));
    }
    // 하교일 경우: 출발지는 학교 위치, 도착지는 경춘선/ITX
    else if (selected === "하교") {
      setDepartureOptions(Object.keys(locationMap));
      setArrivalOptions(["경춘선", "ITX"]);
    } else {
      // 초기화 상태
      setDepartureOptions([]);
      setArrivalOptions([]);
    }
  };

  // 매칭 버튼 클릭 시 서버로 매칭 요청 보내기
  const handleMatchSubmit = async () => {
    // 모든 항목이 선택되었는지 확인
    if (!schoolType || confirmedDepartures.length === 0 || confirmedArrivals.length === 0 || !selectedTime) {
      alert("모든 항목을 선택해주세요.");
      return;
    }

    // 등교/하교에 따라 매핑 설정
    const depArrFlag = schoolTypeMap[schoolType];
    const isDepartureTransit = schoolType === "등교";
    const isArrivalTransit = schoolType === "하교";

    // 텍스트 → ID로 변환
    const departureIds = reverseMap(confirmedDepartures, isDepartureTransit ? transitTypeMap : locationMap);
    const arrivalIds = reverseMap(confirmedArrivals, isArrivalTransit ? transitTypeMap : locationMap);

    const data = {
      dep_arr_flag: depArrFlag,
      departure_ids: departureIds,
      arrival_ids: arrivalIds,
      time: selectedTime
    };

    // 서버로 POST 요청 보내기
    try {
      const response = await fetch('http://localhost:3001/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // 성공 시 대기 화면으로 이동
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
      {/* 좌측: 선택 폼 / 우측: 시간표 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* 왼쪽 박스: 등교/하교, 출발지, 도착지 선택 */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-200 p-4 w-64 space-y-4">
          <div>
            <label className="font-semibold mb-2 block">등교/하교 선택</label>
            <select
              value={schoolType}
              onChange={handleSchoolTypeChange}
              className="w-full border rounded p-2"
            >
              <option value="">선택하세요</option>
              <option value="등교">등교</option>
              <option value="하교">하교</option>
            </select>
          </div>

          {/* 출발지 드롭다운 */}
          <DropdownCheckbox
            label="출발지 선택 (중복 가능)"
            options={departureOptions}
            selectedOptions={selectedDepartures}
            setSelectedOptions={setSelectedDepartures}
            onConfirm={() => setConfirmedDepartures([...selectedDepartures])}
          />

          {/* 도착지 드롭다운 */}
          <DropdownCheckbox
            label="도착지 선택 (중복 가능)"
            options={arrivalOptions}
            selectedOptions={selectedArrivals}
            setSelectedOptions={setSelectedArrivals}
            onConfirm={() => setConfirmedArrivals([...selectedArrivals])}
          />
        </div>

        {/* 오른쪽 박스: 시간표 박스 */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-200 p-4 w-64">
          <TimeTableBox
            schoolType={schoolType}
            departureList={confirmedDepartures}
            arrivalList={confirmedArrivals}
            onTimeChange={setSelectedTime}
          />
        </div>
      </div>

      {/* 매칭 버튼 */}
      <div className="mb-7 w-full flex justify-center">
        <button
          onClick={handleMatchSubmit}
          className="w-44 h-14 bg-white border border-blue-300 rounded-xl text-blue-700 text-2xl shadow-md hover:bg-blue-50 transition"
        >
          매칭
        </button>
      </div>
    </div>
  );
}

export default MatchingForm;