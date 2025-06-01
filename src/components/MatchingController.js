import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MatchingWaiting from "./MatchingWaiting";

// 매칭 상태를 관리하고, 매칭 대기 페이지로 필요한 props를 전달하는 컨트롤러 컴포넌트
export default function MatchingController() {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const location = useLocation(); // 이전 페이지에서 전달된 state 정보 접근

  // state에서 roomName, userId, departure, arrival 정보를 추출
  const { roomName, userId, departure, arrival } = location.state || {};

  return (
    // MatchingWaiting 컴포넌트에 필요한 데이터를 props로 전달
    <MatchingWaiting
      roomName={roomName}
      userId={userId}
      departure={departure}
      arrival={arrival}
    />
  );
}