"use client";
import { useEffect } from "react";
import "./command.css";

// AXIOM Command — mounts the framework-agnostic device-simulator + transport +
// renderer (app/app/lib/*) into #app on the client. These swap to real BLE/Wi-Fi/USB
// adapters in Beta without touching this page.
export default function CommandApp() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.__axiomBooted) return;
    (async () => {
      await import("./lib/device-sim.js");
      await import("./lib/transport.js");
      await import("./lib/command.js"); // boots renderConnect() into #app
      window.__axiomBooted = true;
    })();
  }, []);

  return (
    <>
      <div id="app" />
      <div className="alpha-flag" id="alphaFlag">
        <span className="dot" /> Alpha · running against a device simulator
        <button
          aria-label="dismiss"
          onClick={(e) => {
            const f = e.currentTarget.closest(".alpha-flag");
            if (f) f.style.display = "none";
          }}
        >
          ×
        </button>
      </div>
    </>
  );
}
