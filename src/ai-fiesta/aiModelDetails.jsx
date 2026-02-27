import { SiOpenai, SiGooglegemini, SiPerplexity } from "react-icons/si";
import { GiDragonHead } from "react-icons/gi";
import { FaBrain } from "react-icons/fa";

export const aiModelDetails = [
  {
    id: "explii",
    name: "Explii",
    desc: "Your personal intelligent AI model",
    dropdown: ["Explii Core", "Explii Turbo", "Explii Vision"],
    current: "Explii Core",
    icon: <FaBrain className="text-purple-500" size={22} />,
    locked: false,
    active: true, // default active model
  },
  {
    id: "openai",
    name: "ChatGPT",
    desc: "OpenAI’s most capable model",
    dropdown: ["GPT-5 nano", "GPT-4o", "GPT-3.5", "GPT-3"],
    current: "GPT-5 nano",
    icon: <SiOpenai className="text-teal-500" size={22} />,
    locked: false,
  },
  {
    id: "gemini",
    name: "Gemini",
    desc: "Google’s multimodal AI model",
    dropdown: ["Gemini 2.5 Lite", "Gemini 1.5", "Gemini Nano"],
    current: "Gemini 2.5 Lite",
    icon: <SiGooglegemini className="text-indigo-400" size={22} />,
    locked: false,
  },
  {
    id: "llama",
    name: "Meta Llama",
    desc: "Meta's open source AI model",
    dropdown: ["Llama 4 Maverick"],
    current: "Llama 4 Maverick",
    icon: <span className="font-extrabold text-blue-500">M</span>,
    locked: false,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    desc: "AI-powered search and reasoning",
    dropdown: ["Perplexity Sonar"],
    current: "Perplexity Sonar",
    icon: <SiPerplexity className="text-sky-500" size={22} />,
    locked: false,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    desc: "Anthropic’s advanced AI assistant",
    dropdown: ["Claude Haiku 4.5", "Claude 3 Opus", "Claude Instant"],
    current: "Claude Haiku 4.5",
    icon: <span className="font-bold text-orange-600">A</span>,
    locked: false,
  },
  {
    id: "grok",
    name: "Grok",
    desc: "xAI’s conversational AI",
    dropdown: ["Grok 3 Mini"],
    current: "Grok 3 Mini",
    icon: <span className="font-extrabold text-black">G</span>,
    locked: false,
  },
  {
    id: "qwen",
    name: "Qwen",
    desc: "Alibaba's advanced LLM",
    dropdown: ["Qwen 2.5", "Qwen 2"],
    current: "Qwen 2.5",
    icon: <span className="font-extrabold text-blue-600">Q</span>,
    locked: false,
  },
];
