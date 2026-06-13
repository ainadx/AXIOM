# AXIOM — The Pocket Computer With No Limits

A self-contained Kickstarter landing page for **AXIOM**, the "Advanced Pocket Computer":
a 6×3×1-inch device that fuses Flipper-Pro-class radios with a flagship-class Linux
computer and on-device AI.

- **Flipper Pro radios** — Sub-GHz (433 / 868 / 915 MHz), multi-frequency RFID (13.56 MHz + 125 kHz), NFC
- **Real compute** — 8-core Rockchip RK3588S, 16 GB LPDDR5, 256 GB NVMe, on-device AI (NPU)
- **Flagship display** — 5.9″ 4K AMOLED capacitive touch
- **Connectivity** — Wi-Fi 6E, Bluetooth 5.3, USB-C PD
- **Open & repairable** — 3D-printable enclosure, full BOM, schematics, replaceable battery

## Landing page

[`index.html`](index.html) is the landing page. The device render and Poppins fonts are
embedded as base64; the launch film — **The AXIOM Anthem** ad
([`assets/axiom-anthem-ad.mp4`](assets/axiom-anthem-ad.mp4)) — is served as a streamable
static asset for fast page loads. (`AXIOM_kickstarter.html` is a descriptive copy.)

Open it directly in a browser (with `assets/` alongside it), or it is served at the site
root on Vercel.

### Companion app

See [`docs/PRD_AXIOM_Command_App.md`](docs/PRD_AXIOM_Command_App.md) — the product
requirements for **AXIOM Command**, the app that pairs with the device for live telemetry,
casting maps and content to its screen, a synced capture vault, an AI copilot, and fleet
management.

### Design

Visual language built on the **DKube Design System 2.0** — Poppins type, brand purple
`#7660A8`, pill buttons, soft-shadow cards, out-quart motion.

## Hardware source files

| File | Contents |
|---|---|
| `advanced_pocket_computer_CONFIG.json` | Full node graph, plan, and metadata |
| `advanced_pocket_computer_PARTS.csv` | Bill of materials |
| `advanced_pocket_computer_ELECTRICAL_CONNECTIONS.json` | Wiring / power & data lines |
| `advanced_pocket_computer_MECHANICAL_CONNECTIONS.json` | Fasteners & mounts |
| `advanced_pocket_computer_GUIDE.md` | Build guide (fabrication → assembly) |
| `advanced_pocket_computer_VISUAL.png` | Device render |

---

> **Note:** This is a concept campaign. Funding figures, backer counts, ship dates, and
> pledge availability shown on the page are illustrative placeholders, not a live
> fundraising offer. AXIOM's wireless features are intended for makers and security
> researchers to use only on systems they own or are authorized to test, in compliance
> with local laws and radio regulations.
