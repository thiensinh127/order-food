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
  const [navbar, exploreMenu, footer, foodItem, navbarStyles, footerStyles, foodItemStyles] = await Promise.all([
    source("../src/components/Navbar/Navbar.jsx"),
    source("../src/components/ExploreMenu/ExploreMenu.jsx"),
    source("../src/components/Footer/Footer.jsx"),
    source("../src/components/FoodItem/FoodItem.jsx"),
    source("../src/components/Navbar/Navbar.css"),
    source("../src/components/Footer/Footer.css"),
    source("../src/components/FoodItem/FoodItem.css"),
  ]);

  assert.match(navbar, /<ul className="navbar-menu">\s*<li>/);
  assert.match(navbar, /width=\{173\}\s+height=\{34\}/);
  assert.match(footer, /width=\{173\}\s+height=\{34\}/);
  assert.match(foodItem, /width=\{95\}\s+height=\{19\}/);
  assert.match(exploreMenu, /width=\{131\}\s*height=\{131\}/);
  assert.match(navbarStyles, /\.navbar \.logo\s*\{[^}]*height:\s*auto/);
  assert.match(footerStyles, /\.footer-content-left img\s*\{[^}]*height:\s*auto/);
  assert.match(foodItemStyles, /\.food-item-name-rating img\s*\{[^}]*height:\s*auto/);
});

test("keeps mobile forms stable while the keyboard and autofill are active", async () => {
  const [loginStyles, checkoutStyles] = await Promise.all([
    source("../src/components/LoginPopup/LoginPopup.css"),
    source("../src/pages/PlaceOrder/PlaceOrder.css"),
  ]);

  assert.match(loginStyles, /height:\s*100dvh/);
  assert.match(loginStyles, /overflow-y:\s*auto/);
  assert.match(loginStyles, /:-webkit-autofill/);
  assert.match(loginStyles, /font-size:\s*16px/);
  assert.match(checkoutStyles, /font-size:\s*16px/);
});

test("prevents duplicate login submissions and reports request failures", async () => {
  const loginPopup = await source("../src/components/LoginPopup/LoginPopup.jsx");

  assert.match(loginPopup, /const \[isSubmitting, setIsSubmitting\] = useState\(false\)/);
  assert.match(loginPopup, /disabled=\{isSubmitting\}/);
  assert.match(loginPopup, /catch \(error\) \{/);
  assert.match(loginPopup, /toast\.error/);
});
