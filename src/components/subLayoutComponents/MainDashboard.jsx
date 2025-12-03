import React, { useState, useEffect } from "react";
import {
  FileText,
  Projector,
  Plus,
  Play,
  Zap,
  Database,
  Search,
  LayoutDashboard,
  Layers,
  Workflow,
  PlugZap,
  ChevronRight,
  ChevronLeft,
  Star,
  Clipboard,
  ClipboardPen,
} from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { MdElderlyWoman, MdOutlineGifBox } from "react-icons/md";
import { SiGmail, SiGooglesheets } from "react-icons/si";
import {
  SiGoogledrive,
  SiGooglecalendar,
  SiZoom,
  SiSlack,
  SiTrello,
  SiNotion,
  SiDropbox,
  SiWhatsapp,
  SiGoogleanalytics,
} from "react-icons/si";
import { MdBusiness } from "react-icons/md";

import notes from "../../../public/images/notes-image.png";
import expli from "../../../public/images/expli-image.png";

import {
  FaYoutube,
  FaFileAlt,
  FaVideo,
  FaProjectDiagram,
  FaImage,
  FaImages,
  FaBolt,
  FaLaughSquint,
  FaPlug,
  FaLink,
  FaPlay,
} from "react-icons/fa";
import { AiOutlineFileImage } from "react-icons/ai";
import { MdEdit } from "react-icons/md";

const sampleWorkflows = [
  {
    id: "GoogleSheets-Gmail",
    title: "Email Drip Campaigns",
    description:
      "Send personalized and automated follow-up emails directly from Google Sheets using Gmail to manage outreach campaigns efficiently.",
    tools: [
      {
        name: "Google Sheets",
        icon: <SiGooglesheets />,
        bgColor: "bg-green-500/30",
      },
      { name: "Gmail", icon: <SiGmail />, bgColor: "bg-red-500/30" },
    ],
    category: "Marketing",
    recommended: true,
  },
  {
    id: "Zoom-GoogleDrive",
    title: "Data Cleaning Pipelines",
    description:
      "Automatically store Zoom recordings in Google Drive, where files can be cleaned, processed, and organized for analytics.",
    tools: [
      { name: "Zoom", icon: <SiZoom />, bgColor: "bg-blue-500/30" },
      {
        name: "Google Drive",
        icon: <SiGoogledrive />,
        bgColor: "bg-yellow-500/30",
      },
    ],
    category: "Productivity",
    recommended: true,
  },
  {
    id: "Slack-GoogleCalendar",
    title: "Google Ads Spend Monitor",
    description:
      "Monitor Google Ads spending and instantly notify your team on Slack while scheduling reviews in Google Calendar.",
    tools: [
      { name: "Slack", icon: <SiSlack />, bgColor: "bg-purple-500/30" },
      {
        name: "Google Calendar",
        icon: <SiGooglecalendar />,
        bgColor: "bg-blue-400/30",
      },
    ],
    category: "Marketing",
    recommended: true,
  },
  {
    id: "Trello-WhatsApp",
    title: "Daily/Weekly Summary Emails on WhatsApp",
    description:
      "Generate automated task summaries from Trello and send them as digest messages via WhatsApp for quick team updates.",
    tools: [
      { name: "Trello", icon: <SiTrello />, bgColor: "bg-cyan-600/30" },
      { name: "WhatsApp", icon: <SiWhatsapp />, bgColor: "bg-green-600/30" },
    ],
    category: "Project Management",
    recommended: false,
  },
  {
    id: "Notion-Slack",
    title: "Customer Onboarding",
    description:
      "Track and document customer onboarding steps in Notion while sending real-time Slack updates to the team.",
    tools: [
      { name: "Notion", icon: <SiNotion />, bgColor: "bg-black" },
      { name: "Slack", icon: <SiSlack />, bgColor: "bg-purple-500/30" },
    ],
    category: "Collaboration",
    recommended: true,
  },
  {
    id: "GoogleAnalytics-WhatsApp",
    title: "Google Analytics (GA4) report on WhatsApp and Gmail",
    description:
      "Automate Google Analytics GA4 reports and deliver them via Gmail and WhatsApp for accessible, real-time insights.",
    tools: [
      {
        name: "Google Analytics",
        icon: <SiGoogleanalytics />,
        bgColor: "bg-orange-500/30",
      },
      { name: "WhatsApp", icon: <SiWhatsapp />, bgColor: "bg-green-600/30" },
      { name: "Gmail", icon: <SiGmail />, bgColor: "bg-red-500/30" },
    ],
    category: "Analytics",
    recommended: true,
  },
  {
    id: "GoogleAnalytics-Slack",
    title: "Google Ads Spend",
    description:
      "Track Google Ads spending using Google Analytics and push instant notifications to Slack channels for budget awareness.",
    tools: [
      {
        name: "Google Analytics",
        icon: <SiGoogleanalytics />,
        bgColor: "bg-orange-500/30",
      },
      { name: "Slack", icon: <SiSlack />, bgColor: "bg-purple-500/30" },
    ],
    category: "Marketing",
    recommended: false,
  },
  {
    id: "Dropbox-PowerBI",
    title: "Power BI Dashboard Auto-Refresh",
    description:
      "Sync Dropbox files with Power BI to ensure dashboards are refreshed automatically with the latest data.",
    tools: [
      { name: "Dropbox", icon: <SiDropbox />, bgColor: "bg-blue-700/30" },
      { name: "Power BI", icon: <MdBusiness />, bgColor: "bg-yellow-600/30" },
    ],
    category: "Analytics",
    recommended: true,
  },
  {
    id: "Dropbox-Trello",
    title: "Doc to Task Manager",
    description:
      "Convert documents uploaded to Dropbox into actionable Trello tasks automatically.",
    tools: [
      { name: "Dropbox", icon: <SiDropbox />, bgColor: "bg-blue-700/30" },
      { name: "Trello", icon: <SiTrello />, bgColor: "bg-cyan-600/30" },
    ],
    category: "Productivity",
    recommended: true,
  },
  {
    id: "GoogleSheets-Gmail",
    title: "CRM Automation",
    description:
      "Use Google Sheets as a lightweight CRM and automate customer communication through Gmail.",
    tools: [
      {
        name: "Google Sheets",
        icon: <SiGooglesheets />,
        bgColor: "bg-green-500/30",
      },
      { name: "Gmail", icon: <SiGmail />, bgColor: "bg-red-500/30" },
    ],
    category: "Sales",
    recommended: true,
  },
  {
    id: "Dropbox-Gmail",
    title: "Marketing Automation",
    description:
      "Automate the flow of marketing content by connecting Dropbox storage with Gmail campaigns.",
    tools: [
      { name: "Dropbox", icon: <SiDropbox />, bgColor: "bg-blue-700/30" },
      { name: "Gmail", icon: <SiGmail />, bgColor: "bg-red-500/30" },
    ],
    category: "Marketing",
    recommended: true,
  },
  {
    id: "Slack-Dropbox",
    title: "Customer Support Automation",
    description:
      "Forward Dropbox support files and documents directly to Slack to notify your support team instantly.",
    tools: [
      { name: "Slack", icon: <SiSlack />, bgColor: "bg-purple-500/30" },
      { name: "Dropbox", icon: <SiDropbox />, bgColor: "bg-blue-700/30" },
    ],
    category: "Support",
    recommended: true,
  },
  {
    id: "Slack-GoogleDrive",
    title: "Internal Team Workflows",
    description:
      "Simplify internal collaboration by syncing Google Drive files and sending updates to Slack channels.",
    tools: [
      { name: "Slack", icon: <SiSlack />, bgColor: "bg-purple-500/30" },
      {
        name: "Google Drive",
        icon: <SiGoogledrive />,
        bgColor: "bg-yellow-500/30",
      },
    ],
    category: "Collaboration",
    recommended: true,
  },
];

const allTools = [
  {
    title: "Youtube Summarizer",
    description: "A YouTube Summarizer quickly turns long videos into short.",
    icon: <FaYoutube />,
    color: "from-teal-500 to-teal-700",
    route: "/youtube-summarizer",
  },
  {
    title: "AI Subtitler",
    description: "Centralized AI Subtitler for your videos",
    icon: <FaFileAlt />,
    color: "from-teal-500 to-teal-700",
    route: "/ai-subtitler",
  },
  {
    title: "Text To Video Generator",
    description: "Generate videos using prompts.",
    icon: <FaVideo />,
    route: "/text-to-video",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Slideshow Maker",
    description: "Create stunning slideshows.",
    icon: <FaProjectDiagram />,
    route: "/presentation",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Bg Remover",
    description: "Remove background from images.",
    icon: <AiOutlineFileImage />,
    route: "/bg-remover",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Image Styler",
    description: "Style your images.",
    icon: <FaImages />,
    route: "/image-styler",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Text To Meme Generator AI",
    description: "Turn any clip into a share-worthy meme in seconds with AI.",
    icon: <FaLaughSquint />,
    route: "/text-to-meme",
    color: "from-teal-500 to-teal-700",
  },
  // {
  //   title: "Video Meme Generator AI",
  //   description: "Turn any clip into a share-worthy meme in seconds with AI.",
  //   icon: <FaLaughSquint />,
  //   route: "/video-meme-generator",
  //   color: "from-teal-500 to-teal-700",
  // },
  {
    title: "Integrations",
    description: "Instantly share across your socials.",
    icon: <FaPlug />,
    route: "/integrations",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Socials",
    description: "One click, everywhere.",
    icon: <FaBolt />,
    route: "/socials",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "AI GIF Generator",
    description: "Viral GIFs, AI-powered in seconds.",
    icon: <MdOutlineGifBox />,
    route: "/ai-gif-generator",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "AI Hugging Video Maker",
    description: "Bring warm hugs to life with AI-powered videos.",
    icon: <FaPlay />,
    route: "/ai-hugging-video-maker",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Ageing Video Maker AI",
    description: "See yourself age in seconds with AI-powered videos.",
    icon: <MdElderlyWoman />,
    route: "/ageing-video-maker-ai",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "AI Tattoo Art Generator",
    description: "Design unique tattoo art instantly with AI.",
    icon: <MdEdit />,
    route: "/ai-tattoo-art-generator",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Image To Video AI",
    description: "Transform any image into a stunning video with AI.",
    icon: <FaImage />,
    route: "/image-to-video-ai",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Link To Video AI",
    description: "Turn any link into an engaging video with AI.",
    icon: <FaLink />,
    route: "/link-to-video-ai",
    color: "from-teal-500 to-teal-700",
  },
];

const MainDashboard = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchText, setSearchText] = useState("");

  const expliImageUrl = expli;
  const notesImageUrl = notes;

  const carouselItems = [
    {
      id: 1,
      title: "Expli",
      description: "Advanced AI assistant for complex tasks and analysis",
      route: "/expli",
      image: expliImageUrl,
    },
    {
      id: 2,
      title: "Notes",
      description: "Create and manage your personal notes and documentation",
      route: "/tasks",
      image: notesImageUrl,
    },
  ];

  const popularApps = [
    {
      id: 1,
      name: "Expli",
      icon: <Plus />,
      color: "from-teal-500 to-teal-700",
      route: "/expli",
    },
    {
      id: 2,
      name: "Notes",
      icon: <ClipboardPen />,
      color: "from-teal-500 to-teal-700",
      route: "/tasks",
    },
    {
      id: 3,
      name: "Slideshow Maker",
      icon: <Projector />,
      color: "from-teal-500 to-teal-700",
      route: "/presentation",
    },
    {
      id: 4,
      name: "AI GIF Generator",
      icon: <MdOutlineGifBox />,
      color: "from-teal-500 to-teal-700",
      route: "/ai-gif-generator",
    },
  ].filter((app) =>
    searchText.trim().length === 0
      ? true
      : app.name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  // Carousel controls
  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
    );

  // Limit items when not expanded
  const displayedApps = allTools.slice(0, 8);
  const displayedWorkflows = sampleWorkflows.slice(0, 6);

  return (
    <>
      <div className="w-full relative min-h-screen flex bg-black">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-20 relative z-10">
          <div className="w-full min-h-screen bg-black pt-10 pb-20">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="mx-auto">
                {/* Top Title, Subtitle, Filter Bar */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div className="flex-1 flex items-end justify-end">
                    <div className="relative w-full max-w-md">
                      {/* Search Icon */}
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#23b5b5] pointer-events-none"
                        size={20}
                      />

                      {/* Search Input */}
                      <input
                        type="text"
                        className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-900 text-white border border-[#23b5b5]/30 placeholder:text-gray-400 focus:outline-none focus:border-[#23b5b5] transition-all"
                        placeholder="Search apps..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />

                      {/* Dropdown Filter Results */}
                      {searchText && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-gray-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto border border-[#23b5b5]/30">
                          {allTools
                            .filter((app) =>
                              app.title
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                            )
                            .map((app) => (
                              <div
                                key={app.title}
                                onClick={() => navigate(app.route)}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-[#23b5b5]/20 cursor-pointer transition-colors"
                              >
                                {/* App Icon */}
                                <span
                                  className={`w-8 h-8 flex items-center justify-center rounded-md text-lg bg-gradient-to-br ${
                                    app.color ?? "from-[#23b5b5] to-cyan-600"
                                  }`}
                                >
                                  {app.icon}
                                </span>

                                {/* App Title */}
                                <span className="text-white">{app.title}</span>
                              </div>
                            ))}

                          {/* No results message */}
                          {allTools.filter((app) =>
                            app.title
                              .toLowerCase()
                              .includes(searchText.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 py-2 text-gray-400">
                              No apps found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Section: Carousel & Apps, 2 columns - equal width */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Carousel: left half */}
                  <div className="flex flex-col gap-4 h-full">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                      {carouselItems.map((item, index) => (
                        <div
                          key={item.id}
                          onClick={() => navigate(item.route)} // 👈 Makes the whole slide clickable
                          className={`absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer ${
                            index === currentSlide
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-95 pointer-events-none"
                          }`}
                        >
                          <div
                            className="w-full h-full p-6 flex flex-col justify-end rounded-2xl relative overflow-hidden bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.image})` }}
                          >
                            {/* Gradient overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0f2027]/90 via-[#23b5b5]/40 to-transparent z-0"></div>

                            {/* Glow effects */}
                            <div className="absolute inset-0 opacity-20 z-0">
                              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl" />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Carousel Controls */}
                      <button
                        onClick={prevSlide}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-[#23b5b5]/60 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-[#23b5b5]/30"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-[#23b5b5]/60 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-[#23b5b5]/30"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        {carouselItems.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                              index === currentSlide
                                ? "w-6 bg-[#23b5b5]"
                                : "w-2 bg-white/40 hover:bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Most Popular Apps: right half */}
                  <div className="flex flex-col gap-3 mb-4">
                    {/* Most Popular Apps Heading */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                          Most Popular Apps
                        </h2>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#23b5b5]/10 to-transparent border border-[#23b5b5]/30">
                        <Star
                          size={14}
                          className="text-[#23b5b5] flex-shrink-0"
                        />
                        <span className="text-xs font-semibold text-[#23b5b5] whitespace-nowrap">
                          Trending
                        </span>
                      </div>
                    </div>

                    {/* Most Popular Apps Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                      {popularApps.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => navigate(app.route)}
                          className="group relative overflow-hidden rounded-xl border border-gray-700 hover:border-[#23b5b5]/50 bg-gradient-to-br from-gray-900/50 to-black/50 p-4 backdrop-blur-sm transition-all duration-300 hover:from-gray-900/80 hover:to-black/80 cursor-pointer hover:shadow-lg hover:shadow-[#23b5b5]/20 flex flex-col justify-between min-h-32 sm:min-h-40"
                        >
                          <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${app.color}`}
                          />
                          <div className="relative z-10">
                            <span
                              className={`w-9 h-9 mx-auto flex items-center justify-center rounded-md text-xl bg-gradient-to-br ${
                                app.color ?? "from-[#23b5b5] to-cyan-600"
                              }`}
                            >
                              {typeof app.icon === "string"
                                ? app.icon
                                : app.icon}
                            </span>
                            <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1 py-2 text-center">
                              {app.name}
                            </h3>
                            <div className="flex items-center gap-1 justify-center">
                              <Star
                                size={12}
                                className="text-yellow-400 fill-yellow-400 flex-shrink-0"
                              />
                              <span className="text-xs text-gray-400">4.8</span>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-[#23b5b5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end p-3">
                            <button className="w-full text-xs font-semibold text-white bg-[#23b5b5] hover:bg-[#1a9393] rounded-lg py-2 transition-all duration-200 shadow-lg">
                              Explore
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Bottom Section: All Apps & Workflows statistic cards */}
                <div className="flex flex-col lg:flex-row gap-6 min-h-[320px]">
                  {/* All Apps Card */}
                  <div className="flex-1 flex flex-col group overflow-hidden rounded-2xl border border-gray-700 hover:border-[#23b5b5]/50 bg-gradient-to-br from-gray-900/30 to-black/30 p-6 sm:p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#23b5b5] to-cyan-600 flex items-center justify-center">
                          <Database size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-white text-xl font-bold">
                            All Apps
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Explore our complete collection
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                      {displayedApps.map((app) => (
                        <div
                          key={app.title}
                          onClick={() => navigate(app.route)}
                          className="relative bg-[#13161a] rounded-xl p-4 cursor-pointer hover:shadow-xl hover:border-[#23b5b5] border border-transparent transition-all group flex flex-col"
                        >
                          {/* Header: Icon + Title side by side */}
                          <div className="flex items-center gap-3 mb-2">
                            {app.icon && (
                              <span
                                // ADDED 'shrink-0' HERE
                                className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-md text-xl bg-gradient-to-br ${
                                  app.color ?? "from-[#23b5b5] to-cyan-600"
                                }`}
                              >
                                {typeof app.icon === "string"
                                  ? app.icon
                                  : app.icon}
                              </span>
                            )}
                            <h3 className="font-semibold text-lg text-white">
                              {app.title}
                            </h3>
                          </div>

                          {/* Category badge below title */}
                          {app.category && (
                            <span className="text-[11px] px-2 py-1 rounded bg-[#24282c] text-teal-400 font-bold mb-2 w-max block uppercase">
                              {app.category}
                            </span>
                          )}

                          {/* Description */}
                          <p className="text-gray-400 text-[14px] mb-5 flex-1">
                            {app.description}
                          </p>

                          {/* CTA / Recommendation row */}
                          <div className="flex items-center text-[#23b5b5] text-xs font-medium">
                            <span className="mr-1">Launch Tool</span>
                            <span className="inline-block">&rarr;</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expand Button */}
                    {allTools.length > 8 && (
                      <button
                        onClick={() => navigate("/all-apps")}
                        className="mt-4 py-2 rounded-lg bg-gradient-to-r from-[#23b5b5] to-cyan-600 text-white font-semibold hover:from-cyan-600 hover:to-[#23b5b5] transition-colors"
                      >
                        Expand All
                      </button>
                    )}
                  </div>

                  {/* Workflows Card */}
                  <div className="flex-1 flex flex-col group overflow-hidden rounded-2xl border border-gray-700 hover:border-[#23b5b5]/50 bg-gradient-to-br from-gray-900/30 to-black/30 p-6 sm:p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-[#23b5b5] flex items-center justify-center">
                          <Workflow size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-white text-xl font-bold">
                            Workflows
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Pre-built automation templates
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Workflows Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                      {displayedWorkflows.map((wf) => (
                        <div
                          key={wf.id}
                          onClick={() => navigate("/locked")}
                          className="relative bg-[#13161a] rounded-xl p-5 cursor-pointer hover:shadow-xl hover:border-[#23b5b5] border border-transparent transition-all group flex flex-col"
                        >
                          {/* Integrations/Icons Top Row */}
                          {/* CHANGED: Added 'flex-wrap' to allow items to stack if space runs out */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {wf.tools &&
                              wf.tools.map((tool, idx) => (
                                <span
                                  key={idx}
                                  className={`w-8 h-8 flex items-center justify-center rounded-md text-lg bg-gradient-to-br ${tool.bgColor}`}
                                >
                                  {tool.icon}
                                </span>
                              ))}
                            {wf.category && (
                              // CHANGED: Removed 'ml-2' because 'gap-2' on parent handles the spacing now
                              <span className="text-[11px] px-2 py-1 rounded bg-[#24282c] text-teal-400 font-bold uppercase">
                                {wf.category}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-semibold text-lg text-white mb-0.5">
                            {wf.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-400 text-[13px] mb-5 flex-1">
                            {wf.description}
                          </p>

                          {/* Recommendation/CTA */}
                          <div className="text-[#23b5b5] text-xs font-medium flex items-center">
                            <span className="mr-1">Recommended for you</span>
                            <span className="inline-block">&#9733;</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expand Button */}
                    {sampleWorkflows.length > 2 && (
                      <button
                        onClick={() => navigate("/workflows")}
                        className="mt-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-[#23b5b5] text-white font-semibold hover:from-[#23b5b5] hover:to-cyan-600 transition-colors"
                      >
                        Explore Workflows
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeUp {
          animation: fadeUp 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes gradientText {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradientText {
          background-size: 200% 200%;
          animation: gradientText 6s linear infinite;
        }
        .animate-fadeIn {
          animation: fadeUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-zone {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default MainDashboard;
