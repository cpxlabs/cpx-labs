import puppeteer from "puppeteer";

// NOTE: Keep in sync with src/app/portfolio/page.tsx projects array.
// Both files must be updated when adding or removing a project.
const sites = [
  { name: "smokebuzz", url: "https://smokebuzz.vercel.app" },
  { name: "openband", url: "https://openband-one.vercel.app" },
  { name: "cazimu", url: "https://cazimu-site.vercel.app" },
  { name: "lillys-box", url: "https://pet-care-game.vercel.app" },
  { name: "log-tower", url: "https://fullstack-log-tower.vercel.app" },
  { name: "hemp", url: "https://saudade-rn.vercel.app" },
  { name: "mr-bands", url: "https://mr-bands.vercel.app" },
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

for (const site of sites) {
  console.log(`Screenshotting ${site.name}...`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  try {
    await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await wait(3000);
    await page.screenshot({ path: `public/portfolio/${site.name}.png`, fullPage: false });
    console.log(`  Done: ${site.name}`);
  } catch (e) {
    console.log(`  Error on ${site.name}: ${e.message}`);
    try {
      await page.screenshot({ path: `public/portfolio/${site.name}.png`, fullPage: false });
      console.log(`  Partial screenshot saved for ${site.name}`);
    } catch (e2) {
      console.error(`  Failed to capture partial screenshot for ${site.name}: ${e2.message}`);
    }
  }
  await page.close();
}

await browser.close();
console.log("All screenshots done.");
