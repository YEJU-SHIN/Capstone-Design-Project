
import React, { useEffect, useState } from "react";
import SelectBox from "./SelectBox";

function TimeTableBox({ onTimeChange }) {
  const [timeOptions, setTimeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        setLoading(true);
        // 실제 API 요청 코드
        // const response = await fetch('https://api.example.com/timetable');
        // const data = await response.json();

        // 예시 데이터
        const data = ["08:00", "09:30", "11:00", "13:00"];
        setTimeOptions(data);
      } catch (err) {
        setError("시간표 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeTable();
  }, []);

  if (loading) return <p>시간표 불러오는 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <SelectBox
      label="시간표 선택"
      options={timeOptions}
      //onChange={(e) => console.log("선택한 시간:", e.target.value)}
      onChange={(e) => onTimeChange(e.target.value)}
    />
  );
}

export default TimeTableBox;
