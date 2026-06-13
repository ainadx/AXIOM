# Product Requirements Document — AXIOM Command

**The companion app for the AXIOM pocket computer.**

| | |
|---|---|
| **Product** | AXIOM Command (iOS · Android · macOS · Windows · Web) |
| **Document owner** | Deepro Mallick |
| **Status** | Draft v1.0 — for review |
| **Last updated** | 2026-06-13 |
| **Related** | [AXIOM device campaign](../index.html) · [Hardware BOM](../advanced_pocket_computer_PARTS.csv) |

---

## 0. TL;DR

AXIOM is a 6×3×1-inch pocket computer that fuses Flipper-Pro-class radios (Sub-GHz, RFID, NFC), a flagship 8-core Linux SoC, on-device AI, and a 5.9″ 4K AMOLED touchscreen. **AXIOM Command** is the phone/desktop app that turns that device from a powerful gadget into a *connected platform*: it pairs over Bluetooth 5.3, Wi-Fi 6E, or USB-C and gives the owner live telemetry, the ability to cast maps and any other content onto the device's screen, a synced capture vault, an AI copilot, automations, and fleet management.

The wedge: **owners can't see or control what their device is doing once it leaves their hand.** AXIOM Command is the always-on bridge — a single pane of glass for an open hardware platform — and the layer that makes AXIOM defensible, recurring-revenue, and community-driven rather than a one-time hardware sale.

---

## 1. Vision

> *Your AXIOM is the body. AXIOM Command is the nervous system that connects it to everything else you own.*

A great piece of open hardware dies without great software around it. The devices that win — Flipper Zero, GoPro, DJI, Peloton, Tesla — are the ones whose **companion app** became the daily habit, the data moat, and the upsell engine. AXIOM Command is how AXIOM stops being "a cool gadget I bought once" and becomes "the platform I open every day."

We are building the **command center for a personal, pocket-sized compute-and-radio platform**: see its health, push content to its screen, navigate the physical and RF world with it, learn from what it captures, and orchestrate it from anywhere.

---

## 2. The problem & why now

### 2.1 The problem
- **Blind once it's untethered.** The moment AXIOM is in a bag, a pocket, or across a workshop, the owner has no idea about battery, charge state, temperature, storage, or what its radios are doing. Power users live in anxiety about "is it still alive / still recording / overheating?"
- **The 4K screen is wasted as a one-way display.** AXIOM has a gorgeous 4K AMOLED panel, but there's no easy way to *push* useful content to it — maps for field navigation, a live dashboard, a doc, a notification, a mirrored screen.
- **Captures are trapped on-device.** RF, NFC, and RFID captures, logs, and scripts live in local storage with no backup, no search, no sharing, no cross-device continuity.
- **No fleet view.** Security teams, makerspaces, and educators who deploy several units have no way to manage them together.
- **Open hardware has a soft underbelly: no recurring relationship.** A one-time $399 sale with no software layer is a commodity. The companion app is the difference between a hardware company and a platform company.

### 2.2 Why now
1. **The hardware finally justifies it.** An 8-core RK3588S with 16 GB RAM and Wi-Fi 6E can stream telemetry and screen-cast in real time — something a microcontroller-class multitool never could.
2. **On-device AI is real.** The SoC's NPU lets the app offload/clarify captures and telemetry with an AI copilot that runs partly local, partly cloud.
3. **The category is proven.** Flipper Zero shipped >1M units and its mobile app is a top hobbyist download — but it is thin (basic remote + firmware). Nobody has built the *premium, AI-native, fleet-ready* companion for a Linux-class pocket multitool. That gap is the opening.
4. **Open + connected is the moat.** Repairable, hackable hardware earns community love; a polished cloud/app layer earns recurring revenue. Owning both is rare.

---

## 3. Goals & non-goals

### 3.1 Goals (what success looks like)
- **G1.** Pair an AXIOM in under 30 seconds, first try, with zero docs.
- **G2.** Show complete, real-time device telemetry (power, thermals, compute, storage, radios) with <1 s latency on local link.
- **G3.** Let users cast maps **and arbitrary content** to the AXIOM screen in ≤3 taps.
- **G4.** Make captures and configs **safe, searchable, and synced** across the user's devices.
- **G5.** Ship an AI copilot that meaningfully reduces "what is this / what do I do" friction.
- **G6.** Support multi-device fleets for teams, classrooms, and labs.
- **G7.** Convert the app into a recurring-revenue and community engine (Pro, Teams, marketplace).

### 3.2 Non-goals (v1)
- **NG1.** We are **not** rebuilding the on-device OS UI; the app complements it, it doesn't replace the handheld experience.
- **NG2.** No social network. Community/library is opt-in and utilitarian, not a feed.
- **NG3.** No tooling that exists primarily to defeat security controls or operate on systems the user doesn't own — see §11 (Responsible Use). Features are framed for **authorized testing, research, education, and personal devices**.
- **NG4.** No Android-launcher-style full remote desktop in v1 (deferred to V2 "AXIOM Remote").

---

## 4. Target users & personas

| Persona | Who | Core job-to-be-done | Killer feature for them |
|---|---|---|---|
| **The Maker ("Mara")** | Hobbyist, IoT tinkerer, cyberdeck builder | "Help me build and debug my projects in the field without a laptop." | Cast dashboards/code to screen, telemetry, automations |
| **The Researcher ("Raj")** | Authorized security/RF researcher, pentester | "Survey and document the wireless world I'm authorized to test, safely and reproducibly." | Geotagged RF signal mapping, capture vault, audit log |
| **The Field Pro ("Fei")** | Surveyor, drone op, expedition/field engineer | "Navigate and monitor my gear off-grid." | Offline maps cast to device, GNSS breadcrumbs, find-my |
| **The Educator/Team Lead ("Tomas")** | Makerspace, university lab, security team | "Provision, monitor, and audit a fleet of devices." | Fleet management, policy, OTA, usage reporting |
| **The Power Owner ("Priya")** | Loves the device, wants more from it | "Make this the thing I open every day." | AI copilot, marketplace, cross-device beam |

**Primary ICP for launch:** Makers + authorized researchers (the same audience backing the Kickstarter). Teams/education is the expansion ICP that unlocks higher ACV.

---

## 5. Success metrics

**North Star Metric:** *Weekly Connected Devices* — number of AXIOM units that paired and exchanged data with the app in the last 7 days. It captures activation, retention, and the health of the platform in one number.

| Layer | Metric | Target (12 mo post-launch) |
|---|---|---|
| Activation | % of devices paired with app within 24 h of first boot | ≥ 80% |
| Activation | Median time-to-first-pair | ≤ 30 s |
| Engagement | D30 retention of paired users | ≥ 45% |
| Engagement | Avg. casts-to-device / WAU | ≥ 5 |
| Value | % of users with ≥1 synced capture | ≥ 60% |
| Monetization | Free→Pro conversion | ≥ 8% |
| Expansion | Teams seats as % of revenue | ≥ 30% |
| Trust | Crash-free sessions | ≥ 99.5% |
| AI | Copilot thumbs-up rate | ≥ 75% |

---

## 6. Competitive landscape & positioning

| | Flipper Mobile | Generic IoT companion (Tuya, etc.) | Laptop + scripts | **AXIOM Command** |
|---|---|---|---|---|
| Live telemetry | Minimal | Basic | Manual | **Full power/thermal/compute/radio** |
| Cast to device screen | ✗ | ✗ | ✗ | **Maps + arbitrary content** |
| Capture vault + sync | ✗ | ✗ | DIY | **Searchable, encrypted, cross-device** |
| AI copilot | ✗ | ✗ | ✗ | **On-device + cloud** |
| Fleet management | ✗ | Partial | ✗ | **Policy, OTA, audit** |
| Open SDK/marketplace | Limited | Closed | N/A | **Open plugin SDK + store** |

**Positioning statement:** *AXIOM Command is the command center for your pocket computer — the only app that lets you see everything your AXIOM is doing, push anything to its screen, and orchestrate a fleet of them, with an AI copilot watching your back.*

---

## 7. Product principles
1. **Local-first, cloud-optional.** Everything core works over a direct link with no account. Cloud adds sync, AI, and fleet — never gates basic control.
2. **Glanceable, then deep.** One screen answers "is it okay?"; one tap reaches every detail.
3. **Trust is the product.** Encryption, clear permissions, and responsible-use guardrails are features, not afterthoughts.
4. **Open beats walled.** A documented protocol and plugin SDK so the community extends the platform.
5. **Every screen earns the daily open.** If a view doesn't drive a habit, it doesn't ship.

---

## 8. System & connectivity architecture (overview)

```
┌────────────────────────────┐         ┌─────────────────────────────┐
│         AXIOM device       │         │       AXIOM Command app     │
│  (RK3588S · Linux · radios)│         │ (mobile / desktop / web)    │
│                            │         │                             │
│  axiomd  ── gRPC/Protobuf ─┼────┐    │  Connection Manager         │
│   • telemetry publisher    │    │    │   • BLE GATT (5.3)          │
│   • cast renderer (4K)     │    ├────┼─▶ • Wi-Fi 6E direct/LAN     │
│   • capture store          │    │    │   • USB-C (CDC/ADB-like)    │
│   • radio control bus      │    │    │  Telemetry / Cast / Vault   │
│   • on-device AI runtime   │    │    │  AI Copilot · Automations   │
└────────────────────────────┘    │    └──────────────┬──────────────┘
                                   │                   │ (opt-in, E2E)
                                   │            ┌──────▼───────┐
                                   └───────────▶│ AXIOM Cloud  │
                                                │ sync · OTA · │
                                                │ fleet · AI   │
                                                └──────────────┘
```

**Three transports, one session abstraction:**
- **Bluetooth LE 5.3** — always-available low-power channel for telemetry, control, notifications, find-my. Primary for "in pocket" monitoring.
- **Wi-Fi 6E (direct or same-LAN)** — high-bandwidth channel for screen casting, large file/capture sync, live screen mirror.
- **USB-C** — wired fallback: fastest, used for first-pair, firmware recovery, bulk transfer.

The app auto-selects and **seamlessly hands off** between transports (BLE for presence + control, Wi-Fi auto-upgrades when casting). A single `axiomd` daemon on the device exposes a versioned gRPC/Protobuf API; the same schema powers local and cloud paths.

---

## 9. Feature requirements

Priorities: **P0** = MVP (must ship at device launch) · **P1** = V1 (within 1 quarter) · **P2** = V2 / later.

### 9.1 Onboarding & pairing — **P0**
- **Story:** *As a new owner, I scan a code and my AXIOM is connected, named, and updated in under a minute.*
- Requirements:
  - QR/numeric pairing shown on the device's 4K screen → scan in app → encrypted key exchange (no plaintext pre-shared secret).
  - Auto-detect over BLE; offer USB-C "fast setup" when plugged in.
  - Post-pair checklist: name device, set owner, check firmware, set region (drives radio compliance — see §11).
- **Acceptance:** median time-to-first-pair ≤ 30 s; pairing survives app restart; keys stored in OS secure enclave/keystore.

### 9.2 Telemetry & health dashboard — **P0** *(core ask: "get all the telemetry data")*
- **Story:** *As an owner, I open the app and instantly know my device is healthy — battery, charge, heat, storage, radios.*
- The **Health** home screen surfaces a single status ("All systems nominal") plus glanceable cards; tap any card for history/detail.
- Telemetry channels (mapped to real hardware):

| Domain | Signals | Source component |
|---|---|---|
| **Power** | Battery %, voltage, current, time-to-empty/full, charge state, charging in/out, charge cycles, health | BQ25798 PMIC + 4500 mAh cell |
| **USB-C / PD** | Connected, negotiated profile, power in/out (W) | STUSB4500 |
| **Thermals** | SoC temp, board temp, throttling state | RK3588S sensors |
| **Compute** | CPU per-core load, RAM used/free, NPU utilization | RK3588S / 16 GB LPDDR5 |
| **Storage** | NVMe used/free, read/write activity, health | 256 GB NVMe |
| **Radios** | Per-radio on/off, mode, last activity, RX/TX counts, signal strength | CC1101 / PN7150 / RC522+EM4100 / AX210 |
| **Motion/Pos** | Orientation, motion events, GNSS fix & coords *(stretch module)* | MPU-6050 / GNSS |
| **Connectivity** | Active transport, link quality, latency | App/daemon |

- Configurable **alerts**: low battery, overheat, storage near full, charge complete, unexpected radio activity, device offline. Delivered as push (cloud) or local BLE notification.
- **Live mode** (Wi-Fi): 1 Hz+ streaming charts; **History**: down-sampled trends (24 h / 7 d / 30 d), exportable as CSV/JSON.
- **Acceptance:** every channel above renders with real values; local-link latency < 1 s; alerts fire within 10 s of threshold.

### 9.3 Cast to device — maps — **P0** *(core ask: "display the maps on it")*
- **Story:** *As a field user, I push an offline map and route to AXIOM's screen and navigate without my phone.*
- Requirements:
  - Pick a destination/area in-app → cast an **offline vector map tile pack** + route to the device's 4K display.
  - Turn-by-turn rendered on-device; position from GNSS (stretch module) or dead-reckoning via MPU-6050 + last fix.
  - Map styles tuned for AMOLED (true-black, high-contrast, daylight-readable).
  - Drop/sync waypoints and breadcrumbs bi-directionally.
- **Acceptance:** map+route appears on device ≤ 3 taps; offline pack works with phone in airplane mode; route recalcs on-device.

### 9.4 Cast to device — anything else — **P0/P1** *(core ask: "cast other data onto it if required, not just maps")*
- **Story:** *As an owner, I send whatever I want to that beautiful screen — a dashboard, a doc, a photo, a live mirror.*
- Cast targets:
  - **P0:** Notifications & alerts; images; documents (PDF/MD/text); a custom **live dashboard** (pick telemetry/widgets to show full-screen — e.g. a field power meter).
  - **P1:** **Screen mirror / present mode** (mirror phone or desktop window over Wi-Fi to the 4K panel); web page / URL card; code/log viewer; "now playing" / timer / countdown cards.
  - **P2:** Two-way remote control (touch on device drives app), multi-device "broadcast cast."
- A small **Cast SDK / templating format** (JSON layout → on-device renderer) so any data source can be cast without a native build.
- **Acceptance:** at least 5 cast types in P0; cast latency over Wi-Fi < 500 ms for static content, < 150 ms for mirror frames at 30 fps.

### 9.5 RF Signal Mapping (the "irresistible" feature) — **P1**
- **Story:** *As an authorized researcher, I walk a site I'm permitted to survey and the app builds a geotagged heatmap of what AXIOM's radios detected — overlaid on the same maps I cast to the device.*
- Joins **§9.2 radios + §9.3 maps + GNSS**: every detected Sub-GHz/Wi-Fi/BLE/NFC event is timestamped and geotagged → rendered as a heatmap/markers on the map, on device and in app.
- Session-based, exportable (KML/GeoJSON/CSV) for reports; replayable timeline scrubber.
- Hard-gated by Responsible Use (§11): region rules, explicit "I am authorized to survey this area," automatic redaction of identifiers in shared exports.
- **Why it's irresistible:** no competitor turns a pocket multitool into a geospatial spectrum-survey tool with a synced map on both screens. This is the demo that gets the screenshot shared.

### 9.6 Capture Vault & sync — **P0 (local) / P1 (cloud)**
- **Story:** *Everything my AXIOM captures or scripts is backed up, searchable, and on all my devices.*
- Unified library of captures, scripts, configs, logs, map packs, cast templates.
- Metadata + full-text + tag search; folders/collections; versioning.
- **Local-first**: works over direct link with no account. **Cloud (opt-in):** end-to-end encrypted sync across the user's app installs and devices; selective sync; trash/restore.
- **Acceptance:** capture made on device appears in app vault within 10 s on Wi-Fi; E2E-encrypted; restore works.

### 9.7 AI Copilot — **P1**
- **Story:** *I ask "why is my battery draining fast?" or "what is this capture?" and get a clear, actionable answer.*
- Hybrid: on-device NPU model for fast/private answers + cloud (Claude) for deep reasoning; user controls the boundary.
- Capabilities: explain telemetry anomalies & suggest fixes; summarize/annotate captures; natural-language device control ("turn off all radios," "cast my power dashboard"); generate automations from a sentence; draft research/report notes from a session.
- Always cites the telemetry/captures it used; never auto-executes a sensitive action without confirmation.
- **Acceptance:** ≥75% thumbs-up; on-device answers < 2 s; sensitive actions require explicit confirm.

### 9.8 Automations & rules — **P1**
- **Story:** *"When battery < 15%, turn off radios and notify me." "When I leave home (geofence), lock the device."*
- Trigger → condition → action engine; triggers from telemetry, time, location/geofence, NFC tap, device events; actions: device controls, casts, notifications, cloud webhooks.
- Templates gallery + natural-language authoring via Copilot.

### 9.9 Find My AXIOM & remote — **P1**
- Last-known + live location (BLE presence + GNSS), ring/flash device, "lost mode" (lock + on-screen message + contact), remote wipe of sensitive vault items.
- **Acceptance:** locate within 30 s when in BLE range; lost-mode survives reboot.

### 9.10 Firmware & OTA updates — **P0**
- Background-checked updates; release notes; staged rollout; one-tap update over Wi-Fi/USB; automatic rollback on failed boot; changelog history.
- **Acceptance:** update + verify + rollback path all tested; no bricked device on power loss mid-update (A/B partitions).

### 9.11 Fleet management (Teams) — **P1/P2**
- Org workspace; enroll many devices; group policies (allowed radios per region, update channel, vault retention); fleet dashboard (battery/health/online across all units); per-device + org **audit log**; role-based access; usage reporting for labs/classes.
- **Why it matters commercially:** moves ACV from $/user to $/seat + $/device; the wedge into universities, makerspaces, and security firms.

### 9.12 Plugin SDK & Marketplace — **P2**
- Documented device + app SDK; signed third-party "AXIOM Apps" (new cast templates, capture decoders, automations, dashboards); curated, reviewed store; optional paid plugins with revenue share.
- Turns AXIOM into a platform with network effects and a long content tail.

### 9.13 Cross-device beam & continuity — **P1**
- Shared clipboard and one-tap file beam between phone/desktop and AXIOM; "handoff" a map/doc/session from app to device and back.

---

## 10. Non-functional requirements
- **Security:** E2E encryption for cloud sync and remote control; device keys in secure enclave/keystore; signed firmware; signed plugins; no telemetry leaves device without explicit opt-in.
- **Privacy:** local-first; clear data inventory; per-feature consent; one-tap export & delete (GDPR/CCPA ready).
- **Performance:** dashboard cold-open < 1.5 s; telemetry local latency < 1 s; mirror 30 fps @ <150 ms over Wi-Fi 6E.
- **Reliability:** crash-free ≥ 99.5%; graceful transport handoff; offline-complete core.
- **Battery:** BLE monitoring adds < 3%/day device drain; app background drain negligible.
- **Accessibility:** WCAG 2.2 AA; full dynamic type; VoiceOver/TalkBack; high-contrast.
- **Platforms:** iOS 16+, Android 11+, macOS 13+, Windows 11, modern web (read-only telemetry + fleet at launch).
- **i18n:** English at launch; string-externalized for fast localization.

---

## 11. Responsible use, legal & compliance *(load-bearing — this is a multi-radio device)*
- **Region-aware radio policy:** during setup the user sets jurisdiction; the app surfaces which Sub-GHz bands/power levels are permitted and disables non-compliant presets by default.
- **Authorization gates:** RF Signal Mapping and any capture-heavy workflow require explicit attestation that the user owns or is authorized to test the target/area; sessions are logged.
- **Framing:** all features are presented for **makers, education, authorized security research, and personal-device use.** The app must not ship features whose primary purpose is to defeat security controls or operate on systems the user doesn't own (mirrors device campaign §Responsible Use and FAQ).
- **Export/redaction:** shared exports strip personal identifiers by default.
- **Audit:** Teams keep an immutable action log for accountability.
- **Certifications tracked:** app store policy compliance (sensitive-capability disclosure), SOC 2 path for Teams cloud, FCC/CE alignment with device firmware.

---

## 12. Data model (selected)
- **Device**: id, name, owner, model/rev, firmware, region, lastSeen, transport, capabilities[].
- **TelemetrySample**: deviceId, ts, domain, metric, value, unit. (Time-series; down-sampled tiers.)
- **CaptureItem**: id, deviceId, type, ts, geo?, size, tags[], encryptedBlobRef, version.
- **CastJob**: id, deviceId, type(map|dashboard|doc|mirror|notif), payloadRef, status, ts.
- **Automation**: id, scope(device|fleet), trigger, conditions[], actions[], enabled.
- **SignalEvent**: sessionId, ts, geo, band/protocol, rssi, classification, redactionLevel.
- **OrgFleet**: orgId, devices[], policies, roles, auditLog[].

---

## 13. Release plan

| Phase | Timing (relative to device ship Q2 2027) | Scope |
|---|---|---|
| **Alpha** | Device DVT (≈ Q4 2026) | Pairing, telemetry dashboard, OTA, cast-map MVP. Internal + Founders-tier backers. |
| **Beta** | Pre-ship (≈ Q1 2027) | Cast-anything (P0 set), capture vault (local), alerts, find-my, USB+BLE+Wi-Fi handoff. Public backer beta. |
| **1.0 (Launch)** | With device (Q2 2027) | All **P0** + cloud sync, accounts, Pro tier. |
| **1.1** | +1 quarter | AI Copilot, RF Signal Mapping, automations, screen mirror, beam, capture cloud. |
| **2.0** | +2–3 quarters | Teams/fleet, plugin SDK + marketplace, remote control, web fleet console. |

---

## 14. Business model & GTM *(why this is a top-tier YC project)*
- **Hardware → software flywheel:** every device sold is a pre-qualified app user; the app drives retention, referrals, and recurring revenue that a one-time hardware sale can't.
- **Pricing:**
  - **Free** — pairing, telemetry, local vault, cast basics, OTA. (Drives activation; works with no account.)
  - **Pro ($6–9/mo)** — cloud E2E sync, AI Copilot, RF Signal Mapping, automations, unlimited history, mirror.
  - **Teams ($15–25/seat/mo + per-device)** — fleet, policy, audit, SSO, support.
  - **Marketplace** — rev share on paid plugins; cloud storage upsell.
- **Moat:** (1) the app is the data layer — captures, automations, and fleet history create switching cost; (2) open SDK + marketplace = network effects; (3) hardware+software+community is hard to copy; (4) on-device AI + sync is a genuine technical edge.
- **TAM wedge → expansion:** start with the proven 1M+ hobbyist/researcher multitool market (Flipper-scale), expand into education (makerspaces, university labs) and SMB security/field-service via Teams — where ACV jumps 5–20×.
- **GTM:** launch on the Kickstarter backer base (built-in 3,000+ design partners); content + community (RF mapping demos are inherently shareable); education partnerships; bottoms-up Teams expansion.
- **Why now / why us:** the only team shipping the *premium, AI-native, fleet-ready* companion for a Linux-class pocket multitool, bundled with the hardware that justifies it.

---

## 15. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Telemetry/cast latency over BLE feels sluggish | Med | Auto-upgrade to Wi-Fi 6E for high-bandwidth; BLE only for presence/control |
| Misuse of radio features / legal exposure | Med | Region policy, authorization gates, responsible-use framing, audit logs (§11) |
| Cloud trust concerns from a privacy-sensitive audience | High | Local-first, E2E encryption, cloud strictly opt-in, open about data |
| Hardware ship slips drag the app timeline | Med | App phases tied to device milestones; web/simulator dev track decoupled |
| Cross-platform parity cost | Med | Shared core (gRPC schema + business logic), thin native UI shells |
| Marketplace quality/security | Med | Signed plugins, review pipeline, sandboxed execution |

---

## 16. Open questions
1. Build native (Swift/Kotlin) vs. cross-platform (Flutter/React Native/KMP) for the mobile shell? *(Recommendation: shared Rust/Protobuf core + native UI for performance-critical telemetry/mirror.)*
2. Which cast-template standard do we publish for third parties in v1?
3. GNSS is a stretch goal — do we hard-require it for RF Mapping, or ship dead-reckoning fallback at launch?
4. Cloud region/residency strategy for Teams (EU data residency from day one?).
5. How much of the AI Copilot must run on-device for the privacy-first segment before cloud is acceptable?

---

## 17. Appendix — glossary
- **axiomd** — the on-device daemon exposing the telemetry/cast/control API.
- **Cast** — pushing content from the app to AXIOM's 4K screen.
- **Capture** — any RF/NFC/RFID/log artifact produced on-device.
- **Transport** — the active link: BLE 5.3, Wi-Fi 6E, or USB-C.
- **Fleet** — a set of devices managed together under an org.
- **Signal Event** — a geotagged, timestamped radio detection used in RF Signal Mapping.

---

*This PRD describes a companion app concept for the AXIOM device design. Radio/RF capabilities are specified for makers, educators, and authorized security researchers operating on systems and spectrum they own or are permitted to use, in compliance with local law.*
