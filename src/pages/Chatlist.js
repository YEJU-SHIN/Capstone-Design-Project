import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';

export default function ChatList({ senderId }) {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
     // 채팅방 목록 가져오기
    const fetchChatRooms = () => {
      fetch(`http://localhost:8000/api/chat-rooms/?user_id=${senderId}`)
        .then(res => res.json())
        .then(data => setChatRooms(data))
        .catch(err => console.error("채팅방 불러오기 실패", err));
    };

    // 컴포넌트 마운트 시 즉시 한 번 호출
    fetchChatRooms();

    // 이후 5초마다 갱신
    const interval = setInterval(() => {
      fetchChatRooms();
    }, 5000); // 5초

    // 컴포넌트 언마운트 시 인터벌 제거
    return () => clearInterval(interval);
  }, [senderId]);

  return (
    <div className="w-[390px] h-[844px] mx-auto bg-white" style={{ border: '2px solid #7FA6F8' }}>
      <TopBar />

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">채팅 목록</h2>

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
                  {new Date(room.lastMessageTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm text-gray-600 truncate">
                {room.lastMessage}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}