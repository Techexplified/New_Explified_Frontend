import React, { useEffect, useState } from "react";
import HuggingFaceApiInterface from "../components/tools/HuggingFaceApiInterface";

import {
  Square,
  MoveUpRight,
  Plus,
  MessageCircle,
  Bot,
  Search,
  Brain,
  Edit,
  Video,
  Users,
  Zap,
  Chrome,
  Github,
  Mail,
  Sparkles,
  Captions,
  Youtube,
  Presentation,
  Eraser,
  Image,
  ImagePlay,
  Laugh,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { MdOutlineGifBox } from "react-icons/md";

const categorizedTools = {
  Messaging: [
    { name: "WhatsApp", icon: <MessageCircle /> },
    { name: "Discord", icon: <MessageCircle /> },
    { name: "Telegram", icon: <MessageCircle /> },
    { name: "Slack", icon: <MessageCircle /> },
  ],
  "AI Tools": [
    { name: "ChatGPT", icon: <Bot /> },
    { name: "Gemini", icon: <Bot /> },
    { name: "DeepSeek", icon: <Search /> },
    { name: "Perplexity AI", icon: <Brain /> },
    { name: "Notion AI", icon: <Edit /> },
    { name: "Slack GPT", icon: <Bot /> },
    { name: "Bg Remover", icon: <Eraser />, toolId: "bgremover" },
    { name: "Image Styler", icon: <Image />, toolId: "styler" },
    { name: "Youtube Summarizer", icon: <Youtube />, toolId: "ytsummarizer" },
    { name: "SlideShow Maker", icon: <Presentation />, toolId: "presentation" },
    { name: "AI Subtitler", icon: <Captions />, toolId: "subtitler" },
    { name: "Text to Video", icon: <Video />, toolId: "vidgen" },
    { name: "Image To Video AI", icon: <Image />, toolId: "imgtovid" },
    { name: "Video Meme Generator", icon: <Laugh />, toolId: "memegenerator" },
    {
      name: "AI GIF Generator",
      icon: <MdOutlineGifBox />,
      toolId: "gifgenerator",
    },
  ],
  "Video Conferencing": [
    { name: "Google Meet", icon: <Video /> },
    { name: "Microsoft Teams", icon: <Video /> },
    { name: "Zoom Meetings", icon: <Video /> },
  ],
  "Social Media": [
    { name: "Instagram", icon: <Users /> },
    { name: "LinkedIn", icon: <Users /> },
    { name: "YouTube", icon: <Video /> },
  ],
  Automation: [{ name: "Zapier", icon: <Zap /> }],
  "Browser Extensions": [{ name: "Chrome Extensions", icon: <Chrome /> }],
};

const Toolbar = () => {
  const [showApiInterface, setShowApiInterface] = useState(true);
  const [params] = useSearchParams();
  const toolId = params.get("id");
  const shouldShowApiInterface = toolId === "vidgen";

  const [selectedTool, setSelectedTool] = useState("square");
  const [boxes, setBoxes] = useState([]);
  const [activeBoxId, setActiveBoxId] = useState(null);
  const [draggedBoxId, setDraggedBoxId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [arrows, setArrows] = useState([]);
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState({ x: 0, y: 0 });
  const [arrowStartBoxId, setArrowStartBoxId] = useState(null);
  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredBoxId, setHoveredBoxId] = useState(null);
  const [isAIChatbotOpen, setIsAIChatbotOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [duration, setDuration] = useState(5);
  const [query, setQuery] = useState("");
  // Logo details sidebar state
  const [isLogoSidebarOpen, setIsLogoSidebarOpen] = useState(false);
  const [logoSidebarData, setLogoSidebarData] = useState({
    name: "",
    icon: null,
  });
  const navigate = useNavigate();
  // Flatten all tools for search
  const allTools = Object.values(categorizedTools).flat();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi User 👋 I can answer most questions about building workflows in n8n.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userNumber, setUserNumber] = useState("");
  const [chatInput, setChatInput] = useState("");

  const accountSid = import.meta.env.TWILIO_ACCOUNT_SID; // Replace with your Twilio Account SID
  const authToken = import.meta.env.TWILIO_AUTH_TOKEN; // Replace with your Twilio Auth Token
  const fromNumber = import.meta.env.TWILIO_FROM_NUMBER; // Your Twilio WhatsApp number
  const geminiApiKey = import.meta.env.GEMINI_API_KEY;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call Gemini 2.0 Flash API
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: input }] }],
          }),
        }
      );

      const data = await response.json();
      const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";

      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error fetching AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const handleToolClick = (toolId) => {
    setSelectedTool(toolId);
    if (toolId === "ai-stars") {
      setIsAIChatbotOpen(!isAIChatbotOpen);
    } else if (toolId === "square" && boxes.length === 0) {
      setBoxes([
        {
          id: Date.now(),
          left: window.innerWidth / 2 - 50,
          top: 240,
          icon: null,
        },
      ]);
    }
  };

  const handleAddBox = () => {
    setBoxes((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: Date.now(),
            left: window.innerWidth / 2 - 60,
            top: 160,
            icon: null,
          },
        ];
      } else {
        const last = prev[prev.length - 1];
        return [
          ...prev,
          {
            id: Date.now(),
            left: last.left + 220,
            top: last.top || 160,
            icon: null,
          },
        ];
      }
    });
  };

  const handleSelectToolIcon = (boxId, tool) => {
    setBoxes((prev) =>
      prev.map((box) =>
        box.id === boxId ? { ...box, icon: tool.icon, name: tool.name } : box
      )
    );
    setActiveBoxId(null);
  };

  const handleCreateBoxFromSide = (parentBoxId, side) => {
    const parentBox = boxes.find((box) => box.id === parentBoxId);
    if (!parentBox) return;

    let newBoxPosition = { left: 0, top: 0 };
    const spacing = 80; // Distance between boxes

    switch (side) {
      case "top":
        newBoxPosition = {
          left: parentBox.left,
          top: parentBox.top - 100 - spacing,
        };
        break;
      case "bottom":
        newBoxPosition = {
          left: parentBox.left,
          top: parentBox.top + 100 + spacing,
        };
        break;
      case "left":
        newBoxPosition = {
          left: parentBox.left - 120 - spacing,
          top: parentBox.top,
        };
        break;
      case "right":
        newBoxPosition = {
          left: parentBox.left + 120 + spacing,
          top: parentBox.top,
        };
        break;
    }

    const newBox = {
      id: Date.now(),
      left: newBoxPosition.left,
      top: newBoxPosition.top,
      icon: null,
    };

    setBoxes((prev) => [...prev, newBox]);

    // Create arrow connecting the boxes
    const startBox = parentBox;
    const endBox = newBox;
    const startCenter = getBoxCenter(startBox);
    const endPoint = getArrowEndPoint(startBox, endBox);

    const newArrow = {
      id: Date.now() + 1,
      startX: startCenter.x,
      startY: startCenter.y,
      endX: endPoint.x,
      endY: endPoint.y,
      startBoxId: parentBoxId,
      endBoxId: newBox.id,
    };

    setArrows((prev) => [...prev, newArrow]);
  };

  // Helper functions
  const findBoxAtPosition = (clientX, clientY) => {
    return boxes.find((box) => {
      return (
        clientX >= box.left &&
        clientX <= box.left + 120 &&
        clientY >= box.top &&
        clientY <= box.top + 100
      );
    });
  };

  const getBoxCenter = (box) => {
    return {
      x: box.left + 60,
      y: box.top + 50,
    };
  };

  const getArrowEndPoint = (startBox, endBox) => {
    const startCenter = getBoxCenter(startBox);
    const endCenter = getBoxCenter(endBox);

    const dx = endCenter.x - startCenter.x;
    const dy = endCenter.y - startCenter.y;

    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return endCenter;

    const unitX = dx / length;
    const unitY = dy / length;

    const boxWidth = 120;
    const boxHeight = 100;
    const halfWidth = boxWidth / 2;
    const halfHeight = boxHeight / 2;

    let intersectionX = endCenter.x;
    let intersectionY = endCenter.y;

    // Decide side intersection
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      // hit left or right
      if (dx > 0) {
        // left side of endBox (endBox.left)
        intersectionX = endBox.left;
        intersectionY =
          endCenter.y - (halfWidth * unitY) / (Math.abs(unitX) || 1);
      } else {
        intersectionX = endBox.left + boxWidth;
        intersectionY =
          endCenter.y + (halfWidth * unitY) / (Math.abs(unitX) || 1);
      }
    } else {
      // hit top or bottom
      if (dy > 0) {
        intersectionY = endBox.top;
        intersectionX =
          endCenter.x - (halfHeight * unitX) / (Math.abs(unitY) || 1);
      } else {
        intersectionY = endBox.top + boxHeight;
        intersectionX =
          endCenter.x + (halfHeight * unitX) / (Math.abs(unitY) || 1);
      }
    }

    return { x: intersectionX, y: intersectionY };
  };

  const handleBoxMouseDown = (e, boxId) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedTool === "arrow") {
      const box = boxes.find((b) => b.id === boxId);
      if (box) {
        const center = getBoxCenter(box);
        setIsDrawingArrow(true);
        setArrowStart(center);
        setArrowStartBoxId(boxId);
        setCurrentMousePos(center);
      }
    } else {
      const box = boxes.find((b) => b.id === boxId);
      if (box) {
        setDraggedBoxId(boxId);
        setHasDragged(false);
        setDragOffset({
          x: e.clientX - box.left,
          y: e.clientY - (box.top || 160),
        });
      }
    }
  };

  const handleMouseMove = (e) => {
    // Drag
    if (draggedBoxId && selectedTool !== "arrow") {
      setHasDragged(true);
      setBoxes((prev) =>
        prev.map((box) =>
          box.id === draggedBoxId
            ? {
                ...box,
                left: e.clientX - dragOffset.x,
                top: e.clientY - dragOffset.y,
              }
            : box
        )
      );
    }

    // Arrow drawing
    if (isDrawingArrow) {
      const hoveredBox = findBoxAtPosition(e.clientX, e.clientY);

      if (hoveredBox && hoveredBox.id !== arrowStartBoxId) {
        const startBox = boxes.find((b) => b.id === arrowStartBoxId);
        const endPoint = getArrowEndPoint(startBox, hoveredBox);
        setCurrentMousePos(endPoint);
      } else {
        setCurrentMousePos({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleMouseUp = (e) => {
    // Finish arrow
    if (isDrawingArrow && selectedTool === "arrow") {
      const targetBox = findBoxAtPosition(e.clientX, e.clientY);

      if (targetBox && targetBox.id !== arrowStartBoxId) {
        const startBox = boxes.find((b) => b.id === arrowStartBoxId);
        const endPoint = getArrowEndPoint(startBox, targetBox);

        const newArrow = {
          id: Date.now(),
          startX: arrowStart.x,
          startY: arrowStart.y,
          endX: endPoint.x,
          endY: endPoint.y,
          startBoxId: arrowStartBoxId,
          endBoxId: targetBox.id,
        };
        setArrows((prev) => [...prev, newArrow]);
      }

      setIsDrawingArrow(false);
      setArrowStartBoxId(null);
    }

    setDraggedBoxId(null);
  };

  const handleBoxClick = (e, boxId) => {
    // Only set active if it wasn't a drag and not using arrow tool
    if (!hasDragged && selectedTool !== "arrow") {
      setActiveBoxId(boxId);
      setSearchQuery("");
    }
  };

  // Instead of single boolean, store sign-in state per service
  const [signedInServices, setSignedInServices] = useState({});
  const [showYouTubeCreateUI, setShowYouTubeCreateUI] = useState(false);
  // Example: { whatsapp: true, telegram: false }

  const handleSignIn = async (serviceName) => {
    const serviceKey = serviceName.toLowerCase();

    // Prevent duplicate sign-in
    if (signedInServices[serviceKey]) {
      alert(`Already signed in for ${serviceName}`);
      return;
    }

    // ===== WHATSAPP SIGN-IN =====
    if (serviceKey === "whatsapp") {
      const number = prompt(
        "Enter your WhatsApp number with country code (e.g., 919876543210):"
      );
      if (!number) return alert("No number entered.");

      try {
        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: new URLSearchParams({
              From: fromNumber,
              To: `whatsapp:+${number}`,
              Body: "Hi, Welcome to Explified",
            }),
          }
        );

        if (response.ok) {
          setUserNumber(number);
          setSignedInServices((prev) => ({
            ...prev,
            [serviceKey]: true,
          }));
        } else {
          const errorData = await response.json();
          console.error(errorData);
          alert("Failed to send message via Twilio");
        }
      } catch (error) {
        console.error(error);
        alert("Error sending message");
      }
    }

    // ===== YOUTUBE SIGN-IN (OAUTH) =====
    if (serviceKey === "youtube") {
      const token = localStorage.getItem("yt_access_token");

      if (!token) {
        const CLIENT_ID =
          "1080089039501-2rkku1lknn3d0ukj3a3oh8hi3rg496hl.apps.googleusercontent.com";
        const REDIRECT_URI = "http://localhost:5173/api/youtube/oauth2callback";

        const SCOPE = [
          "https://www.googleapis.com/auth/youtube.upload",
          "https://www.googleapis.com/auth/youtube.readonly",
        ].join(" ");

        // After successful OAuth, we redirect back to show content creation UI
        const redirectPath = `/youtube-create`;
        sessionStorage.setItem("postAuthRedirect", redirectPath);

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
          REDIRECT_URI
        )}&response_type=token&scope=${encodeURIComponent(
          SCOPE
        )}&prompt=consent&state=${encodeURIComponent(redirectPath)}`;

        window.location.href = authUrl;
      } else {
        // Already signed in, show UI directly
        setSignedInServices((prev) => ({
          ...prev,
          [serviceKey]: true,
        }));
        setShowYouTubeCreateUI(true); // You'll add this state to render the input + buttons
      }
    }
  };

  const handleGenerate = async (type = "video") => {
    const queryText = query || prompt; // fallback if one is undefined
    if (!queryText?.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setShowSuccess(false);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 250);

    const token = localStorage.getItem("yt_access_token");

    const modifiedQuery =
      type === "short"
        ? `Create a vertical 9:16 short video under 60 seconds: ${queryText}`
        : `Create a horizontal 16:9 full-length video: ${queryText}`;

    if (!token) {
      const CLIENT_ID =
        "1080089039501-2rkku1lknn3d0ukj3a3oh8hi3rg496hl.apps.googleusercontent.com";
      const REDIRECT_URI = "http://localhost:5173/api/youtube/oauth2callback";

      const SCOPE = [
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.readonly",
      ].join(" ");

      const redirectPath = `/result2?query=${encodeURIComponent(
        modifiedQuery
      )}&duration=${duration}&type=${type}`;
      sessionStorage.setItem("postAuthRedirect", redirectPath);

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&response_type=token&scope=${encodeURIComponent(
        SCOPE
      )}&prompt=consent&state=${encodeURIComponent(redirectPath)}`;

      window.location.href = authUrl;
    } else {
      navigate(
        `/result2?query=${encodeURIComponent(
          modifiedQuery
        )}&duration=${duration}&type=${type}`
      );
    }
  };
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    // 1. Get Gemini response
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: chatInput }] }],
        }),
      }
    );

    const geminiData = await geminiRes.json();
    let replyText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    // Limit to 1500 words
    const words = replyText.split(/\s+/);
    if (words.length > 1500) {
      replyText = words.slice(0, 1500).join(" ") + "...";
    }

    // 2. Show in UI
    setMessages((prev) => [...prev, { user: chatInput }, { bot: replyText }]);
    setChatInput("");

    // 3. Send to WhatsApp via Twilio
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: `whatsapp:+${userNumber}`,
          Body: replyText,
        }),
      }
    );
  };

  // const handleDropdownSelect = (serviceName) => {
  //   let url = "";

  //   switch (serviceName.toLowerCase()) {
  //     case "whatsapp":
  //       url = "https://wa.me/+14155238886";
  //       break;
  //     case "linkedin":
  //       url = "https://www.linkedin.com/login";
  //       break;
  //     case "youtube":
  //       url = "https://accounts.google.com/ServiceLogin?service=youtube";
  //       break;
  //     default:
  //       url = "";
  //   }

  //   const newBox = {
  //     id: Date.now(),
  //     name: serviceName,
  //     icon: getServiceIcon(serviceName), // however you're getting the icon
  //     signInUrl: url,
  //     left: 200,
  //     top: 200,
  //   };

  //   setBoxes((prev) => [...prev, newBox]);
  // };

  // active box (for search dropdown position)
  const activeBox = boxes.find((b) => b.id === activeBoxId);

  return (
    <div
      className={`relative w-full h-screen  ${
        selectedTool === "arrow" ? "cursor-crosshair" : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setActiveBoxId(null);
        }
      }}
    >
      {/* Empty Canvas Placeholder */}
      {(!boxes || boxes.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div
            className="group w-[140px] h-[120px] border-2 border-dashed border-[#23b5b5]/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#23b5b5] hover:bg-[#23b5b5]/5 transition-all duration-300 hover:scale-105"
            onClick={() => {
              setBoxes([
                {
                  id: Date.now(),
                  left: window.innerWidth / 2 - 60,
                  top: window.innerHeight / 2 - 50,
                  icon: null,
                },
              ]);
            }}
          >
            <div className="relative mb-2">
              <Plus
                size={56}
                className="text-[#23b5b5] group-hover:text-white transition-colors duration-300"
              />
              <div className="absolute inset-0 bg-[#23b5b5] rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      )}

      {/* Hugging Face API interface */}
      {showApiInterface && shouldShowApiInterface && currentBox && (
        <div
          className="absolute z-50"
          style={{
            left: `${currentBox.left + 60}px`,
            top: `${(currentBox.top || 160) - 12}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-black/90 backdrop-blur-xl border border-[#23b5b5]/30 rounded-xl shadow-2xl shadow-[#23b5b5]/10">
            <HuggingFaceApiInterface
              setShowApiInterface={setShowApiInterface}
            />
          </div>
        </div>
      )}

      {/* Render Boxes */}
      {boxes &&
        boxes.map((box) => (
          <div
            key={box.id}
            className="absolute"
            style={{
              left: `${box.left - 32}px`,
              top: `${(box.top || 160) - 32}px`,
              width: "184px",
              height: "164px",
            }}
            onMouseEnter={() => setHoveredBoxId(box.id)}
            onMouseLeave={() => setHoveredBoxId(null)}
          >
            <div
              data-box-id={box.id}
              className={`absolute w-[120px] h-[100px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-[#23b5b5]/60 rounded-xl shadow-2xl shadow-[#23b5b5]/20 z-40 transition-all duration-300 hover:border-[#23b5b5] hover:shadow-[#23b5b5]/30 hover:scale-105 ${
                selectedTool === "arrow"
                  ? "cursor-crosshair"
                  : draggedBoxId === box.id
                  ? "cursor-grabbing"
                  : "cursor-grab"
              }`}
              style={{
                left: "32px",
                top: "32px",
              }}
              onMouseDown={(e) => handleBoxMouseDown(e, box.id)}
              onClick={(e) => {
                e.stopPropagation();
                handleBoxClick(e, box.id);
              }}
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#23b5b5]/20 to-transparent rounded-xl blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300" />

              {/* Icon / placeholder */}
              {box.icon ? (
                <div
                  className="relative w-full h-full flex items-center justify-center text-4xl text-white hover:text-[#23b5b5] transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLogoSidebarData({
                      name: box.name || "Selected Logo",
                      icon: box.icon,
                    });
                    setIsLogoSidebarOpen(true);
                    setActiveBoxId(null);
                  }}
                >
                  {box.icon}
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center text-4xl text-[#23b5b5]/70 hover:text-[#23b5b5] transition-colors duration-300">
                  <Square size={48} />
                </div>
              )}
            </div>

            {/* Side Dots - Enhanced with glow effect */}
            {hoveredBoxId === box.id && (
              <>
                {[
                  { side: "top", style: "top-0 left-1/2 -translate-x-1/2" },
                  {
                    side: "bottom",
                    style: "bottom-0 left-1/2 -translate-x-1/2",
                  },
                  { side: "left", style: "top-1/2 -translate-y-1/2 left-0" },
                  { side: "right", style: "top-1/2 -translate-y-1/2 right-0" },
                ].map(({ side, style }) => (
                  <button
                    key={side}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateBoxFromSide(box.id, side);
                    }}
                    className={`absolute ${style} w-5 h-5 bg-[#23b5b5]/30 rounded-full hover:bg-[#23b5b5] transition-all duration-300 z-50 hover:scale-125 border-2 border-[#23b5b5]/50 hover:border-[#23b5b5] hover:shadow-lg hover:shadow-[#23b5b5]/50`}
                  >
                    <div className="absolute inset-0 bg-[#23b5b5] rounded-full blur-sm opacity-0 hover:opacity-50 transition-opacity duration-300" />
                  </button>
                ))}
              </>
            )}
          </div>
        ))}

      {/* Render Arrows */}
      {arrows &&
        arrows.map((arrow) => (
          <svg
            key={arrow.id}
            className="absolute inset-0 pointer-events-none z-30"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <marker
                id={`arrowhead-${arrow.id}`}
                markerWidth="12"
                markerHeight="8"
                refX="11"
                refY="4"
                orient="auto"
              >
                <polygon
                  points="0 0, 12 4, 0 8"
                  fill="#23b5b5"
                  stroke="#23b5b5"
                  strokeWidth="1"
                />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line
              x1={arrow.startX}
              y1={arrow.startY}
              x2={arrow.endX}
              y2={arrow.endY}
              stroke="#23b5b5"
              strokeWidth="3"
              markerEnd={`url(#arrowhead-${arrow.id})`}
              filter="url(#glow)"
              className="drop-shadow-lg"
            />
          </svg>
        ))}

      {/* Temporary arrow while drawing */}
      {isDrawingArrow && (
        <svg
          className="absolute inset-0 pointer-events-none z-30"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <marker
              id="temp-arrowhead"
              markerWidth="12"
              markerHeight="8"
              refX="11"
              refY="4"
              orient="auto"
            >
              <polygon
                points="0 0, 12 4, 0 8"
                fill="#23b5b5"
                stroke="#23b5b5"
                strokeWidth="1"
              />
            </marker>
          </defs>
          <line
            x1={arrowStart.x}
            y1={arrowStart.y}
            x2={currentMousePos.x}
            y2={currentMousePos.y}
            stroke="#23b5b5"
            strokeWidth="3"
            markerEnd="url(#temp-arrowhead)"
            strokeDasharray="8,4"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* Enhanced Search Sidebar */}
      {activeBox && (
        <div
          className="absolute left-full top-0 ml-6 w-72 max-h-[350px] bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#23b5b5]/30 z-50 overflow-hidden"
          style={{
            left: `${activeBox.left + 120}px`,
            top: `${activeBox.top || 160}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with glow effect */}
          <div className="p-4 border-b border-[#23b5b5]/20 bg-gradient-to-r from-[#23b5b5]/10 to-transparent">
            <input
              type="text"
              placeholder="🔍 Search tools..."
              className="w-full px-4 py-3 text-sm border border-[#23b5b5]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/50 focus:border-[#23b5b5] transition-all duration-300 bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tools List */}
          <div className="p-2 max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
            {allTools &&
              allTools
                .filter((tool) =>
                  tool.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((tool, index) => (
                  <button
                    key={tool.name}
                    onClick={() => handleSelectToolIcon(activeBoxId, tool)}
                    className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-[#23b5b5]/10 text-white text-sm border border-transparent hover:border-[#23b5b5]/30 transition-all duration-300 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                      {tool.icon}
                    </span>
                    <span className="group-hover:text-[#23b5b5] transition-colors duration-300">
                      {tool.name}
                    </span>
                  </button>
                ))}
          </div>
        </div>
      )}

      {/* Enhanced Floating Toolbar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="relative">
          {/* Glow effect background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#23b5b5]/20 to-[#23b5b5]/10 rounded-lg blur-xl animate-pulse" />

          <div className="relative bg-black/90 backdrop-blur-2xl border border-[#23b5b5]/30 rounded-lg p-3 flex items-center gap-3 shadow-2xl shadow-[#23b5b5]/20">
            {["square", "arrow", "ai-stars"].map((tool, index) => (
              <button
                key={tool}
                onClick={() => handleToolClick(tool)}
                className={`relative rounded-md transition-all duration-300 ease-out w-12 h-8 flex items-center justify-center group overflow-hidden ${
                  selectedTool === tool
                    ? "bg-gradient-to-br from-[#23b5b5] to-[#1a9999] text-white shadow-lg shadow-[#23b5b5]/40 scale-110"
                    : "text-gray-400 hover:text-white hover:bg-[#23b5b5]/10 hover:scale-105"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Tool Icon */}
                <span className="text-2xl relative z-10 transition-transform duration-300 group-hover:scale-110">
                  {tool === "square" ? (
                    <Square />
                  ) : tool === "arrow" ? (
                    <MoveUpRight />
                  ) : (
                    <Sparkles />
                  )}
                </span>

                {/* Active state glow */}
                {selectedTool === tool && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#23b5b5]/30 to-[#1a9999]/30 animate-pulse" />
                )}

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-[#23b5b5]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced AI Chatbot Sidebar */}
      <div
        className={`fixed top-20 right-0 h-[calc(100vh-80px)] w-96 bg-black/95 backdrop-blur-2xl border-l border-t border-b border-[#23b5b5]/30 rounded-l-2xl z-50 transform transition-all duration-500 ease-in-out ${
          isAIChatbotOpen
            ? "translate-x-0 shadow-2xl shadow-[#23b5b5]/20"
            : "translate-x-full"
        }`}
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#23b5b5]/20 bg-gradient-to-r from-[#23b5b5]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#23b5b5]/20 rounded-xl">
              <Sparkles className="text-[#23b5b5]" size={20} />
            </div>
            <span className="text-white font-semibold text-lg">
              AI Assistant
            </span>
          </div>
          <button
            onClick={() => setIsAIChatbotOpen(false)}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#23b5b5]/10 rounded-xl transition-all duration-300"
          >
            <MoveUpRight size={20} />
          </button>
        </div>

        {/* Enhanced Chat Area */}
        <div className="p-6 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
            {messages &&
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl shadow-lg ${
                      msg.role === "assistant"
                        ? "bg-gray-800 text-white border border-[#23b5b5]/20"
                        : "bg-gradient-to-r from-[#23b5b5] to-[#1a9999] text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-400 p-4 rounded-2xl border border-[#23b5b5]/20">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#23b5b5] rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-[#23b5b5] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-[#23b5b5] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Input Box */}
          <div className="border-t border-[#23b5b5]/20 pt-4">
            <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-2xl border border-[#23b5b5]/20 focus-within:border-[#23b5b5] transition-colors duration-300">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 text-white placeholder-gray-400 bg-transparent outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="p-2 text-[#23b5b5] hover:text-white hover:bg-[#23b5b5] rounded-xl transition-all duration-300 disabled:opacity-50"
                onClick={handleSend}
                disabled={loading}
              >
                <MoveUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Logo Details Sidebar */}
      <div
        className={`fixed top-20 right-0 h-[calc(100vh-80px)] w-96 bg-black/95 backdrop-blur-2xl border-l border-t border-b border-[#23b5b5]/30 rounded-l-2xl z-50 transform transition-all duration-500 ease-in-out ${
          isLogoSidebarOpen
            ? "translate-x-0 shadow-2xl shadow-[#23b5b5]/20"
            : "translate-x-full"
        }`}
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#23b5b5]/20 bg-gradient-to-r from-[#23b5b5]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{logoSidebarData?.icon}</div>
            <span className="text-white font-semibold text-lg">
              {logoSidebarData?.name || "Tool"}
            </span>
          </div>
          <button
            onClick={() => setIsLogoSidebarOpen(false)}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#23b5b5]/10 rounded-xl transition-all duration-300"
          >
            <MoveUpRight size={20} />
          </button>
        </div>

        <div className="h-full text-white flex flex-col overflow-hidden">
          {!signedInServices ||
          !signedInServices[logoSidebarData?.name?.toLowerCase()] ? (
            // Enhanced Sign-in UI
            <div className="p-6 flex flex-col items-center justify-center flex-1">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#23b5b5]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <div className="text-3xl">{logoSidebarData?.icon}</div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
                <p className="text-gray-400">Sign in to unlock all features</p>
              </div>
              <button
                onClick={() => handleSignIn(logoSidebarData?.name)}
                className="w-full bg-gradient-to-r from-[#23b5b5] to-[#1a9999] px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#23b5b5]/30"
              >
                Sign in to continue
              </button>
            </div>
          ) : (
            // Enhanced Post Sign-in UIs
            <>
              {logoSidebarData?.name?.toLowerCase() === "youtube" ? (
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">
                    Create YouTube Content
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter topic to create content..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-900 border border-[#23b5b5]/20 focus:border-[#23b5b5] focus:outline-none transition-colors duration-300"
                    />
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => handleGenerate("video")}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                      >
                        🎥 Create Video
                      </button>
                      <button
                        onClick={() => handleGenerate("short")}
                        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                      >
                        📱 Create Short
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Enhanced WhatsApp Chat UI
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-[#23b5b5]/20">
                    <h2 className="text-xl font-bold">Ask me anything</h2>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {messages &&
                      messages.map((msg, idx) => (
                        <div key={idx} className="space-y-2">
                          {msg.user && (
                            <div className="flex justify-end">
                              <div className="bg-gradient-to-r from-[#23b5b5] to-[#1a9999] p-3 rounded-2xl max-w-[80%]">
                                <p className="text-white">{msg.user}</p>
                              </div>
                            </div>
                          )}
                          {msg.bot && (
                            <div className="flex justify-start">
                              <div className="bg-gray-800 border border-[#23b5b5]/20 p-3 rounded-2xl max-w-[80%]">
                                <p className="text-white">{msg.bot}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Enhanced Fixed Input Bar */}
                  <div className="p-6 border-t border-[#23b5b5]/20 bg-black/50">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-1 p-4 rounded-xl bg-gray-900 border border-[#23b5b5]/20 focus:border-[#23b5b5] focus:outline-none transition-colors duration-300"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-[#23b5b5] to-[#1a9999] px-6 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #23b5b5;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1a9999;
        }
      `}</style>
    </div>
  );
};

export default Toolbar;
