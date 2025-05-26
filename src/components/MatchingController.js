import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MatchingWaiting from "./MatchingWaiting";

export default function MatchingController() {
  const navigate = useNavigate();
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("http://localhost:3001/check-matching-status", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (data.status === "matched") {
          clearInterval(interval);
          alert("매칭이 완료되었습니다!");
          navigate("/chat"); // chatroom으로 이동
        }
      } catch (error) {
        console.error("매칭 상태 확인 실패:", error);
      }
    }, 3000); // 3초마다 polling

    return () => clearInterval(interval);
  }, [navigate]);

  return <MatchingWaiting />;
}