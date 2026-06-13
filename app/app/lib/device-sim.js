/* AXIOM device simulator — a stand-in for on-device `axiomd` until silicon ships.
   Emits telemetry frames matching the PRD §9.2 schema and responds to commands.
   Replace with real BLE/Wi-Fi/USB adapters in Beta; the frame shape stays identical. */
(function (root) {
  "use strict";
  var AXIOM = (root.AXIOM = root.AXIOM || {});

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function walk(v, step, lo, hi) { return clamp(v + (Math.random() - 0.5) * step, lo, hi); }

  function DeviceSim(opts) {
    opts = opts || {};
    this.id = opts.id || "AXIOM-7F3A";
    this.name = opts.name || "AXIOM";
    this.firmware = "1.0.0-alpha";
    this.region = "US";
    // mutable internal state
    this.s = {
      batt: 78, charging: false, cycles: 142, health: 97,
      soc: 41, board: 34,
      cpu: [22, 14, 9, 31, 12, 7, 18, 11], npu: 4,
      ramUsed: 6.2, nvmeUsed: 88,
      radios: {
        subghz: { on: true, band: "433 MHz", act: 0 },
        nfc: { on: true, act: 0 },
        rfid: { on: false, act: 0 },
        wifi: { on: true, ssid: "lab-6e", rssi: -52 },
        bt: { on: true, devices: 2 }
      },
      orientation: "portrait", moving: false,
      gnss: { fix: true, lat: 37.3349, lon: -121.8916 },
      usb: { connected: false, pd: null, watts: 0 }
    };
    this._listeners = [];
    this._timer = null;
  }

  DeviceSim.prototype.onFrame = function (fn) { this._listeners.push(fn); };

  DeviceSim.prototype.start = function () {
    var self = this;
    if (this._timer) return;
    this._timer = setInterval(function () { self._tick(); }, 1000);
    this._tick();
  };
  DeviceSim.prototype.stop = function () { clearInterval(this._timer); this._timer = null; };

  DeviceSim.prototype._tick = function () {
    var s = this.s;
    // compute load random-walks; occasional burst
    var burst = Math.random() < 0.12;
    for (var i = 0; i < 8; i++) s.cpu[i] = walk(s.cpu[i], burst ? 40 : 12, 1, burst ? 96 : 70);
    var cpuAvg = s.cpu.reduce(function (a, b) { return a + b; }, 0) / 8;
    s.npu = walk(s.npu, 8, 0, s.radios.wifi.on ? 60 : 20);
    s.ramUsed = clamp(walk(s.ramUsed, 0.25, 4.5, 14.5), 0, 16);

    // thermals follow load
    var targetSoc = 33 + cpuAvg * 0.45 + s.npu * 0.12;
    s.soc = clamp(s.soc + (targetSoc - s.soc) * 0.25 + (Math.random() - 0.5), 28, 92);
    s.board = clamp(s.board + ((s.soc - 7) - s.board) * 0.2, 26, 80);

    // radios activity
    Object.keys(s.radios).forEach(function (k) {
      var r = s.radios[k];
      if (r.on && "act" in r) r.act = clamp(walk(r.act, 40, 0, 100), 0, 100);
      else if ("act" in r) r.act = 0;
    });
    s.radios.wifi.rssi = Math.round(walk(s.radios.wifi.rssi, 3, -78, -38));

    // power model: drain from load+radios, or charge if plugged
    var radiosOn = Object.keys(s.radios).filter(function (k) { return s.radios[k].on; }).length;
    var drain = 0.02 + cpuAvg * 0.0012 + radiosOn * 0.004; // %/s
    if (s.charging) {
      s.batt = clamp(s.batt + 0.10, 0, 100);
      if (s.batt >= 100) { s.charging = false; }
    } else {
      s.batt = clamp(s.batt - drain, 0, 100);
    }
    s.moving = Math.random() < 0.2;

    this._emit(cpuAvg);
  };

  DeviceSim.prototype._emit = function (cpuAvg) {
    var s = this.s;
    var ttf = s.charging ? Math.round((100 - s.batt) / 0.10 / 60) : null;
    var tte = !s.charging ? Math.round(s.batt / (0.03 + cpuAvg * 0.0012) / 60) : null;
    var frame = {
      ts: Date.now(),
      power: {
        battery_pct: Math.round(s.batt * 10) / 10,
        voltage: Math.round((3.55 + (s.batt / 100) * 0.65) * 100) / 100,
        current_a: s.charging ? 1.6 : -(0.3 + cpuAvg * 0.012),
        charging: s.charging,
        charge_in_w: s.charging ? s.usb.watts || 18 : 0,
        time_to_full_min: ttf, time_to_empty_min: tte,
        cycles: s.cycles, health_pct: s.health
      },
      usb: { connected: s.usb.connected, pd_profile: s.usb.pd, power_w: s.usb.watts },
      thermal: { soc_c: Math.round(s.soc * 10) / 10, board_c: Math.round(s.board * 10) / 10, throttling: s.soc > 85 },
      compute: {
        cpu: s.cpu.map(function (v) { return Math.round(v); }),
        cpu_avg: Math.round(cpuAvg),
        ram_used_gb: Math.round(s.ramUsed * 10) / 10, ram_total_gb: 16,
        npu_pct: Math.round(s.npu)
      },
      storage: {
        nvme_used_gb: Math.round(s.nvmeUsed), nvme_total_gb: 256,
        read_mbs: Math.round(Math.random() * 420), write_mbs: Math.round(Math.random() * 260)
      },
      radios: JSON.parse(JSON.stringify(s.radios)),
      motion: { orientation: s.orientation, moving: s.moving, gnss: s.gnss },
    };
    for (var i = 0; i < this._listeners.length; i++) this._listeners[i](frame);
  };

  /* ----- command surface (what the app calls through the transport) ----- */
  DeviceSim.prototype.setRadio = function (name, on) {
    if (this.s.radios[name]) this.s.radios[name].on = !!on;
  };
  DeviceSim.prototype.setCharging = function (on) {
    this.s.charging = !!on;
    this.s.usb.connected = !!on;
    this.s.usb.pd = on ? "9V/2A" : null;
    this.s.usb.watts = on ? 18 : 0;
  };
  DeviceSim.prototype.cast = function (job) {
    // device "accepts" a cast job; returns ack. Render handled app-side from this payload.
    return { ok: true, accepted: job.type, ts: Date.now() };
  };
  DeviceSim.prototype.checkUpdate = function () {
    return { current: this.firmware, available: "1.1.0-alpha", size_mb: 142, notes: [
      "Faster Sub-GHz scan", "Battery model tuning", "Cast latency improvements", "Security fixes"
    ] };
  };
  DeviceSim.prototype.applyUpdate = function (version) { this.firmware = version; };

  AXIOM.DeviceSim = DeviceSim;
})(typeof window !== "undefined" ? window : this);
