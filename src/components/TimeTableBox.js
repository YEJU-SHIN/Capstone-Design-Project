import React, { useEffect, useState } from "react";

// 출발/도착 종류 매핑
const schoolTypeMap = { "등교": 1, "하교": 0 };
const transitTypeMap = { "경춘선": 0, "ITX": 1 };
const locationMap = {
  "정문": 0, "백록관": 1, "기숙사(새롬관 CU)": 2,
  "중앙도서관": 3, "미래도서관": 4, "동문": 5, "후문": 6
};

// 문자열 배열을 ID 배열로 변환하는 함수
const reverseMap = (arr, map) => arr.map(name => map[name]);

/**
 * TimeTableBox 컴포넌트
 * - 출발지, 도착지, 등교/하교 유형에 따라 시간표 데이터를 불러와 선택할 수 있게 함
 * 
 * props:
 * - schoolType: "등교" 또는 "하교"
 * - departureList: 출발지 목록 (문자열 배열)
 * - arrivalList: 도착지 목록 (문자열 배열)
 * - onTimeChange: 선택한 시간 변경 시 호출되는 콜백 함수
 */
function TimeTableBox({ schoolType, departureList, arrivalList, onTimeChange, userId }) {
  const [timeOptions, setTimeOptions] = useState([]); // 선택 가능한 시간 목록
  const [loading, setLoading] = useState(false);      // 로딩 상태
  const [error, setError] = useState(null);           // 에러 메시지

  // schoolType, departureList, arrivalList가 변경될 때마다 시간표 불러오기
  useEffect(() => {
    const fetchTimeTable = async () => {
      // 필수 정보가 없으면 요청하지 않음
      if (!schoolType || departureList.length === 0 || arrivalList.length === 0) {
        setTimeOptions([]);
        return;
      }

      const depArrFlag = schoolTypeMap[schoolType]; // schoolType을 숫자로 변환

      // 등교 시 출발지는 교통수단, 하교 시 도착지는 교통수단으로 매핑
      const isDepartureTransit = schoolType === "등교";
      const isArrivalTransit = schoolType === "하교";

      const departureIds = reverseMap(departureList, isDepartureTransit ? transitTypeMap : locationMap);
      const arrivalIds = reverseMap(arrivalList, isArrivalTransit ? transitTypeMap : locationMap);

      try {
        setLoading(true);  // 로딩 시작
        setError(null);    // 이전 에러 초기화

        // URL 파라미터 구성
        const params = new URLSearchParams({
          dep_arr_flag: depArrFlag,
          departures: departureIds.join(","),
          arrivals: arrivalIds.join(","),
          user_id: userId
        });

        // 백엔드에서 시간표 요청
        const response = await fetch(`http://localhost:8000/main/timeTable?${params}`);
        const data = await response.json(); // 예시: { "ITX": [...], "경춘선": [...] }

        // 시간표 데이터를 형태 변환 
        const merged = [];
        Object.entries(data).forEach(([type, times]) => {
          times.forEach(t => {
            merged.push({
              id: t.timetable_id,
              label: `${type} - ${t.transit_time}`
            });
          });
        });

        setTimeOptions(merged); // 상태 업데이트
      } catch (err) {
        setError("시간표 불러오기 실패"); // 에러 메시지 설정
        setTimeOptions([]);             // 시간표 초기화
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchTimeTable();
  }, [schoolType, departureList, arrivalList, userId]); // 의존성 배열

  // 로딩 또는 에러 상태 처리
  if (loading) return <p>시간표 불러오는 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <label className="font-semibold mb-1 block">시간표 선택</label>
      <select
        onChange={(e) => onTimeChange(e.target.value)} // 선택된 시간 전달
        className="w-full border rounded p-2"
      >
        <option value="">-- 시간 선택 --</option>
        {timeOptions.map((t, i) => (
          <option key={i} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TimeTableBox;