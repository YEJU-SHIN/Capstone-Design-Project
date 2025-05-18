import '../App.css';
import { useState } from "react";
import PageLinkButton from "../components/PageLinkButton";
import { FaUser, FaBars } from "react-icons/fa";





function TopBar() {
    
    const [menuOpen, setMenuOpen] = useState(false);
    
    return(
        <div className="flex justify-between items-center px-4 py-2 shadow border-b border-blue-100">
            <div className="flex items-center space-x-2">
               <PageLinkButton label={<HomeIcon />} to="/" />
               <h4 className="text-blue-800 text-lg font-semibold">캠퍼스타</h4>
            </div>

            <div className="relative flex items-center space-x-4 text-blue-400">
               <PageLinkButton label={<FaUser className="w-5 h-5" />} to="/mypage" />
               <button onClick={() => setMenuOpen(!menuOpen)}>
                 <FaBars className="w-6 h-6" />
               </button>

               {/* 드롭다운 메뉴 */}
               {menuOpen && (
                    <div className="absolute right-0 top-10 w-40 bg-white border rounded shadow-md py-2 z-50">
                        <button className="w-full px-4 py-2 hover:bg-blue-50 text-left text-sm">설정</button>
                        <button className="w-full px-4 py-2 hover:bg-blue-50 text-left text-sm">로그아웃</button>
                    </div>
               )}    
            </div>    
                

        </div>
    );
}

function HomeIcon() {
  return (
    <svg
      className="w-6 h-6 text-blue-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 001 1h3m-10 0h4" />
    </svg>
  );
}




export default TopBar;