import { Download } from "lucide-react";
import {
  FaGoogleDrive,
  FaInstagram,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

function DownloadButtons({ url }) {
  const shareToWhatsApp = () => {
    if (url) {
      const whatsappUrl = `https://wa.me/?text=Check this GIF! ${url}`;
      window.open(whatsappUrl, "_blank");
    }
  };
  const shareToX = () => {
    if (url) {
      const twitterUrl = `https://twitter.com/intent/tweet?text=Check this GIF!&url=${url}`;
      window.open(twitterUrl, "_blank");
    }
  };
  const openInstagram = () => {
    window.open("https://www.instagram.com/", "_blank");
  };
  const openGoogleDrive = () => {
    window.open("https://drive.google.com/drive/my-drive", "_blank");
  };
  const openYouTubeUpload = () => {
    window.open("https://studio.youtube.com/", "_blank");
  };
  return (
    <div className="flex flex-col gap-2">
      <a href={url} download="my-gif.gif" className="group">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-gray-200 shadow hover:bg-neutral-800">
          <Download className="h-5 w-5" />
        </button>
      </a>
      <button
        onClick={shareToWhatsApp}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-green-500 shadow hover:bg-neutral-800"
      >
        <FaWhatsapp className="h-5 w-5" />
      </button>
      <button
        onClick={shareToX}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-white shadow hover:bg-neutral-800"
      >
        <FaXTwitter className="h-5 w-5" />
      </button>
      <button
        onClick={openGoogleDrive}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-yellow-500 shadow hover:bg-neutral-800"
      >
        <FaGoogleDrive className="h-5 w-5" />
      </button>
      <button
        onClick={openYouTubeUpload}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-red-600 shadow hover:bg-neutral-800"
      >
        <FaYoutube className="h-5 w-5" />
      </button>
      <button
        onClick={openInstagram}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-pink-500 shadow hover:bg-neutral-800"
      >
        <FaInstagram className="h-5 w-5" />
      </button>
    </div>
  );
}

export default DownloadButtons;
