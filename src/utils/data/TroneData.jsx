import { AiOutlineOpenAI } from "react-icons/ai";
import { RiAnthropicFill, RiGeminiLine } from "react-icons/ri";
import GrokLogo from "../../assets/logos/grok.svg";
import GeminiLogo from "../../assets/logos/gemini.png";
import ChatGPT from "../../assets/logos/openai.png";
// import CohereLogo from "../../assets/logos/cohere.svg";
import CohereLogo from "../../assets/logos/cohere-color.png";
// import MistralLogo from "../../assets/logos/mistral.svg";
import MistralLogo from "../../assets/logos/mistral-color.png";
import Google from "../../assets/logos/google.png";
import Anthropic from "../../assets/logos/anthropic.png";
import { SiOpenai } from "react-icons/si";
import { FiZap } from "react-icons/fi";

export const INTEGRATION_PROVIDERS = [
  {
    id: "gemini",
    name: "Gemini",
    // icon: <RiGeminiLine className="text-white" size={20} />,
    icon: <img src={GeminiLogo} alt="Grok" className="w-6 h-6" />,
    byok: true,
    description: "Google's Gemini models for text, chat and multimodal tasks.",
    dropdown: ["Gemini 2.5 Lite", "Gemini 1.5", "Gemini Nano"],
    apiUrl: "https://generativelanguage.googleapis.com/v1beta/", // Google AI Studio API
    docs: "https://ai.google.dev/gemini-api/docs",
  },
  {
    id: "openai",
    name: "OpenAI",
    icon: <SiOpenai className="text-teal-500" size={20} />,

    // icon: <img src={ChatGPT} alt="Grok" className="w-6 h-6" />,
    byok: true,
    description: "OpenAI GPT models for powerful text and chat experiences.",
    dropdown: ["GPT-5 nano", "GPT-4o", "GPT-3.5", "GPT-3"],
    apiUrl: "https://api.openai.com/v1/",
    docs: "https://platform.openai.com/docs/api-reference",
  },
  {
    id: "grok",
    name: "Grok",
    // icon: <img src={GrokLogo} alt="Grok" className="w-6 h-6" />,
    // icon: FiZap,
    icon: <img src={GrokLogo} alt="Grok" className="w-6 h-6" />,
    byok: true,
    description: "xAI Grok models for reasoning and fast responses.",

    dropdown: ["Grok 3 Mini"],
    apiUrl: "https://api.x.ai/v1/", // xAI Grok API
    docs: "https://docs.x.ai/api",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: <RiAnthropicFill className="text-orange-600" size={20} />,
    // icon: <img src={Anthropic} alt="Grok" className="w-6 h-6" />,
    byok: true,
    description: "Claude models by Anthropic for safe, helpful outputs.",
    dropdown: ["Claude Haiku 4.5", "Claude 3 Opus", "Claude Instant"],
    apiUrl: "https://api.anthropic.com/v1/",
    docs: "https://docs.anthropic.com/claude/reference",
  },
  {
    id: "mistral",
    name: "Mistral",
    icon: <img src={MistralLogo} alt="Grok" className="w-6 h-6" />,
    byok: true,
    description: "Mistral small, medium and mixtral models.",
    dropdown: ["Grok 3 Mini"],
    apiUrl: "https://api.mistral.ai/v1/",
    docs: "https://docs.mistral.ai/",
  },
  {
    id: "cohere",
    name: "Cohere",
    icon: <img src={CohereLogo} alt="Grok" className="w-6 h-6" />,
    byok: true,
    description: "Cohere Command and Embed models for text and vectors.",
    dropdown: ["Grok 3 Mini"],
    apiUrl: "https://api.cohere.ai/v1/",
    docs: "https://docs.cohere.com/docs",
  },
];
export const PROVIDER_DOC_URL = {
  gemini: "https://ai.google.dev/",
  openai: "https://platform.openai.com/",
  grok: "https://x.ai/",
  anthropic: "https://console.anthropic.com/",
  mistral: "https://console.mistral.ai/",
  cohere: "https://dashboard.cohere.com/",
};
export const PROVIDER_HELP_STEPS = {
  gemini: [
    "Go to Google AI Studio and sign in with your Google account.",
    "Create or open a project.",
    "Navigate to API keys from the left menu.",
    "Click 'Create API key' and copy the generated key.",
  ],
  openai: [
    "Go to OpenAI Platform and sign in.",
    "Open the 'View API keys' page from your profile.",
    "Click 'Create new secret key'.",
    "Copy the key. You won’t be able to see it again.",
  ],
  grok: [
    "Visit xAI (Grok) and sign in.",
    "Open the API dashboard.",
    "Create a new API key.",
    "Copy and store your key securely.",
  ],
  anthropic: [
    "Go to Anthropic Console and sign in.",
    "Open 'API Keys' in the left navigation.",
    "Click 'Create Key'.",
    "Copy your new Claude API key.",
  ],
  mistral: [
    "Open Mistral Console and log in.",
    "Go to 'API Keys'.",
    "Generate a new API key.",
    "Copy your key for use here.",
  ],
  cohere: [
    "Go to Cohere Dashboard and sign in.",
    "Open 'API Keys'.",
    "Create a new key if you don’t have one.",
    "Copy the key to your clipboard.",
  ],
};
export const tools = [
  "default",
  "gemini",
  "openai",
  "grok",
  "anthropic",
  "mistral",
  "cohere",
];

export const formatText = (text) => {
  if (!text) return "";

  return (
    text
      // Handle code blocks (```code```)
      .replace(
        /```([\s\S]*?)```/g,
        "<pre style=\"background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%); padding: 16px; border-radius: 12px; margin: 12px 0; overflow-x: auto; border: 1px solid rgba(255,255,255,0.1); box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);\"><code style=\"font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace; font-size: 0.9em; line-height: 1.4;\">$1</code></pre>"
      )
      // Handle inline code (`code`)
      .replace(
        /`([^`]+)`/g,
        "<code style=\"background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%); padding: 3px 8px; border-radius: 6px; font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace; font-size: 0.9em; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 1px 2px rgba(0,0,0,0.2);\">$1</code>"
      )
      // Handle bold text (**text** or __text__)
      .replace(
        /\*\*(.*?)\*\*/g,
        "<strong style='font-weight: 600; color: rgba(255,255,255,0.95);'>$1</strong>"
      )
      .replace(
        /__(.*?)__/g,
        "<strong style='font-weight: 600; color: rgba(255,255,255,0.95);'>$1</strong>"
      )
      // Handle italic text (*text* or _text_)
      .replace(
        /\*(.*?)\*/g,
        "<em style='font-style: italic; color: rgba(255,255,255,0.9);'>$1</em>"
      )
      .replace(
        /_(.*?)_/g,
        "<em style='font-style: italic; color: rgba(255,255,255,0.9);'>$1</em>"
      )
      // Handle numbered lists
      .replace(
        /^\d+\.\s+(.+)$/gm,
        '<div style="margin: 6px 0; padding-left: 16px; position: relative;"><span style="position: absolute; left: 0; color: #23b5b5; font-weight: 600;">•</span> $1</div>'
      )
      // Handle bullet points
      .replace(
        /^[-•*]\s+(.+)$/gm,
        '<div style="margin: 6px 0; padding-left: 16px; position: relative;"><span style="position: absolute; left: 0; color: #23b5b5; font-weight: 600;">•</span> $1</div>'
      )
      // Handle line breaks
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>")
  );
};
