/* AXIOM transport layer (PRD §8 / AX-111).
   One session abstraction over three transports. Today only SimTransport is wired;
   BleTransport / WifiTransport / UsbTransport are declared as the future swap-in surface
   with the identical interface, so the app never changes when real radios arrive. */
(function (root) {
  "use strict";
  var AXIOM = (root.AXIOM = root.AXIOM || {});

  // latency/bandwidth characteristics per transport (ms)
  var PROFILES = {
    ble:  { label: "Bluetooth LE 5.3", latency: [60, 120], bandwidth: "low",  good: "control + telemetry" },
    wifi: { label: "Wi-Fi 6E",         latency: [8, 40],   bandwidth: "high", good: "casting + sync" },
    usb:  { label: "USB-C",            latency: [2, 10],   bandwidth: "max",  good: "setup + bulk" }
  };

  function rnd(a, b) { return Math.round(a + Math.random() * (b - a)); }

  /* Base interface every transport implements. */
  function Transport(kind) { this.kind = kind; this.profile = PROFILES[kind]; }
  Transport.prototype.measureLatency = function () {
    var p = this.profile.latency; return rnd(p[0], p[1]);
  };

  /* The simulator-backed transport used in Alpha. */
  function SimTransport(device) {
    Transport.call(this, "ble");
    this.device = device;
    this._frameCb = null;
  }
  SimTransport.prototype = Object.create(Transport.prototype);
  SimTransport.prototype.connect = function () {
    var self = this;
    this.device.onFrame(function (f) {
      // stamp the active link quality/latency onto every frame
      f.link = {
        transport: self.kind,
        label: self.profile.label,
        quality_pct: clampQuality(self.kind),
        latency_ms: self.measureLatency()
      };
      if (self._frameCb) self._frameCb(f);
    });
    this.device.start();
    return Promise.resolve({ ok: true });
  };
  SimTransport.prototype.onFrame = function (cb) { this._frameCb = cb; };
  SimTransport.prototype.send = function (cmd, args) {
    // routes a command to the device; mimics round-trip latency
    var self = this, dev = this.device;
    return new Promise(function (resolve) {
      setTimeout(function () {
        var res;
        switch (cmd) {
          case "setRadio": dev.setRadio(args.name, args.on); res = { ok: true }; break;
          case "setCharging": dev.setCharging(args.on); res = { ok: true }; break;
          case "cast": res = dev.cast(args); break;
          case "checkUpdate": res = dev.checkUpdate(); break;
          case "applyUpdate": dev.applyUpdate(args.version); res = { ok: true }; break;
          default: res = { ok: false, error: "unknown command" };
        }
        resolve(res);
      }, self.measureLatency());
    });
  };
  // hand the session to a higher-bandwidth transport (e.g. when casting)
  SimTransport.prototype.upgrade = function (kind) {
    if (!PROFILES[kind]) return false;
    this.kind = kind; this.profile = PROFILES[kind];
    return true;
  };

  function clampQuality(kind) {
    if (kind === "usb") return 100;
    if (kind === "wifi") return rnd(82, 98);
    return rnd(55, 85); // ble
  }

  /* Connection manager: discovery + session lifecycle (single source of truth). */
  function ConnectionManager() { this.transport = null; this.session = null; }
  ConnectionManager.prototype.discover = function () {
    // simulate a short scan returning one nearby device
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve([{ id: "AXIOM-7F3A", rssi: -47, model: "AXIOM Rev. C" }]);
      }, 1400);
    });
  };
  ConnectionManager.prototype.pair = function (device, code) {
    // simulate encrypted key exchange (no plaintext PSK — see PRD §9.1)
    return new Promise(function (resolve) {
      setTimeout(function () { resolve({ ok: true, keyId: "k_" + code }); }, 1100);
    });
  };
  ConnectionManager.prototype.attach = function (transport) {
    this.transport = transport;
    return transport.connect();
  };

  AXIOM.PROFILES = PROFILES;
  AXIOM.SimTransport = SimTransport;
  AXIOM.ConnectionManager = ConnectionManager;
  // future swap-ins — declared so the contract is explicit:
  AXIOM.BleTransport = AXIOM.WifiTransport = AXIOM.UsbTransport = null;
})(typeof window !== "undefined" ? window : this);
