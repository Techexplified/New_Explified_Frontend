import { AiOutlineOpenAI } from "react-icons/ai";
import { RiAnthropicFill, RiGeminiLine } from "react-icons/ri";
import GrokLogo from "../../assets/logos/grok.svg";
import CohereLogo from "../../assets/logos/cohere.svg";
import MistralLogo from "../../assets/logos/mistral.svg";

export const INTEGRATION_PROVIDERS = [
  {
    id: "gemini",
    name: "Gemini",
    icon: <RiGeminiLine className="text-white" size={20} />,
    byok: true,
    description: "Google's Gemini models for text, chat and multimodal tasks.",
    apiUrl: "https://generativelanguage.googleapis.com/v1beta/", // Google AI Studio API
    docs: "https://ai.google.dev/gemini-api/docs",
  },
  {
    id: "openai",
    name: "OpenAI",
    icon: <AiOutlineOpenAI className="text-white" size={20} />,
    // icon: AiOutlineOpenAI,
    byok: true,
    description: "OpenAI GPT models for powerful text and chat experiences.",
    apiUrl: "https://api.openai.com/v1/",
    docs: "https://platform.openai.com/docs/api-reference",
  },
  {
    id: "grok",
    name: "Grok",
    icon: <img src={GrokLogo} alt="Grok" className="w-5 h-5" />,
    // icon: FiZap,
    byok: true,
    description: "xAI Grok models for reasoning and fast responses.",
    apiUrl: "https://api.x.ai/v1/", // xAI Grok API
    docs: "https://docs.x.ai/api",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: <RiAnthropicFill className="text-white" size={20} />,
    // icon: RiAnthropicFill,
    byok: true,
    description: "Claude models by Anthropic for safe, helpful outputs.",
    apiUrl: "https://api.anthropic.com/v1/",
    docs: "https://docs.anthropic.com/claude/reference",
  },
  {
    id: "mistral",
    name: "Mistral",
    icon: <img src={MistralLogo} alt="Grok" className="w-5 h-5" />,
    byok: true,
    description: "Mistral small, medium and mixtral models.",
    apiUrl: "https://api.mistral.ai/v1/",
    docs: "https://docs.mistral.ai/",
  },
  {
    id: "cohere",
    name: "Cohere",
    icon: <img src={CohereLogo} alt="Grok" className="w-5 h-5" />,
    byok: true,
    description: "Cohere Command and Embed models for text and vectors.",
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
