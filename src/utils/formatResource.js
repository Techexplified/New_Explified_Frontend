// utils/formatResource.js
export const formatResource = (url) => {
  try {
    const { hostname, pathname } = new URL(url);

    // Example: https://www.giftgujarat.in/key-attractions
    // hostname = www.giftgujarat.in
    // pathname = /key-attractions

    // Clean www.
    const domain = hostname.replace("www.", "");

    // Extract site name (you can refine this as needed)
    const siteName = domain.split(".")[0]; // e.g., giftgujarat

    // Format path
    const shortPath = pathname.length > 1 ? pathname : "";

    return {
      domain,
      siteName: siteName.charAt(0).toUpperCase() + siteName.slice(1),
      shortUrl: `${domain}${shortPath}`,
    };
  } catch (error) {
    console.log(error);

    return { domain: url, siteName: "", shortUrl: url };
  }
};
