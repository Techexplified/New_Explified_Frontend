// file starts here
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import UpdatedDashboard from "./components/UpdatedDashboard";

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
import Publish from "./pages/publish_page/Publish";
import AllChannels from "./pages/publish_page/AllChannels";
import ConnectToFacebook from "./pages/publish_page/ConnectToFacebook";
import ConnectToInstagram from "./pages/publish_page/ConnectToInstagram";
import ConnectToTwitter from "./pages/publish_page/ConnectToTwitter";
import SignupPage from "./pages/auth/SignupPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Discover from "./pages/dashboard/Discover";
import Trending from "./pages/dashboard/Trending";
import Grow from "./pages/grow_page/Grow";
import YoutubeSummarizer from "./pages/explified_tools/youtube_summarizer/YoutubeSummarizer";
import NewDashBoardLayout from "./pages/extensions/NewDashBoardLayout";
import NewDashboard from "./pages/extensions/NewDashboard";
import DeepSearch from "./pages/explified_tools/youtube_summarizer/DeepSearch";

import PDFHome from "./pages/explified_tools/pdf_tools/PDFHome";
import Compress from "./pages/explified_tools/pdf_tools/Compress";
import Merge from "./pages/explified_tools/pdf_tools/Merge";
import Edit from "./pages/explified_tools/pdf_tools/Edit";
import Sign from "./pages/explified_tools/pdf_tools/Sign";
import PdfToAny from "./pages/explified_tools/pdf_tools/PdfToAny";
import PdfToWord from "./pages/explified_tools/pdf_tools/PdfToWord";
import DashBoardLayout from "./components1/DashBoardLayout";
import HomePage from "./components1/HomePage";
import SocialsPage from "./components1/SocialsPage";
import DetailedCard from "./components1/DetailedCard";
import LastPosts from "./components1/Lastposts";
import RecentPosts from "./components1/RecentPosts";
import Favourites from "./components1/Favourites";
import ScheduleDraftPosts from "./components1/ScheduleDraftPosts";
import NewPost from "./components1/NewPost";
import AISubtitler from "./pages/explified_tools/subtitling/AISubtitler";
import SubtitleToolUI from "./pages/explified_tools/subtitling/SubtitleToolUI";
import AITools from "./components1/AITools";
import History from "./components1/History";
import WorkflowDashboard from "./components1/Workflows";
import CreateNewPage from "./components1/CreateNewPage";
import PresentationLandingPage from "./components2/LandingPage";
import CreatePresentation from "./components2/CreatePresentation";
import Integrations from "./components1/Integrations";
import InfluencerProfile from "./components1/InfluencerProfile";

import ImageFilter from "./component3/ImageFilter";
import AiImageStyler from "./component3/AiImageStyler";
import BackgroundChanger from "./component3/BackgroundChanger";
import ImageMerger from "./component3/ImageMerger";
import ImageExpander from "./component3/ImageExpander";
import ImageEditor from "./component3/ImageEditor";

// import BGLayout from "./pages/explified_tools/bgRemoverBlur/BGLayout";

// import Integrations from "./components1/Integrations";
// import InfluencerProfile from "./components1/InfluencerProfile";
import Meme from "./components1/Meme";
import Result from "./components1/Result";
import Zapier from "./components1/Zapier";
import ZapResult from "./components1/ZapResult";
import ZapEnhanced from "./components1/ZapEnhanced";
import Influmark from "./components1/Influmark";

import TextToVideo1 from "./components1/TextToVideo";
import VideoDescription from "./components1/VideoDescription";
import WhatsAppChatbot from "./components1/WhatsAppChatbot";
import YouTubeUpload from "./components1/YoutubeUpload";
import MainWorkflowPage from "./components/subLayoutComponents/workflowPages/MainWorkflowPage";
import Trone from "./components1/Trone";
import ComingSoon from "./reusable_components/ComingSoon";
import MainDashboard from "./components/subLayoutComponents/MainDashboard";
import TextToVideoGenerator from "./components/tools/TextToVideoGenerator";
import AIMemeGenerator from "./pages/explified_tools/video_meme_generator/VideoMemeGenerator";
import ZapierChat from "./zapierComponents/ZapierChat";
import RecommendedWorkflowsPage from "./components/subLayoutComponents/workflowPages/RecommendedWorklowsPage";
import ExistingWorkflowsPage from "./components/subLayoutComponents/workflowPages/ExistingWorkflowPage";
import NewZapier from "./zapierComponents/NewZapier";
import CreateWorkflow from "./components/subLayoutComponents/workflowPages/CreateWorkflow";
import UnfinishedWorkflowsPage from "./components/subLayoutComponents/workflowPages/UnfinishedWorkflowsPage";
import AutomationWorkflow from "./linkedin/AutomationWorkflow";
import SchedulerForm from "./linkedin/LinkedinPost";
import { useEffect } from "react";
import LurphLanding from "./components/LurphLanding";
import TwitterPost from "./linkedin/TwitterPost.jsx";
import LinkedinPost from "./linkedin/LinkedinPost";
import WorkflowTwitter from "./linkedin/WorkflowTwitter.jsx";
import Canvas from "./components/subLayoutComponents/workflowPages/Canvas";
import ImageToVideoConverter from "./pages/explified_tools/image_to_video_convertor/ImageToVideoConverter.jsx";
import TaskPage from "./components1/TaskPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import DiscoverPage from "./components1/DiscoverPage.jsx";
import Notes from "./components1/Notes.jsx";

import HuggingFaceApiInterface from "./components/tools/HuggingFaceApiInterface.jsx";
import IntegrationsPage from "./components1/Integrations copy.jsx";
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname;

    if (hostname === "lurph.com" || hostname === "www.lurph.com") {
      navigate("/lurph");
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/web" element={<MainPage />} />
        <Route path="influmark/:name" element={<InfluencerProfile />} />
        <Route path="/login" element={<LoginPage />} />

        {/* <Route path="/influmark" element={<Influmark />} /> */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndServices />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/affliate-policy" element={<AffiliatePartnerPolicy />} />
        <Route path="/solutions" element={<ExplifiedServices />} />
        <Route path="/work" element={<ExplifiedWork />} />

        {/* <Route path="/integrations" element={<Integrations />} /> */}
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

        {/* grow dashboard */}
        <Route path="/grow" element={<Grow />}></Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/discover" element={<Discover />} />
          <Route path="/dashboard/trending" element={<Trending />} />

          {/* Updated Dashboard */}

          {/* Tools Page */}
          <Route path="clipper" element={<Clipper />} />
          <Route path="subtitling" element={<Subtitling />} />
          <Route path="video-generator" element={<VideoFromLink />} />
          <Route path="gif-generator" element={<GIFGenerator />} />
          <Route path="scribble" element={<Scribbling />} />

          <Route path="image-cartoonizer" element={<ImageCartoonizer />} />
          <Route path="image-to-video" element={<ImageToVideoConvertor />} />
          <Route path="text-to-video" element={<TextToVideo />} />
          <Route path="text-to-image" element={<TextToImage />} />
          <Route path="ai-image-styler" element={<AIImageStyler />} />
          <Route path="slideshow" element={<AISlideshow />} />
          <Route path="ageing_ai" element={<AgeingVideoMaker />} />
        </Route>

        {/* <Route path="/" element={<NewDashBoardLayout />}>
            <Route index element={<NewDashboard />} />
            <Route path="/youtube-summarizer" element={<YoutubeSummarizer />} />
            <Route path="/pdf-tools" element={<PDFHome />} />
            <Route path="/pdf-tools/compress" element={<Compress />} />
            <Route path="/pdf-tools/pdftoany" element={<PdfToAny />} />
            <Route path="/pdf-tools/edit" element={<Edit />} />
            <Route path="/pdf-tools/pdftoword" element={<PdfToWord />} />
            <Route path="/pdf-tools/merge" element={<Merge />} />
            <Route path="/pdf-tools/sign" element={<Sign />} />
          </Route> */}
        <Route path="/lurph" element={<LurphLanding />}></Route>

        <Route path="/" element={<UpdatedDashboard />}>
          <Route index element={<MainDashboard />}></Route>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/socials" element={<SocialsPage />}></Route>
          <Route path="/history" element={<History />}></Route>
          <Route path="/test" element={<HuggingFaceApiInterface />} />
          <Route path="/canvas" element={<Canvas />}></Route>
          <Route path=":tool/w" element={<CreateWorkflow />} />
          <Route path="/remove_bg" element={<RemoveBackground />} />
          <Route path="/text-to-video" element={<TextToVideoGenerator />} />

          <Route path="/history" element={<History />}></Route>
          {/* <Route path="/newlurph" element={<LurphLanding />}></Route> */}
          <Route path="/favorites" element={<Favourites />}></Route>
          <Route path="/workflows" element={<MainWorkflowPage />} />
          <Route path="/workflows/new" element={<CreateNewPage />}></Route>
          <Route
            path="/workflows/recommended"
            element={<RecommendedWorkflowsPage />}
          ></Route>

          <Route
            path="/workflows/existing"
            element={<ExistingWorkflowsPage />}
          ></Route>
          <Route
            path="/workflows/unfinished"
            element={<UnfinishedWorkflowsPage />}
          ></Route>
          <Route path="/socials/:id" element={<DetailedCard />}></Route>
          <Route path="/aitools" element={<AITools />}></Route>
          <Route path="/discover" element={<DiscoverPage />}></Route>
          <Route path="/chat" element={<Trone />} />
          <Route path="/Meme" element={<Meme />} />
          <Route path="/result" element={<Result />} />
          <Route path="/ageing_ai" element={<AgeingVideoMaker />} />
          <Route path="/ai-gif-generator" element={<GIFGenerator />} />
          <Route path="/video-meme-generator" element={<AIMemeGenerator />} />
          <Route path="/history" element={<History />}></Route>
          <Route path="/favorites" element={<Favourites />}></Route>
          <Route path="/workflows" element={<MainWorkflowPage />} />
          <Route path="/workflows/new" element={<CreateNewPage />}></Route>
          <Route
            path="/workflows/recommended"
            element={<RecommendedWorkflowsPage />}
          ></Route>
          <Route
            path="/workflows/existing"
            element={<ExistingWorkflowsPage />}
          ></Route>
          <Route
            path="/workflows/unfinished"
            element={<UnfinishedWorkflowsPage />}
          ></Route>
          <Route
            path="/automation-workflows"
            element={<AutomationWorkflow />}
          />
          <Route
            path="/automation-workflows-twitter"
            element={<WorkflowTwitter />}
          />
          <Route path="/post-linkedin" element={<LinkedinPost />} />
          <Route path="/post-twitter" element={<TwitterPost />} />

          <Route path="/socials/:id/posts/recents" element={<RecentPosts />} />
          <Route path="/socials/:id/lastPosts" element={<LastPosts />} />
          <Route path="/socials/:id/:id1" element={<ScheduleDraftPosts />} />
          <Route path="/socials/newPost" element={<NewPost />} />
          <Route
            path="/presentation"
            element={<PresentationLandingPage />}
          ></Route>
          {/* <Route
              path="/presentation/create"
              element={<CreatePresentation />} 
            /> */}

          <Route path="/image-styler" element={<ImageFilter />} />
          <Route path="/image-styler/filter" element={<AiImageStyler />} />
          {/* not working */}
          <Route
            path="/image-styler/backChanger"
            element={<BackgroundChanger />}
          />
          <Route path="/image-styler/merger" element={<ImageMerger />} />
          <Route path="/image-styler/expander" element={<ImageExpander />} />
          <Route path="/image-styler/editor" element={<ImageEditor />} />

          <Route path="/bg-remover" element={<RemoveBackground />} />

          {/* <Route path="/result" element={<Result />} /> */}
          <Route path="/zeno" element={<NewZapier />} />
          <Route path="/workflows/create/" element={<CreateWorkflow />} />
          <Route path="/zenonew" element={<ZapierChat />} />

          {/* <Route path="/result2" element={<ZapResult />} /> */}
          <Route path="/influmark/:name" element={<InfluencerProfile />} />
          <Route path="/Meme" element={<Meme />} />
          <Route path="/influmark" element={<Influmark />} />
          <Route path="/integrations" element={<Integrations />} />
          {/* <Route path="/integrations" element={<IntegrationsPage />} /> */}
          <Route path="/enhanced" element={<ZapEnhanced />} />
          <Route path="/ZapAuth" element={<ZapEnhanced />} />

          <Route path="/yt-automation" element={<TextToVideo1 />} />
          <Route
            path="/yt-automation/description"
            element={<VideoDescription />}
          />

          <Route path="/ai/whatsapp" element={<WhatsAppChatbot />} />
          <Route path="/ai/youtube-upload" element={<YouTubeUpload />} />

          <Route path="/socials/newPost" element={<NewPost />} />
          <Route path="/youtube-summarizer" element={<YoutubeSummarizer />} />
          <Route path="/ai-subtitler" element={<AISubtitler />} />
          <Route path="/ai-subtitler-ui" element={<SubtitleToolUI />} />
          <Route
            path="/image-to-video-ai"
            element={<ImageToVideoConverter />}
          />
          <Route
            path="/youtube-summarizer/deep-search"
            element={<DeepSearch />}
          />
          <Route
            path="/presentation"
            element={<PresentationLandingPage />}
          ></Route>
          <Route path="/presentation/create" element={<CreatePresentation />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/*" element={<ComingSoon />} />
        </Route>

        {/* <Route path="/clipper-landing" element={<ClipperLandingPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
