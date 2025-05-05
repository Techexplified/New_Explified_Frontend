import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import MainPage from "./pages/landing_pages/MainPage";
import { Provider } from "react-redux";
import { store } from "./utils/store";
import AboutUs from "./pages/about_pages/AboutUs";
import BlazeToolLandingPage from "./pages/landing_pages/BlazeToolLandingPage";
import BridgeToolLandingPage from "./pages/landing_pages/BridgeToolLandingPage";
import MotionToolLandingPage from "./pages/landing_pages/MotionToolLandingPage";
import TermsAndServices from "./pages/about_pages/TermsAndServices";
import PrivacyPolicy from "./pages/about_pages/PrivacyPolicy";
import AffiliatePartnerPolicy from "./pages/about_pages/AffiliatePartnerPolicy";
import ContactUs from "./pages/about_pages/ContactUs";
import ExplifiedWork from "./pages/work_&_services/ExplifiedWork";
import ExplifiedTools from "./pages/explified_tools/ExplifiedTools";
import ExplifiedServices from "./pages/work_&_services/ExplifiedServices";
import ContentMarketingServicePage from "./pages/work_&_services/services_landing_page/ContentMarketingServicePage";
import YoutubeManagementServicePage from "./pages/work_&_services/services_landing_page/YoutubeManagementServicePage";
import MarketResearchAnalysisPage from "./pages/work_&_services/services_landing_page/MarketResearchAnalysisPage";
import SEOServicePage from "./pages/work_&_services/services_landing_page/SEOServicePage";


function App() {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/web" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndServices />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route
              path="/affliate-policy"
              element={<AffiliatePartnerPolicy />}
            />
            <Route path="/solutions" element={<ExplifiedServices />} />
            <Route path="/work" element={<ExplifiedWork />} />

            <Route path="/blaze" element={<BlazeToolLandingPage />} />
            <Route path="/bridge" element={<BridgeToolLandingPage />} />
            <Route path="/motion" element={<MotionToolLandingPage />} />

            {/* Services */}
            <Route
              path="/content-marketing-service"
              element={<ContentMarketingServicePage />}
            />
            <Route
              path="/youtube-management-service"
              element={<YoutubeManagementServicePage />}
            />
            <Route
              path="/market-research-analysis-service"
              element={<MarketResearchAnalysisPage />}
            />
            <Route path="/seo-and-smo-service" element={<SEOServicePage />} />

            <Route path="/" element={<ExplifiedTools />} />

            {/* Tools Page */}
            {/* <Route path="/clipper" element={<Clipper />} /> */}
            {/* <Route path="/subtitling" element={<Subtitling />} />
            <Route path="/video-generator" element={<VideoFromLink />} />
            <Route path="/gif-generator" element={<GIFGenerator />} />
            <Route path="/scribble" element={<Scribbling />} />
            <Route path="/remove-bg" element={<RemoveBackground />} />
            <Route
              path="/image-cartoonizer"
              element={<ImageCartoonizer />}
            /> */}
            {/* <Route path="/image-to-video" element={<ImageToVideoAI />} />
            <Route path="/text-to-video" element={<TextToVideo />} />
            <Route path="/ai-image-styler" element={<AIImageStyler />} />
            <Route path="/slideshow" element={<AISlideshow />} />
            <Route path="/ageing_ai" element={<AgeingVideoMaker />} /> */}

            {/* Landing Page */}
            {/* <Route path="/clipper-landing" element={<ClipperLandingPage />} /> */}
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
