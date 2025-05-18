import TopBar from "../components/TopBar";
import '../App.css';
import MatchingForm from "../components/MatchingForm";
import PageLinkButton from "../components/PageLinkButton";


function Home() {
    return(
       <div>
         <TopBar />
         <div className="home-banner flex items-center justify-center bg-gray-100">
           <img
               src=""
               alt="홈화면 배너"
               className="w-full h-[180px] object-cover"
           />     
         </div>
         <div>
           <MatchingForm />
         </div>
         <div className="flex gap-16 justify-center mt-12">
            <PageLinkButton 
              label="채팅" to="/chat" 
              className="w-24 h-24 rounded-full border border-blue-400 text-blue-700 shadow-md text-lg hover:bg-blue-50 transition"
            />
            <PageLinkButton 
              label="신고" to="/report" 
              className="w-24 h-24 rounded-full border border-blue-400 text-blue-700 shadow-md text-lg hover:bg-blue-50 transition"
            />
         </div>


        


       </div>
    );
}

export default Home;