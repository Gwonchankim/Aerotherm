// Renders every frame of both propagation GIFs with headless Chromium.
// Usage: node render.cjs <frames-dir>
// Writes <frames-dir>/{without,with}/01.png … 64.png (2400 × 1350) and <frames-dir>/geometry.json.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const out = path.resolve(process.argv[2] || 'frames');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 675 } });
  await page.goto('file://' + path.resolve(__dirname, 'render.html'));
  for (const variant of ['without', 'with']) {
    fs.mkdirSync(path.join(out, variant), { recursive: true });
    for (let f = 1; f <= 64; f++) {
      const url = await page.evaluate(([v, n]) => draw(v, n), [variant, f]);
      const file = path.join(out, variant, String(f).padStart(2, '0') + '.png');
      fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
    }
  }
  fs.writeFileSync(path.join(out, 'geometry.json'), JSON.stringify(await page.evaluate(() => geometry())));
  await browser.close();
  console.log('frames written to', out);
})();
