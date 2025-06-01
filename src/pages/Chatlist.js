import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import io from 'socket.io-client';

const socket = io('http://localhost:8000'); // 서버 주소 맞게 수정

export default function ChatList({ senderId }) {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  // 채팅방 리스트를 서버에서 불러오는 함수
  useEffect(() => {
  const fetchChatRooms = () => {
    fetch(`http://localhost:8000/api/chat-rooms/?user_id=${senderId}`)
      .then(res => res.json())
      .then(data => setChatRooms(data)) // 받아온 데이터를 상태에 저장
      .catch(err => console.error("채팅방 불러오기 실패", err));
  };

  // 컴포넌트가 마운트 될 때 채팅방 목록을 처음 불러옴
  fetchChatRooms();

  // 소켓 서버에 현재 사용자가 채팅 목록에 참여함을 알림
  socket.emit('joinChatList', { userId: senderId });

  // 서버로부터 'newMessage' 이벤트가 오면 채팅방 목록을 다시 불러옴
  socket.on('newMessage', () => {
    fetchChatRooms();
  });

  // 컴포넌트 언마운트 시 소켓 이벤트 리스너 정리
  return () => {
    socket.off('newMessage');
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