import '../App.css';
import TopBar from "../components/TopBar";
import { useLocation } from "react-router-dom";



export default function MatchingWaiting() {

  // 이전 페이지에서 전달된 state 값 가져오기
  const location = useLocation();
  const { departure, arrival } = location.state || {}; // fallback 처리도 해줌

  return (
    <div className="w-[390px] h-[844px] mx-auto bg-white text-center"
         style={{ border: '2px solid #7FA6F8' }}>

        {/* 상단바 */} 
      <div>
        <TopBar/>
      </div>

      <div className="pt-28">
        {/* 제목 */}
        <h1 className="text-3xl font-bold text-blue-700 mb-10">매칭중</h1>

        {/* 출발지 & 목적지 카드 */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-sm text-gray-700 mr-2">출발지</div>
          <img src="/Arrow 1.svg" alt="화살표" className="w-[114px] h-[20px] mx-4" />
          <div className="text-sm text-gray-700 ml-2">목적지</div>
        </div>

        <div className="flex items-center justify-center mb-6 space-x-11">

        {/* 출발지 카드 */}
      <div
      className="w-[145px] h-[182px] rounded-xl shadow-md"
      style={{ border: '2px solid #7FA6F8' }}
      >{departure || "출발지 없음"}</div>

        {/* 목적지 카드 */}
      <div
      className="w-[145px] h-[182px] rounded-xl shadow-md"
      style={{ border: '2px solid #7FA6F8' }}
      >{arrival || "목적지 없음"}</div>
      </div>

        {/* 매칭 취소 버튼 */}
        <div className="pt-28">
          <button className="px-6 py-2 border rounded-xl text-blue-700 hover:bg-blue-50 transition shadow-md"
          style={{ border: '2px solid #7FA6F8' }}>
            매칭 취소
          </button>
        </div>
      </div>
    </div>
  );
}