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
      <a href={url} download="my-gif.gif">
        <button className="text-2xl">
          <Download />
        </button>
      </a>
      <button onClick={shareToWhatsApp} className="text-green-500 text-2xl">
        <FaWhatsapp />
      </button>
      <button onClick={shareToX} className="text-white text-2xl">
        <FaXTwitter />
      </button>
      <button onClick={openGoogleDrive} className="text-yellow-500 text-2xl">
        <FaGoogleDrive />
      </button>
      <button onClick={openYouTubeUpload} className="text-red-600 text-2xl">
        <FaYoutube />
      </button>
      <button onClick={openInstagram} className="text-pink-500 text-2xl">
        <FaInstagram />
      </button>
    </div>
  );
}

export default DownloadButtons;
