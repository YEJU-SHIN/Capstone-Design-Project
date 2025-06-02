import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';


export default function ChatList({ senderId }) {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();
  const wsRef = useRef(null); // WebSocket 인스턴스를 저장

  // 서버에서 채팅방 목록을 가져오는 함수
  const fetchChatRooms = () => {
    fetch(`http://localhost:8000/api/chat-rooms/?user_id=${senderId}`)
      .then(res => res.json())
      .then(data => setChatRooms(data))
      .catch(err => console.error("채팅방 불러오기 실패", err));
  };

  useEffect(() => {
    // 초기 로딩 시 채팅방 목록 가져오기
    fetchChatRooms();

    // WebSocket 연결 생성
    const ws = new WebSocket(`ws://localhost:8000/ws/chatlist/${senderId}/`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('ChatList WebSocket 연결됨');
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'new_message') {
        fetchChatRooms(); // 새 메시지 도착 시 목록 갱신
      }
    };

    ws.onerror = (e) => {
      console.error('WebSocket 오류', e);
    };

    ws.onclose = () => {
      console.log('ChatList WebSocket 연결 종료됨');
    };

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      ws.close();
    };
  }, [senderId]); // senderId가 변경될 때마다 effect 재실행

  return (
    <div className="w-[390px] h-[844px] mx-auto bg-white" style={{ border: '2px solid #7FA6F8' }}>
      <TopBar />

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">채팅 목록</h2>

        {/* 채팅방이 없을 경우 안내 메시지 */}
        {chatRooms.length === 0 ? (
          <p className="text-gray-500">진행 중인 채팅이 없습니다.</p>
        ) : (
          chatRooms.map((room) => (
            <div
              key={room.roomId}
              className="border-b py-3 cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/chatroom/${room.roomId}`)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{room.partnerName}</span>
                <span className="text-xs text-gray-400">
                  {/* 마지막 메시지 시간 표시 */}
                  {new Date(room.lastMessageTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm text-gray-600 truncate">
                {/* 마지막 메시지 내용 요약 */}
                {room.lastMessage}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}