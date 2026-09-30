import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Element = dom.window.Element;
globalThis.Node = dom.window.Node;
globalThis.SVGElement = dom.window.SVGElement;
globalThis.CustomEvent = dom.window.CustomEvent;
globalThis.Event = dom.window.Event;
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
globalThis.getComputedStyle = () => ({ getPropertyValue: () => "" });

const screens = [
  "Welcome",
  "Dashboard",
  "Focus",
  "FocusDrive",
  "Play",
  "Chakravyuha",
  "Mahabharata",
  "Traditions",
  "Discover",
  "Create",
  "Report",
  "HowItWorks",
  "Privacy",
];

const { renderToString } = await import("react-dom/server");
const React = (await import("react")).default;
const { MemoryRouter } = await import("react-router-dom");
const { AppProvider } = await import("../src/lib/store.jsx");

let failed = 0;
for (const name of screens) {
  const mod = await import(`../src/screens/${name}.jsx`);
  const Screen = mod.default;
  try {
    const html = renderToString(
      React.createElement(AppProvider, null, React.createElement(MemoryRouter, null, React.createElement(Screen))),
    );
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(`OK   ${name.padEnd(13)} ${String(html.length).padStart(6)} chars  "${text.slice(0, 62)}"`);
  } catch (err) {
    failed += 1;
    console.log(`FAIL ${name.padEnd(13)} ${err.message}`);
    console.log(String(err.stack).split("\n").slice(0, 6).join("\n"));
  }
}
console.log(failed === 0 ? "\nAll screens rendered." : `\n${failed} screen(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
