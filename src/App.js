import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from'./pages/Home';
import Chat from './pages/Chat';
//매칭중 페이지로 넘어가는 매칭중 페이지 코드 자리
import Report from './pages/Report';
import MyPage from './pages/MyPage';
import MatchingWaiting from './pages/MatchingWaiting'; // 매칭 대기 컴포넌트 import
import './App.css';

function App() {
  
  return (
 
    
    
    
    <BrowserRouter>
      <Routes>
        <Route path= "/" element={<Home />} />
        <Route path= "/mypage" element={<MyPage />} />

        <Route path="/chat" element={<Chat />} />
        <Route path="/report" element={<Report />} />
        <Route path="/matchingwaiting" element={<MatchingWaiting />} /> {/* 추가됨 */}
      </Routes>
    </BrowserRouter>
    
      
  );
}

export default App;
