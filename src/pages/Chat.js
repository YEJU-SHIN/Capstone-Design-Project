import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // URL 파라미터와 페이지 이동 훅
import TopBar from '../components/TopBar';


// Chat 컴포넌트 시작
export default function Chat({ senderId, username }) {
  const { roomId } = useParams();              // URL에서 채팅방 ID 가져오기
  const navigate = useNavigate();              // 페이지 이동용
  const [message, setMessage] = useState('');  // 입력 중인 메시지 상태
  const [messages, setMessages] = useState([]); // 전체 메시지 리스트
  const messagesEndRef = useRef(null);         // 스크롤 제어용 ref
  const chatSocketRef = useRef(null);          // WebSocket 인스턴스를 저장할 ref

  // 처음 렌더링될 때 실행되는 useEffect
  useEffect(() => {
    // 백엔드에서 기존 채팅 기록 불러오기
    fetch(`http://localhost:8000/api/chat-history/?room_id=${roomId}`)
      .then(res => res.json())
      .then(data => setMessages(data))         // 기존 메시지 리스트에 저장
      .catch(err => console.error('채팅 기록 오류:', err));

    // WebSocket 연결 생성
    const chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${roomId}/`);
    chatSocketRef.current = chatSocket;        // 연결 인스턴스를 ref에 저장

    // 메시지를 수신했을 때
    chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);         // 수신한 JSON 문자열을 객체로 파싱
      if (data.message && data.sender) {       // message와 sender 필드가 있다면
        setMessages(prev => [...prev, {
          senderId: data.sender,               // sender를 senderId로 매핑
          content: data.message,               // message 본문 저장
        }]);
      }
    };

    // 연결 종료 시 콘솔에 경고 출력
    chatSocket.onclose = () => {
      console.warn('웹소켓 연결 종료');
    };

    // 컴포넌트 언마운트 시 소켓 연결 닫기
    return () => {
      chatSocket.close();
    };
  }, [roomId]); // roomId가 바뀌면 재실행됨

  // 메시지 전송 함수
  const sendMessage = () => {
    if (!message.trim()) return;              // 공백 메시지는 무시
    const chatSocket = chatSocketRef.current;

    // WebSocket이 열려 있으면 메시지 전송
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      chatSocket.send(JSON.stringify({
        message: message,                     // 메시지 본문
        sender: username || senderId          // 보낸 사람 이름 또는 ID
      }));
      setMessage('');                          // 입력창 비우기
    }
  };

  // 나가기 버튼 클릭 시 실행
  const handleLeave = () => {
    const chatSocket = chatSocketRef.current;

    // 연결이 열려 있으면 'leave' 메시지 보내고 닫기
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      chatSocket.send(JSON.stringify({ action: 'leave' }));
      chatSocket.close();
    }

    // 채팅목록 페이지로 이동
    navigate('/chatlist');
  };

  // 메시지 추가될 때마다 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-[390px] h-[844px] mx-auto bg-white" style={{ border: '2px solid #7FA6F8' }}>
      <TopBar />

      {/* 나가기 버튼 */}
      <div className="flex justify-end p-2">
        <button
          onClick={handleLeave} // 누르면 나가기 실행
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
        >
          나가기
        </button>
      </div>

      {/* 메시지 표시 영역 */}
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
        <div ref={messagesEndRef} /> {/* 스크롤 고정용 dummy div */}
      </div>

      {/* 메시지 입력창과 전송 버튼 */}
      <div className="flex p-4 border-t">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)} // 입력값 업데이트
          onKeyDown={e => e.key === 'Enter' && sendMessage()} // 엔터로 전송
          className="flex-1 border rounded-xl px-4 py-2 text-sm"
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={sendMessage} // 클릭 시 메시지 전송
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm"
        >
          전송
        </button>
      </div>
    </div>
  );
}