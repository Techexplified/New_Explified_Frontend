import { Download } from "lucide-react";
import {
  FaGoogleDrive,
  FaInstagram,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

/* ---------- Reusable Tooltip Button ---------- */
function TooltipButton({ children, label, onClick, href, download }) {
  const content = (
    <button
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-gray-200 shadow hover:bg-neutral-800"
    >
      {children}

      {/* Tooltip */}
      <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1">
        {label}
      </span>
    </button>
  );

  if (href) {
    return (
      <a href={href} download={download} className="group relative">
        {content}
      </a>
    );
  }

  return <div className="group relative">{content}</div>;
}

/* ---------- Main Component ---------- */
function DownloadButtons({ url }) {
  const shareToWhatsApp = () => {
    if (url) {
      window.open(`https://wa.me/?text=Check this GIF! ${url}`, "_blank");
    }
  };

  const shareToX = () => {
    if (url) {
      window.open(
        `https://twitter.com/intent/tweet?text=Check this GIF!&url=${url}`,
        "_blank",
      );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <TooltipButton label="Download" href={url} download="my-gif.gif">
        <Download className="h-5 w-5" />
      </TooltipButton>

      <TooltipButton label="WhatsApp" onClick={shareToWhatsApp}>
        <FaWhatsapp className="h-5 w-5 text-green-500" />
      </TooltipButton>

      <TooltipButton label="Twitter / X" onClick={shareToX}>
        <FaXTwitter className="h-5 w-5 text-white" />
      </TooltipButton>

      <TooltipButton
        label="Google Drive"
        onClick={() =>
          window.open("https://drive.google.com/drive/my-drive", "_blank")
        }
      >
        <FaGoogleDrive className="h-5 w-5 text-yellow-500" />
      </TooltipButton>

      <TooltipButton
        label="YouTube Upload"
        onClick={() => window.open("https://studio.youtube.com/", "_blank")}
      >
        <FaYoutube className="h-5 w-5 text-red-600" />
      </TooltipButton>

      <TooltipButton
        label="Instagram"
        onClick={() => window.open("https://www.instagram.com/", "_blank")}
      >
        <FaInstagram className="h-5 w-5 text-pink-500" />
      </TooltipButton>
    </div>
  );
}

export default DownloadButtons;
