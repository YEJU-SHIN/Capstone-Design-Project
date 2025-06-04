import TopBar from "../components/TopBar";
import '../App.css';
import MatchingForm from "../components/MatchingForm";
import PageLinkButton from "../components/PageLinkButton";


function Home() {
    return(
      <div className="w-[390px] h-[844px] mx-auto bg-white text-center"
         style={{ border: '2px solid #7FA6F8' }}>
        <div>
          <TopBar />
          <div className="home-banner flex items-center justify-center bg-white">
            <img
                src="home_banner.svg"
                alt="홈화면 배너"
                className="w-full h-[180px] object-cover"
            />     
          </div>
          <div>
            <MatchingForm />
          </div>
          <div className="flex gap-16 justify-center mt-1">
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
       </div>
    );
}

export default Home;