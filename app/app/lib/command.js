/* AXIOM Command — Alpha app controller.
   Wires the device simulator + transport into pairing, telemetry, cast, and firmware UIs. */
(function (root) {
  "use strict";
  var AXIOM = root.AXIOM;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var app = $("#app");

  // ---- tiny SVG icon set ----
  var I = {
    cube: '<svg class="logo-cube" viewBox="0 0 120 120"><path d="M60 14 106 38v6L60 20Z" fill="#9384BD"/><path d="M60 20v44L14 40Z" fill="#7660A8"/><path d="M60 26 100 48 60 70 20 48Z" fill="#7660A8"/><path d="M60 26 100 48 60 70Z" fill="#9384BD"/><path d="M20 60 60 82 100 60 60 38Z" fill="#D6D6D6"/></svg>',
    health: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-7 4 18 2-9 1 3h5"/></svg>',
    cast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 16a6 6 0 0 1 6 6M2 12a10 10 0 0 1 10 10M2 8a14 14 0 0 1 14 14"/><rect x="2" y="3" width="20" height="14" rx="2"/></svg>',
    chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
    fw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>',
    batt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2"/></svg>',
    therm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14V4a2 2 0 0 0-4 0v10a4 4 0 1 0 4 0Z"/></svg>',
    hdd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h6"/></svg>',
    radio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M5 12a7 7 0 0 1 14 0M2 12a10 10 0 0 1 20 0"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m9 4 6 2 6-2v14l-6 2-6-2-6 2V6l6-2Zm0 0v14m6-12v14"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7M10 21a2 2 0 0 0 4 0"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm0 0v5h5M9 13h6M9 17h6"/></svg>',
    gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm1.5-3.5L17 7M4 18a9 9 0 1 1 16 0"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
  };

  var state = {
    cm: new AXIOM.ConnectionManager(),
    device: null, transport: null,
    connected: false, view: "health",
    frame: null,
    hist: { batt: [], soc: [], cpu: [] },
    cast: null, casting: false, alertAck: false
  };

  // ============================================================ PAIRING
  function renderConnect() {
    app.innerHTML =
      '<div class="connect"><div class="connect-card fade-in">' +
        '<div class="brand-row">' + I.cube +
          '<div><div class="word">AXIOM Command</div><div class="sub">Device Console</div></div></div>' +
        '<h1>Connect your AXIOM</h1>' +
        '<p class="lede">Power on your device and keep it nearby. AXIOM Command will find it over Bluetooth and pair securely.</p>' +
        '<div class="discover" id="discover"><div class="scanning"><span class="spin"></span> Scanning for nearby devices…</div></div>' +
        '<a class="back-home" href="/">← Back to axiom.dev</a>' +
      '</div></div>';
    state.cm.discover().then(function (list) {
      var d = list[0];
      $("#discover").innerHTML =
        '<div class="dev-row fade-in" id="devRow">' +
          '<div class="dev-ic">' + I.cube + '</div>' +
          '<div class="dev-meta"><div class="n">' + d.model + '</div>' +
            '<div class="s">' + d.id + ' · signal ' + d.rssi + ' dBm</div></div>' +
          '<button class="btn btn-primary btn-sm" id="pairBtn">Pair</button>' +
        '</div>';
      $("#pairBtn").onclick = function () { startPairing(d); };
    });
  }

  function startPairing(d) {
    var code = String(Math.floor(100000 + Math.random() * 900000));
    $("#discover").innerHTML =
      '<div class="pairing-code fade-in">' +
        '<div class="lbl">Confirm this code shows on your AXIOM screen</div>' +
        '<div class="code-digits">' + code.split("").map(function (c) { return "<span>" + c + "</span>"; }).join("") + '</div>' +
        '<div class="handshake"><span class="spin"></span> Establishing encrypted channel…</div>' +
      '</div>';
    state.cm.pair(d, code).then(function () {
      $("#discover").innerHTML =
        '<div class="fade-in">' +
          '<div class="field"><label>Device name</label><input id="devName" value="AXIOM" /></div>' +
          '<div class="field"><label>Region (sets radio compliance)</label>' +
            '<select id="region"><option value="US">United States (FCC)</option>' +
            '<option value="EU">European Union (CE)</option><option value="UK">United Kingdom</option>' +
            '<option value="JP">Japan</option><option value="AU">Australia</option></select></div>' +
          '<div class="connect-actions"><button class="btn btn-primary" id="finishBtn">' + I.check + ' Finish setup</button></div>' +
        '</div>';
      $("#finishBtn").onclick = function () {
        completeConnect($("#devName").value || "AXIOM", $("#region").value);
      };
    });
  }

  function completeConnect(name, region) {
    var dev = new AXIOM.DeviceSim({ name: name, region: region });
    dev.region = region;
    var t = new AXIOM.SimTransport(dev);
    state.device = dev; state.transport = t; state.connected = true;
    t.onFrame(onFrame);
    state.cm.attach(t).then(function () { renderShell(); });
  }

  // ============================================================ SHELL
  function renderShell() {
    app.innerHTML =
      '<div class="shell">' +
        '<aside class="side">' +
          '<div class="brand-row">' + I.cube + '<div class="word">AXIOM</div></div>' +
          navItem("health", I.health, "Health") +
          navItem("cast", I.cast, "Cast") +
          navItem("firmware", I.fw, "Firmware") +
          '<div class="side-foot"><div class="side-dev"><span class="d"></span>' +
            '<div><div style="color:#fff;font-weight:600">' + esc(state.device.name) + '</div>' +
            '<div class="muted" style="font-size:11px">' + state.device.id + ' · ' + state.device.region + '</div></div></div>' +
            '<a class="back-home" href="/" style="margin-top:12px">← axiom.dev</a></div>' +
        '</aside>' +
        '<main class="main" id="main"></main>' +
      '</div>';
    Array.prototype.forEach.call(document.querySelectorAll(".nav-item"), function (n) {
      n.onclick = function () { setView(n.getAttribute("data-v")); };
    });
    setView(state.view);
  }
  function navItem(v, icon, label) {
    return '<a class="nav-item" data-v="' + v + '">' + icon + '<span>' + label + '</span></a>';
  }
  function setView(v) {
    state.view = v;
    Array.prototype.forEach.call(document.querySelectorAll(".nav-item"), function (n) {
      n.classList.toggle("active", n.getAttribute("data-v") === v);
    });
    if (v === "health") renderHealth();
    else if (v === "cast") renderCast();
    else if (v === "firmware") renderFirmware();
  }

  // ============================================================ TELEMETRY (AX-102)
  function onFrame(f) {
    state.frame = f;
    push(state.hist.batt, f.power.battery_pct);
    push(state.hist.soc, f.thermal.soc_c);
    push(state.hist.cpu, f.compute.cpu_avg);
    if (state.view === "health" && $("#m-batt")) updateHealth(f);
    if (state.view === "cast" && state.casting) drawDeviceScreen();
    updateTopLink(f);
  }
  function push(a, v) { a.push(v); if (a.length > 60) a.shift(); }

  function renderHealth() {
    var f = state.frame; if (!f) return;
    var main = $("#main");
    main.innerHTML =
      topbar("Health", "Live telemetry · " + f.link.label) +
      '<div id="banner"></div>' +
      '<div class="grid">' +
        card("span4", I.batt, "Power", powerCard(f), "m-batt") +
        card("span4", I.therm, "Thermals", thermCard(f), "m-therm") +
        card("span4", I.hdd, "Storage", storageCard(f), "m-stor") +
        card("span8", I.chip, "Compute", computeCard(f), "m-comp") +
        card("span4", I.gauge, "Connection", linkCard(f), "m-link") +
        card("span12", I.radio, "Radios", radiosCard(f), "m-radio") +
      '</div>';
    bindRadioToggles();
    updateHealth(f);
  }

  function powerCard(f) {
    return '<div class="metric"><span class="v" id="v-batt">' + Math.round(f.power.battery_pct) + '</span><span class="u">%</span>' +
      '<span class="chip" id="c-charge" style="margin-left:auto"></span></div>' +
      '<div class="bar"><i id="bar-batt" class="good"></i></div>' +
      '<div class="sub-metrics"><div class="sm">Voltage <b id="s-volt"></b></div>' +
      '<div class="sm">Current <b id="s-cur"></b></div><div class="sm" id="s-eta"></div></div>' +
      '<canvas class="spark" id="sp-batt"></canvas>' +
      '<button class="btn btn-ghost btn-sm" id="chargeBtn" style="margin-top:6px">Toggle USB-C charger</button>';
  }
  function thermCard(f) {
    return '<div class="metric"><span class="v" id="v-soc">' + Math.round(f.thermal.soc_c) + '</span><span class="u">°C SoC</span>' +
      '<span class="chip ok" id="c-throttle" style="margin-left:auto">nominal</span></div>' +
      '<div class="sub-metrics"><div class="sm">Board <b id="s-board"></b></div></div>' +
      '<canvas class="spark" id="sp-soc"></canvas>';
  }
  function storageCard(f) {
    return '<div class="metric"><span class="v" id="v-stor">' + f.storage.nvme_used_gb + '</span><span class="u">/ 256 GB</span></div>' +
      '<div class="bar"><i id="bar-stor" class="good"></i></div>' +
      '<div class="sub-metrics"><div class="sm">Read <b id="s-rd"></b></div><div class="sm">Write <b id="s-wr"></b></div></div>';
  }
  function computeCard(f) {
    return '<div class="sub-metrics" style="margin:0 0 4px"><div class="sm">CPU avg <b id="s-cpu"></b></div>' +
      '<div class="sm">RAM <b id="s-ram"></b> / 16 GB</div><div class="sm">NPU <b id="s-npu"></b></div></div>' +
      '<div class="cores" id="cores"></div><canvas class="spark" id="sp-cpu"></canvas>';
  }
  function linkCard(f) {
    return '<div class="metric"><span class="v" id="v-lat">' + f.link.latency_ms + '</span><span class="u">ms</span></div>' +
      '<div class="sub-metrics"><div class="sm">Transport <b id="s-tx"></b></div>' +
      '<div class="sm">Quality <b id="s-q"></b></div></div>' +
      '<div class="bar"><i id="bar-link" class="good"></i></div>';
  }
  function radiosCard(f) {
    var rows = "", r = f.radios;
    rows += radioRow("subghz", "Sub-GHz", r.subghz.band + " · CC1101", r.subghz);
    rows += radioRow("nfc", "NFC", "PN7150", r.nfc);
    rows += radioRow("rfid", "RFID", "13.56 MHz + 125 kHz", r.rfid);
    rows += radioRow("wifi", "Wi-Fi 6E", r.wifi.ssid + " · " + r.wifi.rssi + " dBm", r.wifi);
    rows += radioRow("bt", "Bluetooth 5.3", r.bt.devices + " devices", r.bt);
    return '<div class="radios">' + rows + '</div>';
  }
  function radioRow(key, name, sub, r) {
    return '<div class="radio-row"><div class="radio-ic">' + I.radio + '</div>' +
      '<div class="radio-meta"><div class="n">' + name + '</div><div class="s">' + sub + '</div></div>' +
      '<div class="activity" id="act-' + key + '"></div>' +
      '<button class="toggle ' + (r.on ? "on" : "") + '" data-radio="' + key + '" aria-label="toggle ' + name + '"></button></div>';
  }

  function updateHealth(f) {
    set("v-batt", Math.round(f.power.battery_pct));
    var bp = f.power.battery_pct, bcls = bp < 15 ? "crit" : bp < 30 ? "warn" : "good";
    var bar = $("#bar-batt"); if (bar) { bar.style.width = bp + "%"; bar.className = bcls; }
    chip("c-charge", f.power.charging ? "charging" : "discharging", f.power.charging ? "ok" : "");
    set("s-volt", f.power.voltage.toFixed(2) + " V");
    set("s-cur", f.power.current_a.toFixed(2) + " A");
    set("s-eta", f.power.charging ? ("Full in <b>" + f.power.time_to_full_min + " min</b>") :
      ("Empty in <b>" + f.power.time_to_empty_min + " min</b>"), true);

    set("v-soc", Math.round(f.thermal.soc_c));
    set("s-board", f.thermal.board_c.toFixed(1) + " °C");
    chip("c-throttle", f.thermal.throttling ? "throttling" : "nominal", f.thermal.throttling ? "warn" : "ok");

    set("v-stor", f.storage.nvme_used_gb);
    var sbar = $("#bar-stor"); if (sbar) sbar.style.width = (f.storage.nvme_used_gb / 256 * 100) + "%";
    set("s-rd", f.storage.read_mbs + " MB/s"); set("s-wr", f.storage.write_mbs + " MB/s");

    set("s-cpu", f.compute.cpu_avg + "%"); set("s-ram", f.compute.ram_used_gb);
    set("s-npu", f.compute.npu_pct + "%");
    renderCores(f.compute.cpu);

    set("v-lat", f.link.latency_ms); set("s-tx", f.link.label);
    set("s-q", f.link.quality_pct + "%");
    var lb = $("#bar-link"); if (lb) lb.style.width = f.link.quality_pct + "%";

    ["subghz", "nfc", "rfid", "wifi", "bt"].forEach(function (k) {
      renderActivity("act-" + k, f.radios[k]);
    });

    spark("sp-batt", state.hist.batt, "#9384BD", 0, 100);
    spark("sp-soc", state.hist.soc, "#E0B25A", 25, 95);
    spark("sp-cpu", state.hist.cpu, "#7FE0B0", 0, 100);

    renderBanner(f);
  }

  function renderCores(cpu) {
    var el = $("#cores"); if (!el) return;
    if (el.children.length !== 8) {
      el.innerHTML = cpu.map(function (_, i) { return '<div class="core"><span>C' + i + '</span><i></i></div>'; }).join("");
    }
    Array.prototype.forEach.call(el.children, function (c, i) { c.querySelector("i").style.height = cpu[i] + "%"; });
  }
  function renderActivity(id, r) {
    var el = $("#" + id); if (!el) return;
    if (el.children.length !== 7) { el.innerHTML = ""; for (var i = 0; i < 7; i++) el.appendChild(document.createElement("i")); }
    var on = r.on, act = r.act || 0;
    Array.prototype.forEach.call(el.children, function (bar, i) {
      var h = on ? Math.max(3, (Math.sin(Date.now() / 200 + i) * 0.5 + 0.5) * (act / 100) * 18) : 2;
      bar.style.height = h + "px"; bar.style.opacity = on ? (0.4 + act / 200) : 0.18;
    });
  }
  function renderBanner(f) {
    var el = $("#banner"); if (!el) return;
    var msg = null, cls = "", sub = "";
    if (f.power.battery_pct < 15) { msg = "Low battery"; cls = "crit"; sub = "Connect USB-C to keep AXIOM running."; }
    else if (f.thermal.throttling) { msg = "Thermal throttling"; cls = "warn"; sub = "SoC above 85 °C — performance reduced."; }
    else if (f.storage.nvme_used_gb / 256 > 0.9) { msg = "Storage almost full"; cls = "warn"; sub = "Free space or sync the capture vault."; }
    if (!msg) {
      el.innerHTML = '<div class="status-banner"><span class="ic" style="color:#7FE0B0">' + I.check + '</span>' +
        '<div><div class="t">All systems nominal</div><div class="s">Battery, thermals, storage, and all radios are healthy.</div></div></div>';
    } else {
      el.innerHTML = '<div class="status-banner ' + cls + '"><span class="ic" style="color:#E0B25A">' + I.bell + '</span>' +
        '<div><div class="t">' + msg + '</div><div class="s">' + sub + '</div></div></div>';
    }
  }

  function bindRadioToggles() {
    Array.prototype.forEach.call(document.querySelectorAll(".toggle[data-radio]"), function (t) {
      t.onclick = function () {
        var key = t.getAttribute("data-radio"), on = !t.classList.contains("on");
        t.classList.toggle("on", on);
        state.transport.send("setRadio", { name: key, on: on });
      };
    });
    var cb = $("#chargeBtn");
    if (cb) cb.onclick = function () {
      state.transport.send("setCharging", { on: !state.frame.power.charging });
    };
  }

  // ============================================================ CAST (AX-103/104)
  function renderCast() {
    var main = $("#main");
    main.innerHTML =
      topbar("Cast", "Push content to the 5.9″ 4K AMOLED · auto-upgrades to Wi-Fi") +
      '<div class="cast-wrap"><div>' +
        '<div class="cast-opts">' +
          castOpt("map", I.map, "Offline map & route", "Navigate from the device screen, no phone needed.") +
          castOpt("dash", I.gauge, "Live dashboard", "Mirror key telemetry as a full-screen field meter.") +
          castOpt("notif", I.bell, "Notification", "Send an alert card to the device.") +
          castOpt("doc", I.doc, "Document", "Push a doc or image to read on the 4K panel.") +
        '</div>' +
        '<p class="muted" style="margin-top:16px;font-size:13px">Casting opens a Wi-Fi 6E channel for low-latency rendering; ' +
        'Bluetooth stays connected for control. <span id="castStatus"></span></p>' +
      '</div>' +
      '<div class="device-mock"><div class="device-frame"><div class="device-knob"></div>' +
        '<canvas class="device-screen" id="devScreen" width="280" height="590"></canvas></div>' +
        '<div class="device-label">AXIOM · 5.9″ 4K AMOLED</div></div>' +
      '</div>';
    Array.prototype.forEach.call(document.querySelectorAll(".cast-opt"), function (o) {
      o.onclick = function () { doCast(o.getAttribute("data-cast"), o); };
    });
    state.cast = state.cast || "map";
    var first = document.querySelector('.cast-opt[data-cast="' + state.cast + '"]');
    doCast(state.cast, first);
  }
  function castOpt(k, icon, n, d) {
    return '<button class="cast-opt" data-cast="' + k + '">' + icon +
      '<div class="n">' + n + '</div><div class="d">' + d + '</div></button>';
  }
  function doCast(type, el) {
    state.cast = type;
    Array.prototype.forEach.call(document.querySelectorAll(".cast-opt"), function (o) { o.classList.remove("active"); });
    if (el) el.classList.add("active");
    // transport upgrade to Wi-Fi for casting (AX-111 handoff)
    state.transport.upgrade("wifi");
    state.transport.send("cast", { type: type }).then(function (ack) {
      $("#castStatus").innerHTML = ack.ok ?
        '<span style="color:#7FE0B0">✓ Casting "' + type + '" over Wi-Fi 6E</span>' : "cast failed";
    });
    state.casting = true;
    drawDeviceScreen();
  }
  function drawDeviceScreen() {
    var cv = $("#devScreen"); if (!cv) return;
    var x = cv.getContext("2d"), W = cv.width, H = cv.height, f = state.frame;
    x.fillStyle = "#000"; x.fillRect(0, 0, W, H);
    // status bar
    x.fillStyle = "#9b93ad"; x.font = "600 11px Poppins, sans-serif";
    x.fillText("AXIOM", 12, 20);
    x.textAlign = "right"; x.fillText(Math.round(f.power.battery_pct) + "%", W - 12, 20); x.textAlign = "left";
    var t = (Date.now() / 1000) % 1000;
    if (state.cast === "map") drawMap(x, W, H, t);
    else if (state.cast === "dash") drawDash(x, W, H, f);
    else if (state.cast === "notif") drawNotif(x, W, H);
    else drawDoc(x, W, H);
  }
  function drawMap(x, W, H, t) {
    x.fillStyle = "#0b0f0c"; x.fillRect(0, 28, W, H - 28);
    x.strokeStyle = "#1c241d"; x.lineWidth = 1;
    for (var gx = -((t * 8) % 40); gx < W; gx += 40) { x.beginPath(); x.moveTo(gx, 28); x.lineTo(gx, H); x.stroke(); }
    for (var gy = 28 + ((t * 4) % 40); gy < H; gy += 40) { x.beginPath(); x.moveTo(0, gy); x.lineTo(W, gy); x.stroke(); }
    // route
    x.strokeStyle = "#7660A8"; x.lineWidth = 5; x.lineCap = "round"; x.beginPath();
    x.moveTo(40, H - 40); x.lineTo(40, 320); x.lineTo(150, 320); x.lineTo(150, 150); x.lineTo(230, 150);
    x.stroke();
    x.strokeStyle = "#9384BD"; x.lineWidth = 2; x.setLineDash([2, 6]); x.stroke(); x.setLineDash([]);
    // moving position dot
    var p = (t % 8) / 8, dotY = (H - 40) - p * 120;
    x.fillStyle = "#fff"; x.beginPath(); x.arc(40, dotY, 7, 0, 7); x.fill();
    x.fillStyle = "rgba(147,132,189,.4)"; x.beginPath(); x.arc(40, dotY, 14, 0, 7); x.fill();
    // destination
    x.fillStyle = "#7FE0B0"; x.beginPath(); x.arc(230, 150, 6, 0, 7); x.fill();
    // turn card
    roundRect(x, 12, H - 70, W - 24, 52, 12, "rgba(20,18,26,.92)");
    x.fillStyle = "#fff"; x.font = "700 15px Poppins, sans-serif"; x.fillText("400 m · Turn right", 24, H - 44);
    x.fillStyle = "#9b93ad"; x.font = "500 11px Poppins, sans-serif"; x.fillText("onto Almaden Blvd", 24, H - 28);
  }
  function drawDash(x, W, H, f) {
    var rows = [["Battery", Math.round(f.power.battery_pct) + "%"], ["SoC temp", Math.round(f.thermal.soc_c) + "°C"],
      ["CPU", f.compute.cpu_avg + "%"], ["RAM", f.compute.ram_used_gb + " / 16 GB"],
      ["Sub-GHz", f.radios.subghz.on ? f.radios.subghz.band : "off"], ["Link", f.link.label]];
    rows.forEach(function (r, i) {
      var y = 70 + i * 78;
      roundRect(x, 14, y, W - 28, 64, 12, "#12100a".replace("0a", "16"));
      roundRect(x, 14, y, W - 28, 64, 12, "rgba(118,96,168,.10)");
      x.fillStyle = "#8e889c"; x.font = "600 11px Poppins"; x.fillText(r[0].toUpperCase(), 28, y + 24);
      x.fillStyle = "#fff"; x.font = "700 22px Poppins"; x.fillText(r[1], 28, y + 50);
    });
  }
  function drawNotif(x, W, H) {
    roundRect(x, 16, 90, W - 32, 110, 16, "rgba(118,96,168,.16)");
    x.fillStyle = "#9384BD"; x.font = "700 12px Poppins"; x.fillText("AXIOM COMMAND", 32, 120);
    x.fillStyle = "#fff"; x.font = "700 17px Poppins"; x.fillText("Capture complete", 32, 148);
    x.fillStyle = "#c7c2d2"; x.font = "400 13px Poppins";
    x.fillText("Sub-GHz session saved to vault.", 32, 172);
  }
  function drawDoc(x, W, H) {
    roundRect(x, 16, 70, W - 32, H - 110, 12, "#16131d");
    x.fillStyle = "#fff"; x.font = "700 16px Poppins"; x.fillText("AXIOM field notes", 32, 104);
    x.fillStyle = "#8e889c"; x.font = "400 11px Poppins";
    for (var i = 0; i < 14; i++) { var w = 200 - (i % 4) * 30; x.fillStyle = "#2a2733"; x.fillRect(32, 124 + i * 22, w, 7); }
  }

  // ============================================================ FIRMWARE (AX-110)
  function renderFirmware() {
    var dev = state.device, main = $("#main");
    main.innerHTML =
      topbar("Firmware", "Secure OTA with A/B partitions and automatic rollback") +
      '<div class="grid"><div class="card span8" id="fwCard">' +
        '<div class="fw-row"><span class="k">Installed version</span><span class="v" id="fwCur">' + dev.firmware + '</span></div>' +
        '<div class="fw-row"><span class="k">Channel</span><span class="v">alpha</span></div>' +
        '<div class="fw-row"><span class="k">Boot slot</span><span class="v">A (rollback armed)</span></div>' +
        '<div id="fwAction" style="margin-top:20px"><button class="btn btn-primary" id="checkFw">Check for updates</button></div>' +
      '</div>' +
      '<div class="card span4"><div class="card-h"><span class="t">' + I.fw + ' Safety</span></div>' +
        '<p class="muted" style="font-size:13px;line-height:1.6">Updates write to the inactive slot and verify before switching. ' +
        'If the new firmware fails to boot, AXIOM automatically rolls back — a power loss mid-update cannot brick the device.</p></div>' +
      '</div>';
    $("#checkFw").onclick = checkFw;
  }
  function checkFw() {
    var act = $("#fwAction");
    act.innerHTML = '<div class="scanning"><span class="spin"></span> Checking…</div>';
    state.transport.send("checkUpdate").then(function (u) {
      act.innerHTML =
        '<div class="fade-in"><div style="color:#fff;font-weight:600;margin-bottom:6px">Update available · ' + u.available + '</div>' +
        '<div class="muted" style="font-size:13px;margin-bottom:10px">' + u.size_mb + ' MB · ' + u.notes.join(" · ") + '</div>' +
        '<button class="btn btn-primary" id="doFw">Install ' + u.available + '</button></div>';
      $("#doFw").onclick = function () { installFw(u.available); };
    });
  }
  function installFw(version) {
    var act = $("#fwAction");
    act.innerHTML = '<div class="muted" id="fwStage">Downloading to inactive slot…</div><div class="progress"><i id="fwBar"></i></div>';
    var p = 0, stages = [[35, "Verifying signature…"], [70, "Writing slot B…"], [95, "Switching boot slot…"], [100, "Verified · rollback armed"]];
    var iv = setInterval(function () {
      p = Math.min(100, p + 4 + Math.random() * 6);
      $("#fwBar").style.width = p + "%";
      for (var i = 0; i < stages.length; i++) if (p < stages[i][0] || i === stages.length - 1) { $("#fwStage").textContent = stages[i][1]; break; }
      if (p >= 100) {
        clearInterval(iv);
        state.transport.send("applyUpdate", { version: version }).then(function () {
          set("fwCur", version);
          act.innerHTML = '<div class="status-banner fade-in"><span class="ic" style="color:#7FE0B0">' + I.check + '</span>' +
            '<div><div class="t">Updated to ' + version + '</div><div class="s">Boot verified on slot B. Previous slot kept for rollback.</div></div></div>';
        });
      }
    }, 260);
  }

  // ============================================================ shared bits
  function topbar(title, sub) {
    return '<div class="topbar"><div><h2>' + title + '</h2><div class="sub">' + sub + '</div></div>' +
      '<div class="top-pills" id="topPills"></div></div>';
  }
  function updateTopLink(f) {
    var el = $("#topPills"); if (!el) return;
    var k = f.link.transport;
    el.innerHTML =
      '<span class="pill link-' + k + '"><span class="d"></span>' + f.link.label + ' · ' + f.link.latency_ms + ' ms</span>' +
      '<span class="pill">' + I.bolt + ' ' + Math.round(f.power.battery_pct) + '%' + (f.power.charging ? " ⚡" : "") + '</span>';
  }
  function card(span, icon, title, body, id) {
    return '<div class="card ' + span + '" id="' + id + '"><div class="card-h"><span class="t">' + icon + ' ' + title + '</span></div>' + body + '</div>';
  }
  function spark(id, data, color, lo, hi) {
    var cv = $("#" + id); if (!cv || !data.length) return;
    var w = cv.clientWidth || 280, h = 46; cv.width = w; cv.height = h;
    var x = cv.getContext("2d"); x.clearRect(0, 0, w, h);
    var n = data.length, dx = w / Math.max(1, 59);
    function y(v) { return h - 4 - ((v - lo) / (hi - lo)) * (h - 8); }
    // area
    var grad = x.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + "55"); grad.addColorStop(1, color + "00");
    x.beginPath(); x.moveTo(0, h);
    for (var i = 0; i < n; i++) x.lineTo(i * dx, y(data[i]));
    x.lineTo((n - 1) * dx, h); x.closePath(); x.fillStyle = grad; x.fill();
    // line
    x.beginPath();
    for (var j = 0; j < n; j++) { var px = j * dx, py = y(data[j]); j ? x.lineTo(px, py) : x.moveTo(px, py); }
    x.strokeStyle = color; x.lineWidth = 1.8; x.lineJoin = "round"; x.stroke();
  }
  function roundRect(x, rx, ry, rw, rh, r, fill) {
    x.beginPath(); x.moveTo(rx + r, ry);
    x.arcTo(rx + rw, ry, rx + rw, ry + rh, r); x.arcTo(rx + rw, ry + rh, rx, ry + rh, r);
    x.arcTo(rx, ry + rh, rx, ry, r); x.arcTo(rx, ry, rx + rw, ry, r); x.closePath();
    x.fillStyle = fill; x.fill();
  }
  function set(id, v, html) { var el = $("#" + id); if (el) { if (html) el.innerHTML = v; else el.textContent = v; } }
  function chip(id, text, cls) { var el = $("#" + id); if (el) { el.textContent = text; el.className = "chip" + (cls ? " " + cls : ""); } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ---- redraw radio activity + device screen on an animation cadence ----
  setInterval(function () {
    if (state.connected && state.view === "health" && state.frame)
      ["subghz", "nfc", "rfid", "wifi", "bt"].forEach(function (k) { renderActivity("act-" + k, state.frame.radios[k]); });
    if (state.connected && state.view === "cast" && state.casting) drawDeviceScreen();
  }, 120);

  // ---- alpha flag ----
  document.addEventListener("DOMContentLoaded", function () {
    var c = document.getElementById("alphaClose");
    if (c) c.onclick = function () { document.getElementById("alphaFlag").style.display = "none"; };
  });

  // boot
  renderConnect();
})(typeof window !== "undefined" ? window : this);
