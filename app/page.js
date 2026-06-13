import { readFile } from "node:fs/promises";
import path from "node:path";
import LandingScript from "./LandingScript";

export const metadata = {
  title: "AXIOM — The Pocket Computer With No Limits | Kickstarter",
  description:
    "Every radio a hacker wants, the horsepower of a flagship computer, and a 4K AMOLED touchscreen — in a 6×3×1-inch pocket computer. Back AXIOM on Kickstarter.",
};

// The marketing markup lives as an HTML partial (content/landing-body.html) and is
// rendered by this Server Component; LandingScript wires up the interactive behaviour.
export default async function Home() {
  const html = await readFile(
    path.join(process.cwd(), "content", "landing-body.html"),
    "utf8"
  );
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <LandingScript />
    </>
  );
}
