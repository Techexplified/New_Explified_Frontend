// client/src/lib/generator.js
export function localHeuristicGenerate(prompt, slideCount = 6, tone = "Neutral") {
  const text = (prompt || "").trim();
  if (!text) return [];

  const sentences = text
    .replace(/\n+/g, ". ")
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks = sentences.length ? sentences : text.split(/[,;—-]/).map((s) => s.trim()).filter(Boolean);

  const ideas = [];
  chunks.forEach((c) => {
    const clauses = c.split(/[,;:()\-–—]/).map((s) => s.trim()).filter(Boolean);
    clauses.forEach((cl) => {
      const cleaned = cl.replace(/^[\s\W]+|[\s\W]+$/g, "");
      if (cleaned.length > 3) ideas.push(cleaned);
    });
  });

  if (ideas.length === 0) ideas.push(text.slice(0, 80));
  const contentSlides = Math.max(1, slideCount - 1);
  const buckets = Array.from({ length: contentSlides }, () => []);
  let i = 0;
  for (const idea of ideas) {
    buckets[i % contentSlides].push(idea);
    i++;
  }
  buckets.forEach((b, idx) => {
    if (!b.length) b.push(ideas[idx] || ideas[0] || text);
  });

  const slides = [];
  const title = (ideas[0] || text).split(/\s+/).slice(0, 6).join(" ");
  slides.push({
    title: title.length > 40 ? title.slice(0, 37) + "..." : title,
    bullets: [],
    body_text: text.length > 140 ? text.slice(0, 137) + "..." : text,
    speaker_notes: `Generated (local heuristic) from: ${text.slice(0, 200)}`,
    image_query: (ideas[0] || text).split(/\s+/).slice(0, 3).join(" "),
  });

  buckets.forEach((b) => {
    const bullets = b
      .map((it) => it.replace(/\s+/g, " ").trim())
      .map((t) => (t.length > 80 ? t.slice(0, 77) + "..." : t))
      .slice(0, 6);
    slides.push({
      title: bullets[0]?.split(/\s+/).slice(0, 5).join(" ") || "Point",
      bullets,
      body_text: "",
      speaker_notes: "",
      image_query: bullets[0]?.split(/\s+/).slice(0, 3).join(" "),
    });
  });

  if (slides.length > slideCount) slides.length = slideCount;
  while (slides.length < slideCount) {
    slides.push({
      title: "More",
      bullets: ["Add more content here"],
      body_text: "",
      speaker_notes: "",
      image_query: "abstract",
    });
  }
  return slides;
}
