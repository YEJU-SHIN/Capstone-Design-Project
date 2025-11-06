import React, { useEffect, useRef, useState } from 'react';
import { useLocation , useNavigate } from 'react-router-dom'; // URL 파라미터와 페이지 이동 훅
import TopBar from '../components/TopBar';


// Chat 컴포넌트 시작
export default function Chat() {
  //const { roomName } = useParams();              // URL에서 채팅방 ID 가져오기
  const location = useLocation();
  const navigate = useNavigate();              // 페이지 이동용

  const { roomName, userId , username} = location.state || {};
  const senderId = Number(userId) || 0;
  const senderUsername = username || '아무개';

  const [message, setMessage] = useState('');  // 입력 중인 메시지 상태
  const [messages, setMessages] = useState([]); // 전체 메시지 리스트
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const messagesEndRef = useRef(null);         // 스크롤 제어용 ref
  const chatSocketRef = useRef(null);          // WebSocket 인스턴스를 저장할 ref

  // 처음 렌더링될 때 실행되는 useEffect
  useEffect(() => {

    // useEffect 내부에서 사용할 비동기 함수를 선언합니다.
    const initializeChat = async () => {
      setIsLoading(true); // 데이터 로딩 시작
      const initialMessages = await fetchMessages(roomName); //분리된 함수를 호출해서 과거 메시지 기록을 가져오기
      setMessages(initialMessages);
      setIsLoading(false); // 데이터 로딩이 완료

      //과거 기록을 모두 불러온 후에 웹소켓 연결
      const chatSocket = new WebSocket(`ws://192.168.0.57:8000/ws/chat/${roomName}/?userId=${senderId}&username=${senderUsername}`);
      chatSocketRef.current = chatSocket;

      // 메시지를 수신했을 때의 로직
      chatSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if ('message' in data) {
          setMessages(prev => [...prev, {
            senderId: data.senderId ?? null,
            senderUsername: data.senderUsername ?? '아무개',
            content: data.message,
          }]);
        }
      };

      // 연결 종료 시 콘솔에 경고 출력
      chatSocket.onclose = () => {
        console.warn('웹소켓 연결 종료');
      };
    };

    initializeChat(); // 선언한 비동기 함수를 실행

    return () => {
      // 컴포넌트가 언마운트될 때 chatSocketRef에 연결이 있으면 닫기
      if (chatSocketRef.current) {
        chatSocketRef.current.close();
      }
    };
  }, [roomName, senderId, senderUsername]); // 의존성 배열은 그대로 유지
  // 메시지 전송 함수
  const sendMessage = () => {
    if (!message.trim()) return;              // 공백 메시지는 무시
    const chatSocket = chatSocketRef.current;

    // WebSocket이 열려 있으면 메시지 전송
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      chatSocket.send(JSON.stringify({
        message: message,                     // 메시지 본문
        senderId: Number(senderId),         // 보낸 사람 이름
        senderUsername : senderUsername,         // 보낸 사람 이름
      }));
      setMessage('');                          // 입력창 비우기
    }
  };

  // 나가기 버튼 클릭 시 실행
  const handleLeave = () => {
    if (window.confirm("채팅방을 나오겠습니까? 확인을 누르시면 매칭이 취소됩니다.")) {
      // '확인'을 누른 경우에만 실행
      const chatSocket = chatSocketRef.current;

      // 연결이 열려 있으면 'leave' 메시지 보내고 닫기
      if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify({ action: 'leave', senderId: Number(senderId), senderUsername : senderUsername }));
        chatSocket.close();
      }

      // 채팅목록 페이지로 이동
      navigate('/chatlist');
    }
    // '취소'를 누르면 아무 일도 일어나지 않습니다.
  };

  async function fetchMessages(roomName) {
    try {
      const res = await fetch('http://192.168.0.57:8000/main/getMessagesRecord/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_name: roomName }),
      });

      if (!res.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }

      const data = await res.json();
      return data.messageList; // 성공시 메시지 데이터를 반환

    } catch (err) {
      console.error('채팅 기록을 불러오는 중 오류 발생:', err);
      return []; // 실패하면 빈 배열을 반환
    }
  }

  // 메시지 추가될 때마다 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <div className="w-[390px] h-[844px] mx-auto bg-white flex flex-col" style={{ border: '2px solid #7FA6F8' }}>
        <TopBar />
        <div className="flex-1 flex justify-center items-center">
          <p>채팅 기록을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[390px] h-[844px] mx-auto bg-white flex flex-col" style={{ border: '2px solid #7FA6F8' }}>
      <TopBar />

      <div className="flex justify-end p-2">
        <button
          onClick={handleLeave}
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
        >
          나가기
        </button>
      </div>

      {/* 메시지 표시 영역 (flex-1 추가로 높이 자동 조절) */}
      <div className="p-4 overflow-y-auto flex-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`rounded-xl px-4 py-2 text-sm max-w-xs break-words ${msg.senderId === senderId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              <strong>{msg.senderUsername}:</strong> {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex p-2 border-t">
        <input
          type="text"
          value={message}s
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