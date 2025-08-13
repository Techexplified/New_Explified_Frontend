import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";          // optional icon

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Breadcrumbs() {
  const { pathname } = useLocation();

  // break the path into segments → ["socials", "instagram", "posts"]
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="mb-2 flex items-center text-sm text-white space-x-1">
      {/* Home / root crumb */}
      
      {segments.map((segment, idx) => {
        const route = "/" + segments.slice(0, idx + 1).join("/");
        const isLast = idx === segments.length - 1;

        return (
          <span key={route} className="flex items-center space-x-1">
            {/* separator */}
            

            {isLast ? (
              <span className="font-semibold">{capitalize(segment)}</span>
            ) : (
              <Link to={route} className="text-teal-400 hover:underline">
                {capitalize(segment)}
              </Link>
            )}
            <ChevronRight className="w-3 h-3 text-gray-500" />
          </span>
        );
      })}
    </nav>
  );
}
