import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";

export default function ChatList() {
  const navigate = useNavigate();

  // 1) 마운트 시 한 번만 userId 초기화 (state → URL ?user_id= → localStorage 순)
  const [userId, setUserId] = useState("");
  const [chatRoomList, setChatRoomList] = useState([]);
  const [username, setUsername] = useState(""); // 사용자 이름
  const usernameRef = useRef("");

  // 사용자 이름 가져오기
  const fetchUsername = async () => {
    if (!userId) return null;
    try {
      const res = await fetch("http://114.70.124.15:8000/main/getUsername/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (res.ok) {
        const data = await res.json();
        const name = data.username ?? "아무개";
        usernameRef.current = name;
        setUsername(name);
        return name;
      } else {
        console.error("사용자 이름 요청 실패");
        return null;
      }
    } catch (e) {
      console.error("사용자 이름 요청 오류:", e);
      return null;
    }
  };

  // 채팅방 목록 가져오기
  const fetchChatRooms = async (uid) => {
    if (!uid) return;
    try {
      const res = await fetch("http://114.70.124.15:8000/main/getRoomList/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: uid }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatRoomList(data.chatRoomList ?? []);
      } else {
        console.error("채팅방 불러오기 실패");
      }
    } catch (e) {
      console.error("채팅방 목록 요청 오류:", e);
    }
  };

  useEffect(() => {
    setUserId(4);
    fetchChatRooms(userId);  // ← 인자 전달
    fetchUsername();
  }, [userId]); // userId가 준비되면 실행

  // 클릭 핸들러: 방 정보로 /chat 이동
  const enterRoom = (chatRoomId) => {
    const room = chatRoomList.find((r) => {
      const rid = r.chatroomId ?? r.roomId ?? r.id;
      return String(rid) === String(chatRoomId);
    });
    if (!room) return;

    const roomName = room.roomName ?? room.roomName ?? "채팅방";

    navigate("/chat", {
      state: {
        roomName: roomName,
        userId: userId,          // 현재 사용자 id
        username: usernameRef.current || username || "아무개",
      },
    });
  };

  return (
    <div
      className="w-[390px] h-[844px] mx-auto bg-white"
      style={{ border: "2px solid #7FA6F8" }}
    >
      <TopBar />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">채팅 목록</h2>

        {chatRoomList.length === 0 ? (
          <p className="text-gray-500">진행 중인 채팅이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {chatRoomList.map((room) => {
              const chatRoomId = room.chatroomId ?? room.roomId ?? room.id;
              const roomName = room.chatroomName ?? room.roomName ?? "채팅방";
              return (
                <li key={chatRoomId}>
                  <button
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 font-semibold"
                    onClick={() => enterRoom(chatRoomId)}
                    title={roomName}
                  >
                    {roomName}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
// 채팅방 목록이 비어있을 때 "진행 중인 채팅이 없습니다." 메시지 표시