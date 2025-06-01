import '../App.css';
import TopBar from "../components/TopBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from 'react';

export default function MatchingWaiting({ roomName, userId }) {
  const location = useLocation(); // 이전 페이지에서 전달된 state 값 받기
  const navigate = useNavigate(); // 페이지 이동 함수
  const { departure, arrival } = location.state || {}; // 출발지와 목적지 정보

  const socketRef = useRef(null); // WebSocket 인스턴스를 저장하기 위한 ref

  // 컴포넌트가 마운트될 때 실행
  useEffect(() => {
    // roomName과 userId가 없으면 실행하지 않음
    if (!roomName || !userId) return;

    // 백엔드 WebSocket 서버에 연결
    const socket = new WebSocket(`ws://localhost:8000/ws/wait/${roomName}/`);
    socketRef.current = socket; // 참조값 저장

    // 서버로부터 메시지를 수신했을 때 실행
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.status === "matched") {
        alert("매칭이 완료되었습니다! 채팅방으로 이동합니다.");
        // 채팅방으로 이동하며 roomName과 userId 전달
        navigate("/chat", {
          state: { roomName, userId }
        });
      }
    };

    // WebSocket 연결 종료 시 콘솔 로그
    socket.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    // 컴포넌트 언마운트 시 소켓 닫기
    return () => {
      socket.close();
    };
  }, [roomName, userId, navigate]);

  // 매칭 취소 버튼 클릭 시 실행되는 함수
  const handleCancel = () => {
    const socket = socketRef.current;
    // 연결된 상태면 cancel 메시지를 서버에 보내고 소켓 닫기
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ action: "cancel" }));
      socket.close();
    }
    alert("매칭이 취소되었습니다.");
    navigate("/"); // 취소 후 메인 페이지로 이동
  };

  return (
    <div className="w-[390px] h-[844px] mx-auto bg-white text-center"
         style={{ border: '2px solid #7FA6F8' }}>

      {/* 상단바 */}
      <div>
        <TopBar />
      </div>

      <div className="pt-28">
        {/* 제목 */}
        <h1 className="text-3xl font-bold text-blue-700 mb-10">매칭중</h1>

        {/* 출발지 & 목적지 텍스트 영역 */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-sm text-gray-700 mr-2">출발지</div>
          <img src="/Arrow 1.svg" alt="화살표" className="w-[114px] h-[20px] mx-4" />
          <div className="text-sm text-gray-700 ml-2">목적지</div>
        </div>

        {/* 출발지와 목적지를 카드 형태로 보여줌 */}
        <div className="flex items-center justify-center mb-6 space-x-11">
          <div className="w-[145px] h-[182px] rounded-xl shadow-md"
               style={{ border: '2px solid #7FA6F8' }}>
            {departure || "출발지 없음"}
          </div>
          <div className="w-[145px] h-[182px] rounded-xl shadow-md"
               style={{ border: '2px solid #7FA6F8' }}>
            {arrival || "목적지 없음"}
          </div>
        </div>

        {/* 매칭 취소 버튼 */}
        <div className="pt-28">
          <button 
            onClick={handleCancel}
            className="px-6 py-2 border rounded-xl text-blue-700 hover:bg-blue-50 transition shadow-md"
            style={{ border: '2px solid #7FA6F8' }}>
            매칭 취소
          </button>
        </div>
      </div>
    </div>
  );
}