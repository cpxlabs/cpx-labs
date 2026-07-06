const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

const PORT = 3002;
const BASE_URL = `http://localhost:${PORT}`;
const MARKETING_DIR = path.join(__dirname, "..", "marketing");

// Ensure marketing directory exists
if (!fs.existsSync(MARKETING_DIR)) {
  fs.mkdirSync(MARKETING_DIR, { recursive: true });
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("Starting Next.js production server on port", PORT);
  
  // Start the Next.js server
  const server = spawn("npx", ["next", "start", "-p", PORT.toString()], {
    cwd: path.join(__dirname, ".."),
    shell: true,
    stdio: "inherit",
  });

  // Give the server 5 seconds to boot up
  await wait(5000);

  let browser;
  try {
    console.log("Launching browser with Puppeteer...");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

    const screens = [
      { name: "home.png", url: "/" },
      { name: "servicos.png", url: "/servicos" },
      { name: "quem-somos.png", url: "/quem-somos" },
      { name: "contato.png", url: "/contato" },
    ];

    for (const screen of screens) {
      const fullUrl = `${BASE_URL}${screen.url}`;
      console.log(`Navigating to ${fullUrl}...`);
      
      // Navigate and wait until network is idle
      await page.goto(fullUrl, { waitUntil: "networkidle2" });
      
      // Wait for animations and Three.js icosahedron/particles to settle
      console.log("Waiting for animations and 3D scenes to settle...");
      await wait(3000);

      const targetPath = path.join(MARKETING_DIR, screen.name);
      console.log(`Saving full-page screenshot to ${targetPath}...`);
      await page.screenshot({
        path: targetPath,
        fullPage: true,
      });
    }

    console.log("All screenshots captured successfully!");
  } catch (error) {
    console.error("An error occurred during screenshot capture:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
    console.log("Stopping Next.js server...");
    server.kill();
    // Force exit process in case spawn process hangs
    process.exit(0);
  }
}

run();
