import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import PageLinkButton from '../components/PageLinkButton';

const socket = io('http://localhost:8000'); // 백엔드 주소로 바꾸기

export default function Chat({ senderId }) {
  const { roomId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 채팅 기록 불러오기
    fetch(`http://localhost:8000/api/chat-history/?room_id=${roomId}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('채팅 기록 오류:', err));

    // 소켓 연결 및 메시지 수신
    socket.emit('joinRoom', { roomId });

    socket.on('receiveMessage', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.emit('leaveRoom', { roomId });
      socket.off('receiveMessage');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      roomId,
      senderId,
      content: message,
      timestamp: new Date().toISOString()
    };

    socket.emit('sendMessage', msgData);
    setMessages(prev => [...prev, msgData]);
    setMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-[390px] h-[844px] mx-auto bg-white"
         style={{ border: '2px solid #7FA6F8' }}>
      <TopBar />

      
      <div className="flex justify-end p-2"> 
        <PageLinkButton
          label="나가기"
          to="/Chatlist"
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
        />
      </div>

      <div className="p-4 h-[700px] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`rounded-xl px-4 py-2 text-sm ${msg.senderId === senderId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex p-4 border-t">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded-xl px-4 py-2 text-sm"
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm"
        >
          전송
        </button>
      </div>
    </div>
  );
}