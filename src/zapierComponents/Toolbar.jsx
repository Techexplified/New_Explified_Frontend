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
import { useNavigate } from 'react-router-dom';
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
  const [query, setQuery] = useState('');
  // Logo details sidebar state
  const [isLogoSidebarOpen, setIsLogoSidebarOpen] = useState(false);
  const [logoSidebarData, setLogoSidebarData] = useState({ name: "", icon: null });
  const navigate = useNavigate();
  // Flatten all tools for search
  const allTools = Object.values(categorizedTools).flat();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi User 👋 I can answer most questions about building workflows in n8n." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userNumber, setUserNumber] = useState("");
  const [chatInput, setChatInput] = useState("");
  
  const accountSid = import.meta.env.TWILIO_ACCOUNT_SID; // Replace with your Twilio Account SID
  const authToken = import.meta.env.TWILIO_AUTH_TOKEN;   // Replace with your Twilio Auth Token
  const fromNumber = import.meta.env.TWILIO_FROM_NUMBER;   // Your Twilio WhatsApp number
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
            contents: [
              { role: "user", parts: [{ text: input }] }
            ]
          })
        }
      );

      const data = await response.json();
      const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";

      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Error fetching AI response." }]);
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
          left: window.innerWidth / 2 - 60,
          top: 160,
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
      prev.map((box) => (box.id === boxId ? { ...box, icon: tool.icon, name: tool.name } : box))
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
        intersectionY = endCenter.y - (halfWidth * unitY) / (Math.abs(unitX) || 1);
      } else {
        intersectionX = endBox.left + boxWidth;
        intersectionY = endCenter.y + (halfWidth * unitY) / (Math.abs(unitX) || 1);
      }
    } else {
      // hit top or bottom
      if (dy > 0) {
        intersectionY = endBox.top;
        intersectionX = endCenter.x - (halfHeight * unitX) / (Math.abs(unitY) || 1);
      } else {
        intersectionY = endBox.top + boxHeight;
        intersectionX = endCenter.x + (halfHeight * unitX) / (Math.abs(unitY) || 1);
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
      const REDIRECT_URI =
        "http://localhost:5173/api/youtube/oauth2callback";

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
    const CLIENT_ID = "1080089039501-2rkku1lknn3d0ukj3a3oh8hi3rg496hl.apps.googleusercontent.com";
    const REDIRECT_URI = "http://localhost:5173/api/youtube/oauth2callback";

    const SCOPE = [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly"
    ].join(" ");

    const redirectPath = `/result2?query=${encodeURIComponent(modifiedQuery)}&duration=${duration}&type=${type}`;
    sessionStorage.setItem("postAuthRedirect", redirectPath);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=token&scope=${encodeURIComponent(SCOPE)}&prompt=consent&state=${encodeURIComponent(redirectPath)}`;

    window.location.href = authUrl;
  } else {
    navigate(`/result2?query=${encodeURIComponent(modifiedQuery)}&duration=${duration}&type=${type}`);
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
          contents: [{ parts: [{ text: chatInput }] }]
        })
      }
    );

    const geminiData = await geminiRes.json();
    let replyText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

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
          "Authorization": "Basic " + btoa(`${accountSid}:${authToken}`),
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: `whatsapp:+${userNumber}`,
          Body: replyText
        })
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
      className={`relative w-full h-screen ${selectedTool === "arrow" ? "cursor-crosshair" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={(e) => {
        // Close activeBox dropdown only when clicking the canvas background
        if (e.target === e.currentTarget) {
          setActiveBoxId(null);
        }
      }}
    >
      {/* Empty Canvas Placeholder */}
      {boxes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center ml-10  z-30">
          <div
            className="w-[120px] h-[100px] border-2 border-dashed border-minimal-primary rounded-md flex items-center justify-center cursor-pointer hover:border-minimal-primary/80 hover:bg-minimal-dark-100/20 transition-all duration-200"
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
            <Plus size={48} className="text-minimal-primary" />
          </div>
        </div>
      )}

      {/* Hugging Face API interface positioned above the current box */}
      {showApiInterface && shouldShowApiInterface && currentBox && (
        <div
          className="absolute z-50"
          style={{
            left: `${currentBox.left + 60}px`,
            top: `${(currentBox.top || 160) - 12}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <HuggingFaceApiInterface setShowApiInterface={setShowApiInterface} />
        </div>
      )}

      {/* Render Boxes */}
      {boxes.map((box) => (
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
            className={`absolute w-[120px] h-[100px] bg-gradient-to-r from-minimal-dark-100 to-minimal-dark-200 border-2 border-minimal-primary rounded-md z-40 ${
              selectedTool === "arrow" ? "cursor-crosshair" : draggedBoxId === box.id ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              left: "32px",
              top: "32px",
            }}
            onMouseDown={(e) => handleBoxMouseDown(e, box.id)}
            onClick={(e) => {
              // Stop the click from bubbling to canvas and handle box click
              e.stopPropagation();
              handleBoxClick(e, box.id);
            }}
          >
            {/* Icon / placeholder */}
            {box.icon ? (
              // if icon exists, clicking it opens the logo sidebar
              <div
                className="w-full h-full flex items-center justify-center text-4xl text-minimal-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setLogoSidebarData({ name: box.name || "Selected Logo", icon: box.icon });
                  setIsLogoSidebarOpen(true);
                  setActiveBoxId(null); // close search when opening logo sidebar
                }}
              >
                {box.icon}
              </div>
            ) : (
              // if no icon, this placeholder doesn't intercept clicks so parent box click opens search
              <div className="w-full h-full flex items-center justify-center text-4xl text-minimal-white">
                <Square size={48} />
              </div>
            )}
          </div>

          {/* Side Dots - Only show when hovering */}
          {hoveredBoxId === box.id && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateBoxFromSide(box.id, "top");
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-minimal-gray-300 opacity-15 rounded-full hover:bg-minimal-primary transition-colors duration-200 z-50"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateBoxFromSide(box.id, "bottom");
                }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-minimal-gray-300 opacity-15 rounded-full hover:bg-minimal-primary transition-colors duration-200 z-50"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateBoxFromSide(box.id, "left");
                }}
                className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-minimal-gray-300 opacity-15 rounded-full hover:bg-minimal-primary transition-colors duration-200 z-50"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateBoxFromSide(box.id, "right");
                }}
                className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 bg-minimal-gray-300 opacity-15 rounded-full hover:bg-minimal-primary transition-colors duration-200 z-50"
              />
            </>
          )}
        </div>
      ))}

      {/* Render Arrows */}
      {arrows.map((arrow) => (
        <svg key={arrow.id} className="absolute inset-0 pointer-events-none z-30" style={{ width: "100%", height: "100%" }}>
          <defs>
            <marker id={`arrowhead-${arrow.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#23B5B5" stroke="#23B5B5" />
            </marker>
          </defs>
          <line x1={arrow.startX} y1={arrow.startY} x2={arrow.endX} y2={arrow.endY} stroke="#23B5B5" strokeWidth="3" markerEnd={`url(#arrowhead-${arrow.id})`} />
        </svg>
      ))}

      {/* Temporary arrow while drawing */}
      {isDrawingArrow && (
        <svg className="absolute inset-0 pointer-events-none z-30" style={{ width: "100%", height: "100%" }}>
          <defs>
            <marker id="temp-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#23B5B5" stroke="#23B5B5" />
            </marker>
          </defs>
          <line x1={arrowStart.x} y1={arrowStart.y} x2={currentMousePos.x} y2={currentMousePos.y} stroke="#23B5B5" strokeWidth="3" markerEnd="url(#temp-arrowhead)" strokeDasharray="5,5" />
        </svg>
      )}

      {/* Search Sidebar (tool picker) - rendered relative to activeBox */}
      {activeBox && (
        <div
          className="absolute left-full top-0 ml-4 w-64 max-h-[300px] p-3 bg-minimal-dark-100/90 backdrop-blur-sm rounded-xl shadow-xl border border-minimal-primary z-50"
          style={{
            left: `${activeBox.left + 120}px`,
            top: `${activeBox.top || 160}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            placeholder="🔍 Search tools..."
            className="w-full mb-3 px-3 py-2 text-sm border border-minimal-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-minimal-primary transition-all"
            style={{
              backgroundColor: "rgba(26, 26, 26, 0.8)",
              color: "#e2e8f0",
              fontWeight: "500",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="max-h-48 overflow-y-auto space-y-2 stylish-scrollbar">
            {allTools
              .filter((tool) => tool.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => handleSelectToolIcon(activeBoxId, tool)}
                  className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-minimal-cardHover/50 text-minimal-white text-sm border border-minimal-border"
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span>{tool.name}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Floating Toolbar */}
      <div className="fixed bottom-8 left-[46%] transform -translate-x-1/5 z-50">
        <div className="bg-minimal-card/80 backdrop-blur-xl border border-minimal-primary/50 rounded-2xl p-2 flex items-center gap-2 shadow-2xl shadow-minimal-primary/20 relative">
          {["square", "arrow", "ai-stars"].map((tool) => (
            <button
              key={tool}
              onClick={() => handleToolClick(tool)}
              className={`relative rounded-xl font-medium text-sm transition-all duration-300 ease-out w-12 h-12 flex items-center justify-center gap-2 group overflow-hidden ${
                selectedTool === tool
                  ? "bg-gradient-to-r from-minimal-primary to-minimal-gray-600 text-minimal-white shadow-lg shadow-minimal-primary/25 scale-105"
                  : "text-minimal-muted hover:text-minimal-white hover:bg-minimal-cardHover/50"
              }`}
            >
              <span className="text-4xl relative z-10 p-1">
                {tool === "square" ? <Square /> : tool === "arrow" ? <MoveUpRight /> : <Sparkles />}
              </span>

              {selectedTool === tool && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-minimal-primary to-minimal-gray-600 opacity-20 animate-pulse" />}
            </button>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-minimal-primary/10 to-minimal-gray-600/10 rounded-2xl blur-3xl -z-30 animate-pulse" />
      </div>

      {/* AI Chatbot Sidebar */}
      <div
      className={`fixed top-30 right-0 h-[600px] w-80 bg-minimal-dark-100 border-y border-l rounded-l-lg border-minimal-primary/50 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isAIChatbotOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-minimal-primary/30">
        <div className="flex items-center gap-2">
          <Sparkles className="text-minimal-primary" size={20} />
          <span className="text-minimal-white font-medium">AI Assistant</span>
        </div>
        <button
          onClick={() => setIsAIChatbotOpen(false)}
          className="text-minimal-muted hover:text-minimal-white transition-colors"
        >
          <MoveUpRight size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="p-4 min-h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg max-w-[90%] ${
                msg.role === "assistant"
                  ? "bg-minimal-dark-200 text-minimal-white self-start"
                  : "bg-minimal-primary text-white self-end"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="text-minimal-muted text-sm">Thinking...</div>
          )}
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-minimal-primary/30 mb-[150px]">
  <div className="flex items-center gap-2 p-3 bg-minimal-dark-200 rounded-lg border border-minimal-primary/30">
    <input
      type="text"
      placeholder="Type your message..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="flex-1 text-minimal-white placeholder-minimal-muted outline-none"
      onKeyDown={(e) => e.key === "Enter" && handleSend()}
    />
    <button
      className="text-minimal-primary hover:text-minimal-white transition-colors"
      onClick={handleSend}
      disabled={loading}
    >
      <MoveUpRight size={18} />
    </button>
  </div>
</div>

      </div>
    </div>

      {/* Logo Details Sidebar */}
      <div
  className={`fixed top-30 right-0 min-h-[600px] w-80 bg-minimal-dark-100 border-y border-l rounded-l-lg border-minimal-primary/50 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-in-out ${
    isLogoSidebarOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  <div className="flex items-center justify-between p-4 border-b border-minimal-primary/30">
    <div className="flex items-center gap-2">
      {logoSidebarData.icon}
      <span className="text-minimal-white font-medium">{logoSidebarData.name}</span>
    </div>
    <button
      onClick={() => setIsLogoSidebarOpen(false)}
      className="text-minimal-muted hover:text-minimal-white transition-colors"
    >
      <MoveUpRight size={20} />
    </button>
  </div>

  <div className="right-0 top-0 w-80 h-screen bg-gray-900 text-white flex flex-col">
  {!signedInServices[logoSidebarData.name.toLowerCase()] ? (
    // ===================== SIGN-IN UI =====================
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Sign in</h2>
      <button
        onClick={() => handleSignIn(logoSidebarData.name)}
        className="bg-green-500 px-4 py-2 rounded"
      >
        Sign in to use features
      </button>
      <p className="text-minimal-white/80 text-sm mt-4">
        Sign up to use the features
      </p>
    </div>
  ) : (
    // ===================== POST SIGN-IN UIs =====================
    <>
      {/* YOUTUBE UI */}
      {logoSidebarData.name.toLowerCase() === "youtube" ? (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Create YouTube Content</h2>
          <input
            type="text"
            placeholder="Enter topic to create content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleGenerate("video")}
              className="bg-blue-500 px-4 py-2 rounded"
            >
              Create Video
            </button>
            <button
              onClick={() => handleGenerate("short")}
              className="bg-green-500 px-4 py-2 rounded"
            >
              Create Short
            </button>
          </div>
        </div>
      ) : (
        // WHATSAPP CHAT UI
        <>
          <h2 className="text-lg font-bold p-4">Ask me anything</h2>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 pb-24 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-2">
                {msg.user && <p className="text-blue-300">You: {msg.user}</p>}
                {msg.bot && <p className="text-green-300">Bot: {msg.bot}</p>}
              </div>
            ))}
          </div>

          {/* Fixed Input Bar */}
          <div className="absolute bottom-0 w-full flex gap-2 bg-gray-900 p-2 border-t border-gray-700">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 p-2 rounded bg-gray-800 h-[60px]"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 px-4 py-2 rounded h-[60px]"
            >
              Send
            </button>
          </div>
        </>
      )}
    </>
  )}
</div>
</div>


      </div>
    

  );
};

export default Toolbar;
