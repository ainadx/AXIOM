# AXIOM — The Pocket Computer With No Limits

A **Next.js** app containing the AXIOM Kickstarter landing page and **AXIOM Command**, the
companion app — plus the original hardware design files.

AXIOM is a 6×3×1-inch device that fuses Flipper-Pro-class radios with a flagship-class Linux
computer and on-device AI:

- **Flipper Pro radios** — Sub-GHz (433 / 868 / 915 MHz), multi-frequency RFID (13.56 MHz + 125 kHz), NFC
- **Real compute** — 8-core Rockchip RK3588S, 16 GB LPDDR5, 256 GB NVMe, on-device AI (NPU)
- **Flagship display** — 5.9″ 4K AMOLED capacitive touch
- **Connectivity** — Wi-Fi 6E, Bluetooth 5.3, USB-C PD
- **Open & repairable** — 3D-printable enclosure, full BOM, schematics, replaceable battery

## Live

| Route | What |
|---|---|
| **`/`** ([get-axiom.vercel.app](https://get-axiom.vercel.app)) | Kickstarter landing page |
| **`/app`** ([/app](https://get-axiom.vercel.app/app)) | AXIOM Command dashboard (Phase 1 / Alpha) |

## Stack

- **Next.js** (App Router) + React, deployed on Vercel.
- `app/page.js` — landing page (renders `content/landing-body.html`; `app/LandingScript.js` wires interactivity). The launch film **The AXIOM Anthem** streams from `public/assets/axiom-anthem-ad.mp4`.
- `app/app/page.js` — mounts **AXIOM Command** (`app/app/lib/*` device simulator, transport layer, and renderer) at `/app`.
- Visual language: **DKube Design System 2.0** — Poppins, brand purple `#7660A8`, pill buttons, soft-shadow cards.

### Run locally
```bash
npm install
npm run dev        # http://localhost:3000  (/ and /app)
npm run build && npm start
```

## AXIOM Command (the app)

- **PRD:** [`docs/PRD_AXIOM_Command_App.md`](docs/PRD_AXIOM_Command_App.md) — telemetry, cast maps + cast-anything, RF signal mapping, AI copilot, automations, fleet/Teams, marketplace, business model.
- **Plan:** [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) — 5 phases (Alpha → 2.0), 21 features.
- **Tracking DB:** [`db/`](db/README.md) — NeonDB tables mirroring the plan; `node db/status.mjs` shows live progress.

**Phase 1 (Alpha)** is in progress: pairing (AX-101), live telemetry dashboard (AX-102), cast-to-screen (AX-103), OTA (AX-110), and the transport layer (AX-111) all run today against an on-device **simulator** (`app/app/lib/device-sim.js`). The simulator swaps to real BLE/Wi-Fi/USB adapters in Beta with no app changes — the telemetry frame shape stays identical.

## Hardware source files

| File | Contents |
|---|---|
| `advanced_pocket_computer_CONFIG.json` | Full node graph, plan, and metadata |
| `advanced_pocket_computer_PARTS.csv` | Bill of materials |
| `advanced_pocket_computer_ELECTRICAL_CONNECTIONS.json` | Wiring / power & data lines |
| `advanced_pocket_computer_MECHANICAL_CONNECTIONS.json` | Fasteners & mounts |
| `advanced_pocket_computer_GUIDE.md` | Build guide (fabrication → assembly) |
| `advanced_pocket_computer_VISUAL.png` | Device render |

A self-contained standalone copy of the landing page is kept at `public/kickstarter.html`.

---

> **Note:** This is a concept campaign. Funding figures, backer counts, ship dates, and pledge
> availability are illustrative placeholders, not a live fundraising offer. AXIOM's wireless
> features are intended for makers and security researchers to use only on systems they own or
> are authorized to test, in compliance with local laws and radio regulations.
