import "./globals.css";

export const metadata = {
  title: "AXIOM — The Pocket Computer With No Limits",
  description:
    "AXIOM combines Flipper-Pro radios (Sub-GHz, RFID, NFC), a flagship Linux SoC, on-device AI, and a 5.9-inch 4K AMOLED touchscreen in a 6×3×1-inch open, repairable pocket computer.",
  metadataBase: new URL("https://get-axiom.vercel.app"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F0F12",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
