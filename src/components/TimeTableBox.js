import React, { useEffect, useState } from "react";
import SelectBox from "./SelectBox";

// 매핑 테이블 정의
// schoolType(등교/하교) 값을 depArrFlag 숫자 값으로 매핑
const schoolTypeMap = {
  "등교": 1,
  "하교": 0
};

// 경춘선/ITX를 숫자값으로 매핑
const transitTypeMap = {
  "경춘선": 0,
  "ITX": 1
};

// 학교 내부 위치를 숫자 값으로 매핑
const locationMap = {
  "정문": 0,
  "백록관": 1,
  "기숙사(새롬관 CU)": 2,
  "중앙도서관": 3,
  "미래도서관": 4,
  "동문": 5,
  "후문": 6
};

// 시간표 선택 컴포넌트
function TimeTableBox({ schoolType, departure, arrival, onTimeChange }) {
  // 시간표 옵션 상태
  const [timeOptions, setTimeOptions] = useState([]);
  // 로딩 여부 상태
  const [loading, setLoading] = useState(false);
  // 에러 메시지 상태
  const [error, setError] = useState(null);

  // schoolType, departure, arrival 값이 변경될 때마다 실행됨
  useEffect(() => {
    const fetchTimeTable = async () => {
      // 세 가지 값 중 하나라도 없으면 시간표를 불러오지 않음
      if (!schoolType || !departure || !arrival) {
        setTimeOptions([]);
        return;
      }

      //등교면 depArrFlag = 1, 하교면 0
      const depArrFlag = schoolTypeMap[schoolType];
      const isDepartureTransit = schoolType === "등교";
      const isArrivalTransit = schoolType === "하교";

      // 출발지 ID: 등교면 transitTypeMap, 하교면 locationMap에서 가져옴
      const departureId = isDepartureTransit
        ? transitTypeMap[departure]
        : locationMap[departure];

      // 도착지 ID: 하교면 transitTypeMap, 등교면 locationMap에서 가져옴
      const arrivalId = isArrivalTransit
        ? transitTypeMap[arrival]
        : locationMap[arrival];

      try {
        setLoading(true);  // 로딩 시작
        setError(null);    // 이전 에러 초기화

        // 백엔드 서버에 GET 요청 → /timetable?schoolType=등교&departure=...&arrival=...
        const response = await fetch(
          `http://localhost:3001/timetable?schoolType=${depArrFlag}&departure=${departureId}&arrival=${arrivalId}`
        );
        const data = await response.json();

        // 응답에서 시간표 배열 추출 (예: { times: ["08:30", "09:00", ...] })
        setTimeOptions(data.times || []);
      } catch (err) {
        // 에러 발생 시 에러 메시지 설정
        setError("시간표 불러오기 실패");
        setTimeOptions([]);
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchTimeTable(); // 함수 호출
  }, [schoolType, departure, arrival]); // 의존성 배열 → 이 값들 바뀔 때마다 실행됨

  // 로딩 중일 때 화면에 표시
  if (loading) return <p>시간표 불러오는 중...</p>;

  // 에러 발생 시 화면에 표시
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // SelectBox 컴포넌트를 렌더링
  return (
    <SelectBox
      label="시간표 선택"
      options={timeOptions} // 시간표 옵션 전달
      onChange={(e) => onTimeChange(e.target.value)} // 부모로 선택된 시간 전달
    />
  );
}

export default TimeTableBox;

