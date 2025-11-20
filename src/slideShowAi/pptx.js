// client/src/pptx.js
import PptxGenJS from "pptxgenjs";
import jsPDF from "jspdf";

/**
 * slides: array of
 *  { title, bullets: [string], body_text, speaker_notes, imageData, image_query, layout, accentColor, designStyle, tone, polish }
 * filename: string
 */

/* ------------------ existing PPTX exporter (unchanged logic) ------------------ */
export async function exportSlidesToPptx(slides, filename = `Autodeck-${Date.now()}.pptx`) {
  try {
    if (!slides || !slides.length) throw new Error("No slides provided");

    const pptx = new PptxGenJS();

    // 16:9 layout
    try {
      pptx.defineLayout({ name: "WIDE16x9", width: 13.33, height: 7.5 });
      pptx.layout = "WIDE16x9";
    } catch (e) {}

    pptx.author = "Autodeck AI";
    pptx.company = "Autodeck";

    // Base palettes for tones + style tweaks
    const basePalettes = {
      Professional: { bg: "0b1220", text: "FFFFFF", muted: "cbd5e1", accent: "2563eb" }, // blue corporate
      Educational: { bg: "0b1f24", text: "FFFFFF", muted: "cfeef8", accent: "0891b2" }, // teal academic
      Casual: { bg: "0f1724", text: "FFFFFF", muted: "e6e7e9", accent: "fb923c" }, // orange friendly
      Creative: { bg: "0e1020", text: "FFFFFF", muted: "e9dbff", accent: "d946ef" }, // magenta creative
      Neutral: { bg: "1f1f1f", text: "FFFFFF", muted: "e8e8e8", accent: "7c3aed" },
    };

    // Design style presets (affect spacing, font sizes, extra accent shapes)
    const designStyles = {
      "Corporate Executive": { headingSize: 34, subtitleSize: 16, bulletSize: 18, roundness: 0.6, imageCardTint: 0.08 },
      "Academic Clean": { headingSize: 36, subtitleSize: 14, bulletSize: 18, roundness: 0.3, imageCardTint: 0.06 },
      "Startup Pitch": { headingSize: 42, subtitleSize: 16, bulletSize: 20, roundness: 1.2, imageCardTint: 0.12 },
      "Creative Magazine": { headingSize: 46, subtitleSize: 16, bulletSize: 18, roundness: 1.6, imageCardTint: 0.18 },
      "Minimal": { headingSize: 40, subtitleSize: 14, bulletSize: 18, roundness: 0.2, imageCardTint: 0.05 },
      default: { headingSize: 36, subtitleSize: 14, bulletSize: 18, roundness: 0.6, imageCardTint: 0.1 },
    };

    const toneLayouts = {
      Professional: ["cover", "section", "two-column", "stats", "two-column", "image-full"],
      Educational: ["cover", "section", "two-column", "timeline", "two-column", "image-full"],
      Casual: ["cover", "two-column", "quote", "two-column", "image-full", "two-column"],
      Creative: ["cover", "image-full", "two-column", "quote", "image-full", "two-column"],
      Neutral: ["cover", "two-column", "two-column", "image-full", "stats", "two-column"],
    };

    const normHex = (s) => (String(s || "").replace("#", "") || null);

    function pickPaletteForSlide(slide) {
      const tone = slide?.tone || "Neutral";
      const base = basePalettes[tone] || basePalettes.Neutral;
      if (slide?.accentColor) {
        return { bg: base.bg, text: base.text, muted: base.muted, accent: normHex(slide.accentColor) || base.accent };
      }
      return base;
    }

    function styleForSlide(slide) {
      const styleName = slide?.designStyle || (slide?.tone === "Creative" ? "Creative Magazine" : slide?.tone === "Professional" ? "Corporate Executive" : "Minimal");
      return designStyles[styleName] || designStyles.default;
    }

    function addShapeSafe(slideObj, shapeType, opts = {}) {
      try { slideObj.addShape(shapeType, opts); } catch (e) {}
    }

    const addText = (slideObj, text, opts = {}, pal = { text: "FFFFFF" }) => {
      try {
        slideObj.addText(text, Object.assign({
          fontFace: "Montserrat, Arial",
          color: pal.text,
          margin: 0.06,
        }, opts));
      } catch (e) {}
    };

    for (let i = 0; i < slides.length; i++) {
      const s = slides[i] || {};
      const fallbackLayouts = toneLayouts[s.tone || "Neutral"] || toneLayouts.Neutral;
      const layout = (s.layout || fallbackLayouts[i % fallbackLayouts.length] || (i === 0 ? "cover" : "two-column")).toLowerCase();

      const pal = pickPaletteForSlide(s);
      const palette = { bg: (pal.bg || "1f1f1f").replace("#", ""), text: (pal.text || "FFFFFF").replace("#", ""), muted: (pal.muted || "E8E8E8").replace("#", ""), accent: (pal.accent || "7c3aed").replace("#", "") };
      const style = styleForSlide(s);
      const polish = Boolean(s.polish);

      const slide = pptx.addSlide();
      slide.background = { fill: palette.bg };

      function addSubtleGradient(x, y, w, h, colorHex, steps = 3) {
        try {
          const stepOpacity = 0.06;
          for (let k = 0; k < steps; k++) {
            slide.addShape(pptx.ShapeType.rect, {
              x: x + (k * 0.02),
              y: y + (k * 0.02),
              w: w - (k * 0.04),
              h: h - (k * 0.04),
              fill: { color: colorHex, opacity: Math.min(0.22, stepOpacity * (k + 1)) },
              line: { color: colorHex, width: 0 },
            });
          }
        } catch (e) {}
      }

      function addIconPlaceholder(x, y, size = 0.5, color = palette.accent) {
        try {
          slide.addShape(pptx.ShapeType.oval, { x, y, w: size, h: size, fill: { color, opacity: 0.15 }, line: { color, width: 0 } });
        } catch (e) {}
      }

      if (layout === "cover") {
        addSubtleGradient(0.4, 1.0, 6.4, 3.2, palette.accent, 4);
        addText(slide, s.title || "Title", { x: 0.6, y: 1.0, w: 7.5, h: 2.4, fontSize: style.headingSize + (polish ? 6 : 0), bold: true }, palette);
        if (s.body_text) addText(slide, s.body_text, { x: 0.6, y: 3.2, w: 7.5, h: 1.2, fontSize: style.subtitleSize, color: palette.muted }, palette);
        if (s.imageData) {
          addShapeSafe(slide, pptx.ShapeType.roundRect, { x: 8.05, y: 1.05, w: 4.5, h: 3.6, fill: { color: palette.accent, opacity: style.imageCardTint }, line: { color: palette.bg, width: 0 } });
          try { slide.addImage({ data: s.imageData, x: 8.12, y: 1.12, w: 4.36, h: 3.46, sizing: { type: "cover" } }); } catch (e) {}
        }
        addText(slide, `• ${new Date().getFullYear()} • Autodeck`, { x: 0.6, y: 6.8, w: 12, h: 0.3, fontSize: 10, color: palette.muted }, palette);
        continue;
      }

      if (layout === "section") {
        addText(slide, s.title || "Section Title", { x: 0.6, y: 1.6, w: 11.5, h: 1.6, fontSize: style.headingSize + (polish ? 4 : 0), bold: true }, palette);
        if (s.body_text) addText(slide, s.body_text, { x: 0.6, y: 3.0, w: 11.5, h: 0.9, fontSize: style.subtitleSize, color: palette.muted }, palette);
        addSubtleGradient(0.6, 4.6, 11.0, 1.2, palette.accent, 3);
        continue;
      }

      if (layout === "quote") {
        addDecorativeQuote();
        continue;
      }

      function addDecorativeQuote() {
        addText(slide, "“", { x: 0.6, y: 1.2, w: 2.0, h: 2.0, fontSize: 72, bold: true, color: palette.accent }, palette);
        addText(slide, s.body_text || (s.bullets && s.bullets[0]) || s.title || "Quote", { x: 2.6, y: 1.4, w: 8.6, h: 2.8, fontSize: style.headingSize - 4, color: palette.text }, palette);
        if (s.speaker_notes) addText(slide, `— ${s.speaker_notes}`, { x: 2.6, y: 4.2, w: 8.6, h: 0.5, fontSize: 14, color: palette.muted }, palette);
        return;
      }

      if (layout === "stats") {
        const stats = s.bullets && s.bullets.length ? s.bullets.slice(0, 3) : ["23% Growth", "120+ Customers", "4.8 Rating"];
        const blockW = 3.6;
        for (let k = 0; k < stats.length; k++) {
          const x = 0.6 + k * (blockW + 0.3);
          addShapeSafe(slide, pptx.ShapeType.roundRect, { x, y: 1.1, w: blockW, h: 2.6, fill: { color: palette.accent, opacity: 0.08 }, line: { color: palette.accent, width: 0 } });
          addText(slide, stats[k], { x: x + 0.14, y: 1.3, w: blockW - 0.28, h: 2.2, fontSize: style.headingSize - 4, bold: true, color: palette.text }, palette);
        }
        if (s.title) addText(slide, s.title, { x: 0.6, y: 3.8, w: 11.5, h: 0.8, fontSize: 18, color: palette.muted }, palette);
        continue;
      }

      if (layout === "timeline") {
        const items = s.bullets && s.bullets.length ? s.bullets.slice(0, 5) : ["Phase 1", "Phase 2", "Phase 3"];
        const per = 11.6 / items.length;
        for (let k = 0; k < items.length; k++) {
          const x = 0.6 + k * per;
          addShapeSafe(slide, pptx.ShapeType.oval, { x: x + 0.15, y: 2.2, w: 0.24, h: 0.24, fill: { color: palette.accent, opacity: 0.9 }, line: { color: palette.accent, width: 0 } });
          addText(slide, items[k], { x: x - 0.1, y: 2.6, w: per, h: 0.8, fontSize: 14, color: palette.muted }, palette);
          if (k < items.length - 1) {
            addShapeSafe(slide, pptx.ShapeType.rect, { x: x + 0.4, y: 2.3, w: per - 0.6, h: 0.04, fill: { color: palette.accent, opacity: 0.6 }, line: { color: palette.accent, width: 0 } });
          }
        }
        if (s.title) addText(slide, s.title, { x: 0.6, y: 1.1, w: 11.5, h: 0.8, fontSize: style.subtitleSize + 6, bold: true, color: palette.text }, palette);
        continue;
      }

      if (layout === "image-full") {
        if (s.imageData) {
          try { slide.addImage({ data: s.imageData, x: 0.4, y: 0.5, w: 12.6, h: 5.8, sizing: { type: "cover" } }); } catch (e) {}
          addShapeSafe(slide, pptx.ShapeType.rect, { x: 0.4, y: 4.2, w: 12.6, h: 1.1, fill: { color: palette.bg, opacity: 0.6 }, line: { color: palette.bg, width: 0 } });
          addText(slide, s.title || "", { x: 0.6, y: 4.25, w: 11.8, h: 0.9, fontSize: style.headingSize - 4, bold: true, color: palette.text }, palette);
        } else {
          // fallback to two-column if no image
        }
        continue;
      }

      // default two-column layout
      addText(slide, s.title || `Slide ${i + 1}`, { x: 0.5, y: 0.32, w: 6.8, h: 0.8, fontSize: style.headingSize, bold: true, color: palette.text }, palette);
      addShapeSafe(slide, pptx.ShapeType.roundRect, { x: 0.5, y: 1.05, w: 1.8, h: 0.12, fill: { color: palette.accent, opacity: 1 }, line: { color: palette.accent, width: 0 } });

      const bulletFontSize = style.bulletSize + (polish ? 2 : 0);
      if (Array.isArray(s.bullets) && s.bullets.length) {
        const bullets = s.bullets.slice(0, 4);
        addText(slide, bullets.join("\n"), { x: 0.5, y: 1.5, w: 6.6, h: 4.8, fontSize: bulletFontSize, color: palette.muted, bullet: true, valign: "top", margin: 0.06, line: { spacing: 18 } }, palette);
      } else if (s.body_text) {
        addText(slide, s.body_text, { x: 0.5, y: 1.5, w: 6.6, h: 4.8, fontSize: bulletFontSize, color: palette.muted }, palette);
      } else {
        addText(slide, " ", { x: 0.5, y: 1.5, w: 6.6, h: 4.8 }, palette);
      }

      if (s.imageData) {
        addShapeSafe(slide, pptx.ShapeType.roundRect, { x: 8.0, y: 0.7, w: 4.6, h: 4.15, fill: { color: palette.accent, opacity: style.imageCardTint }, line: { color: palette.bg, width: 0 } });
        try { slide.addImage({ data: s.imageData, x: 8.08, y: 0.78, w: 4.44, h: 3.98, sizing: { type: "contain" } }); } catch (e) {}
      } else {
        addShapeSafe(slide, pptx.ShapeType.rect, { x: 8.0, y: 0.7, w: 4.6, h: 4.15, fill: { color: palette.accent, opacity: 0.07 }, line: { color: palette.accent, width: 0.4 } });
        addText(slide, "Image", { x: 8.0, y: 2.5, w: 4.6, h: 0.4, fontSize: 14, color: palette.muted, align: "center" }, palette);
      }

      if (s.speaker_notes) {
        try { slide.addNotes(s.speaker_notes); } catch (e) {}
      }
    }

    await pptx.writeFile({ fileName: filename });
    return true;
  } catch (err) {
    console.error("exportSlidesToPptx error:", err);
    throw err;
  }
}

/* ------------------ NEW: PDF exporter ------------------ */
/**
 * exportSlidesToPdf(slides, filename)
 * - slides: same shape as for PPTX
 * - filename: desired filename (e.g. "Autodeck-123.pdf")
 *
 * This function will create an A4 landscape PDF and add one slide per PDF page.
 */
export async function exportSlidesToPdf(slides, filename = `Autodeck-${Date.now()}.pdf`) {
  try {
    if (!slides || !slides.length) throw new Error("No slides provided");

    // Create A4 landscape PDF (units: mm)
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth(); // ~297 mm
    const pageH = pdf.internal.pageSize.getHeight(); // ~210 mm
    const margin = 10; // 10mm margin

    // Layout constants
    const gutter = 6;
    const leftColW = (pageW - margin * 2 - gutter) * 0.55; // left column for text
    const rightColW = (pageW - margin * 2 - gutter) * 0.45; // right column for image
    const topY = margin;
    const titleHeight = 14;
    const noteHeight = 18;

    // Basic font sizes
    const titleFontSize = 18;
    const bulletFontSize = 12;
    const noteFontSize = 10;

    for (let i = 0; i < slides.length; i++) {
      const s = slides[i] || {};
      if (i > 0) pdf.addPage();

      // Background (leave white) — PPTX used dark theme; we keep white PDF to be printable.
      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(titleFontSize);
      pdf.setTextColor(22, 22, 22);
      const titleX = margin;
      const titleY = topY + titleFontSize;
      pdf.text(s.title || `Slide ${i + 1}`, titleX, titleY, { maxWidth: leftColW + rightColW });

      // Subtitle / body under title (if present)
      if (s.body_text) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(bulletFontSize);
        pdf.setTextColor(60, 60, 60);
        const bodyY = titleY + 8;
        pdf.text(s.body_text, titleX, bodyY, { maxWidth: leftColW });
      }

      // Bullets in left column
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(bulletFontSize);
      pdf.setTextColor(45, 45, 45);
      const bulletsStartY = titleY + 22;
      if (Array.isArray(s.bullets) && s.bullets.length) {
        let curY = bulletsStartY;
        const lineHeight = 7;
        for (let bi = 0; bi < s.bullets.length; bi++) {
          const b = `• ${s.bullets[bi]}`;
          pdf.text(b, titleX, curY, { maxWidth: leftColW });
          curY += lineHeight;
          // page overflow guard (very long slides); truncate
          if (curY > pageH - margin - noteHeight - 10) {
            pdf.text("…", titleX, curY);
            break;
          }
        }
      } else if (s.body_text) {
        // already printed above; nothing else
      } else {
        pdf.setTextColor(130, 130, 130);
        pdf.text("(No bullet points)", titleX, bulletsStartY, { maxWidth: leftColW });
      }

      // Right column: image (if imageData)
      const imgX = margin + leftColW + gutter;
      const imgY = topY + 8;
      const imgMaxW = rightColW;
      const imgMaxH = pageH - margin - topY - noteHeight - 8;

      if (s.imageData) {
        // imageData may be data:image/...; jsPDF expects JPEG/PNG dataurls — it works with both.
        // But jsPDF addImage requires a format; detect it.
        const dataUrl = s.imageData;
        // detect mime
        const m = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,/);
        let mime = "image/jpeg";
        if (m && m[1]) mime = m[1];
        // compute placement while preserving aspect ratio.
        // Create an offscreen image element to get natural size (use Promise)
        const img = await new Promise((resolve, reject) => {
          const i = new Image();
          i.onload = () => resolve(i);
          i.onerror = reject;
          i.src = dataUrl;
        }).catch(() => null);

        if (img) {
          const naturalW = img.naturalWidth || img.width;
          const naturalH = img.naturalHeight || img.height;
          // convert mm to px ratio roughly: assume 96 DPI -> px/mm = 96 / 25.4
          const pxPerMm = 96 / 25.4;
          // determine display dimensions constrained by imgMaxW/imgMaxH
          let displayWmm = imgMaxW;
          let displayHmm = (naturalH / naturalW) * displayWmm;
          if (displayHmm > imgMaxH) {
            displayHmm = imgMaxH;
            displayWmm = (naturalW / naturalH) * displayHmm;
          }
          // add image
          try {
            pdf.addImage(dataUrl, mime.includes("png") ? "PNG" : "JPEG", imgX, imgY, displayWmm, displayHmm);
          } catch (err) {
            // fallback: draw placeholder rectangle if addImage fails
            pdf.setDrawColor(200);
            pdf.rect(imgX, imgY, imgMaxW, imgMaxH);
            pdf.text("Image", imgX + imgMaxW / 2, imgY + imgMaxH / 2, { align: "center" });
          }
        } else {
          // image load failed — placeholder
          pdf.setDrawColor(200);
          pdf.rect(imgX, imgY, imgMaxW, imgMaxH);
          pdf.text("Image", imgX + imgMaxW / 2, imgY + imgMaxH / 2, { align: "center" });
        }
      } else {
        // No image — draw placeholder rectangle with query text
        pdf.setDrawColor(210);
        pdf.rect(imgX, imgY, imgMaxW, imgMaxH);
        pdf.setFontSize(12);
        pdf.setTextColor(120, 120, 120);
        pdf.text(s.image_query || "No image", imgX + 4, imgY + 10);
      }

      // Speaker notes at bottom
      if (s.speaker_notes) {
        pdf.setFontSize(noteFontSize);
        pdf.setTextColor(90, 90, 90);
        const notesX = margin;
        const notesY = pageH - margin - 6;
        pdf.text(`Notes: ${s.speaker_notes}`, notesX, notesY, { maxWidth: pageW - margin * 2 });
      }

      // small footer
      pdf.setFontSize(8);
      pdf.setTextColor(130, 130, 130);
      pdf.text(`Autodeck • ${new Date().getFullYear()} • Slide ${i + 1} of ${slides.length}`, pageW - margin - 80, pageH - 6);
    }

    // Trigger download
    pdf.save(filename);
    return true;
  } catch (err) {
    console.error("exportSlidesToPdf error:", err);
    throw err;
  }
}

/* keep default export for backwards compatibility */
export default exportSlidesToPptx;
