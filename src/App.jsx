import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import MainPage from "./pages/landing_pages/MainPage";

import AboutUs from "./pages/about_pages/AboutUs";
import BlazeToolLandingPage from "./pages/landing_pages/BlazeToolLandingPage";
import BridgeToolLandingPage from "./pages/landing_pages/BridgeToolLandingPage";
import MotionToolLandingPage from "./pages/landing_pages/MotionToolLandingPage";
import TermsAndServices from "./pages/about_pages/TermsAndServices";
import PrivacyPolicy from "./pages/about_pages/PrivacyPolicy";
import AffiliatePartnerPolicy from "./pages/about_pages/AffiliatePartnerPolicy";
import ContactUs from "./pages/about_pages/ContactUs";
import ExplifiedWork from "./pages/work_&_services/ExplifiedWork";

import ExplifiedServices from "./pages/work_&_services/ExplifiedServices";
import ContentMarketingServicePage from "./pages/work_&_services/services_landing_page/ContentMarketingServicePage";
import YoutubeManagementServicePage from "./pages/work_&_services/services_landing_page/YoutubeManagementServicePage";
import MarketResearchAnalysisPage from "./pages/work_&_services/services_landing_page/MarketResearchAnalysisPage";
import SEOServicePage from "./pages/work_&_services/services_landing_page/SEOServicePage";
import AgeingVideoMaker from "./pages/explified_tools/ageing_video_maker/AgeingVideoMaker";
import Subtitling from "./pages/explified_tools/subtitling/Subtitling";
import ImageCartoonizer from "./pages/explified_tools/image_cartoonizer/ImageCartoonizer";
import AIImageStyler from "./pages/explified_tools/ai_image_styler/AIImageStyler";
import AISlideshow from "./pages/explified_tools/ai_slideshow/AISlideShow";
import RemoveBackground from "./pages/explified_tools/background_remover/BackgroundRemover";
import GIFGenerator from "./pages/explified_tools/gif_generator/GIFGenerator";
import Scribbling from "./pages/explified_tools/scribbling/Scribbling";
import Clipper from "./pages/explified_tools/clipper/Clipper";
import ImageToVideoConvertor from "./pages/explified_tools/image_to_video_convertor/ImageToVideoConvertor";
import VideoFromLink from "./pages/explified_tools/video_from_link/VideoFromLink";
import TextToVideo from "./pages/explified_tools/text_to_video/TextToVideo";
import TextToImage from "./pages/explified_tools/text_to_image/TextToImage";
import Dashboard from "./pages/dashboard/Dashboard";
import Publish from "./pages/publish_page/Publish";
import AllChannels from "./pages/publish_page/AllChannels";
import ConnectToFacebook from "./pages/publish_page/ConnectToFacebook";
import ConnectToInstagram from "./pages/publish_page/ConnectToInstagram";
import ConnectToTwitter from "./pages/publish_page/ConnectToTwitter";
import SignupPage from "./pages/auth/SignupPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/web" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndServices />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/affliate-policy" element={<AffiliatePartnerPolicy />} />
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

          {/* publish dashboard */}
          <Route path="/publish" element={<Publish />}>
            <Route index element={<AllChannels />} />
            <Route
              path="/publish/connect-to-facebook"
              element={<ConnectToFacebook />}
            />
            <Route
              path="/publish/connect-to-instagram"
              element={<ConnectToInstagram />}
            />
            <Route
              path="/publish/connect-to-twitter"
              element={<ConnectToTwitter />}
            />
          </Route>
          <Route path="/" element={<Dashboard />} />

          {/* Tools Page */}
          <Route path="/clipper" element={<Clipper />} />
          <Route path="/subtitling" element={<Subtitling />} />
          <Route path="/video-generator" element={<VideoFromLink />} />
          <Route path="/gif-generator" element={<GIFGenerator />} />
          <Route path="/scribble" element={<Scribbling />} />
          <Route path="/remove-bg" element={<RemoveBackground />} />
          <Route path="/image-cartoonizer" element={<ImageCartoonizer />} />
          <Route path="/image-to-video" element={<ImageToVideoConvertor />} />
          <Route path="/text-to-video" element={<TextToVideo />} />
          <Route path="/text-to-image" element={<TextToImage />} />
          <Route path="/ai-image-styler" element={<AIImageStyler />} />
          <Route path="/slideshow" element={<AISlideshow />} />
          <Route path="/ageing_ai" element={<AgeingVideoMaker />} />

          {/* Landing Page */}
          {/* <Route path="/clipper-landing" element={<ClipperLandingPage />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
