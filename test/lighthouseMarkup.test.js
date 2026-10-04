import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("provides the page landmark, description, and discoverable hero image", async () => {
  const [app, document] = await Promise.all([
    source("../src/App.jsx"),
    source("../index.html"),
  ]);

  assert.match(app, /<main/);
  assert.match(document, /name="description"/);
  assert.match(document, /rel="preload" href="\/header_img\.webp" as="image" fetchpriority="high"/);
});

test("uses list items for navigation and declares menu-image dimensions", async () => {
  const [navbar, exploreMenu] = await Promise.all([
    source("../src/components/Navbar/Navbar.jsx"),
    source("../src/components/ExploreMenu/ExploreMenu.jsx"),
  ]);

  assert.match(navbar, /<ul className="navbar-menu">\s*<li>/);
  assert.match(exploreMenu, /width=\{131\}\s*height=\{131\}/);
});
