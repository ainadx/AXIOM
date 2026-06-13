"use client";
import { useEffect } from "react";

// Interactive behaviour for the landing page (FAQ accordion, launch-film play,
// scroll reveal, funding count-up). Ported from the original inline <script>.
export default function LandingScript() {
  useEffect(() => {
    // FAQ accordion
    const items = document.querySelectorAll(".faq-item");
    const faqHandlers = [];
    items.forEach((it) => {
      const q = it.querySelector(".faq-q");
      const handler = () => {
        const open = it.classList.contains("open");
        items.forEach((o) => {
          o.classList.remove("open");
          const t = o.querySelector(".faq-toggle");
          if (t) t.textContent = "+";
        });
        if (!open) it.classList.add("open");
      };
      if (q) {
        q.addEventListener("click", handler);
        faqHandlers.push([q, handler]);
      }
    });

    // Launch film poster -> play
    const poster = document.getElementById("filmPoster");
    const vid = document.getElementById("axiomVideo");
    const onPosterClick = () => {
      if (poster) poster.classList.add("hide");
      if (vid) vid.play();
    };
    const onPlay = () => poster && poster.classList.add("hide");
    const onPause = () => {
      if (vid && vid.currentTime === 0 && poster) poster.classList.remove("hide");
    };
    if (poster) poster.addEventListener("click", onPosterClick);
    if (vid) {
      vid.addEventListener("play", onPlay);
      vid.addEventListener("pause", onPause);
    }

    // Scroll reveal
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Funding count-up + progress bar
    function animateCount(el) {
      const target = parseFloat(el.getAttribute("data-count"));
      const prefix = el.getAttribute("data-prefix") || "";
      let start = null;
      const dur = 1600;
      function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.floor(eased * target).toLocaleString("en-US");
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target.toLocaleString("en-US");
      }
      requestAnimationFrame(step);
    }
    let fundDone = false;
    const fundIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !fundDone) {
            fundDone = true;
            document.querySelectorAll("[data-count]").forEach(animateCount);
            const bar = document.querySelector(".fund-bar i");
            if (bar) setTimeout(() => (bar.style.width = bar.getAttribute("data-w") + "%"), 200);
          }
        });
      },
      { threshold: 0.3 }
    );
    const fc = document.getElementById("fund");
    if (fc) fundIO.observe(fc);

    return () => {
      faqHandlers.forEach(([q, h]) => q.removeEventListener("click", h));
      if (poster) poster.removeEventListener("click", onPosterClick);
      if (vid) {
        vid.removeEventListener("play", onPlay);
        vid.removeEventListener("pause", onPause);
      }
      io.disconnect();
      fundIO.disconnect();
    };
  }, []);

  return null;
}
