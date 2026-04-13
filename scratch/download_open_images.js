const fs = require('fs');
const path = require('path');

const categories = {
  timepieces: 'wristwatch stainless steel',
  jewelry: 'jewellery necklace',
  cameras: 'camera photography',
  electronics: 'consumer electronics gadget',
  fashion: 'fashion clothing',
  footwear: 'shoes sneakers',
  leather: 'leather handbag',
  books: 'books reading library',
  beauty: 'cosmetics beauty product',
  sports: 'sports fitness equipment',
  home: 'furniture interior',
  toys: 'children toys',
  grocery: 'grocery food market',
  mobile: 'smartphone mobile phone',
  product: 'luxury product'
};

const allowedLicenses = [/cc0/i, /public domain/i, /cc-by/i, /cc by/i, /cc-by-sa/i, /cc by-sa/i];
const outDir = path.join(process.cwd(), 'public', 'images', 'categories');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function isAllowedLicense(md) {
  const txt = `${md?.LicenseShortName?.value || ''} ${md?.License?.value || ''}`;
  return allowedLicenses.some((re) => re.test(txt));
}

async function fetchJson(url, retries = 5) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'ObsidianCurator/1.0 (local-assets)' } });
    if (res.status === 429) {
      await sleep(1200 * (i + 1));
      continue;
    }
    if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
    return res.json();
  }
  throw new Error('Too many 429 responses');
}

async function getImageUrl(query) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrlimit: '30',
    gsrenablerewrites: '1',
    gsrnamespace: '6',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '1200'
  });

  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
  const json = await fetchJson(url);
  const pages = Object.values((json.query && json.query.pages) || {});

  for (const page of pages) {
    const info = page.imageinfo && page.imageinfo[0];
    if (!info) continue;
    if (!isAllowedLicense(info.extmetadata || {})) continue;
    const candidate = info.thumburl || info.url;
    if (!candidate || !/\.(jpg|jpeg|png|webp)$/i.test(candidate)) continue;
    return candidate;
  }

  return null;
}

async function download(url, targetPath) {
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'ObsidianCurator/1.0 (local-assets)' } });
    if (res.status === 429) {
      await sleep(1500 * (i + 1));
      continue;
    }
    if (!res.ok) throw new Error(`Download failed ${res.status} ${url}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(targetPath, bytes);
    return;
  }
  throw new Error(`Unable to download after retries: ${url}`);
}

(async () => {
  const existing = new Set(fs.readdirSync(outDir).map((f) => path.parse(f).name));

  for (const [key, query] of Object.entries(categories)) {
    if (existing.has(key)) {
      console.log(`SKIP ${key}`);
      continue;
    }

    try {
      const imageUrl = await getImageUrl(query);
      if (!imageUrl) {
        console.log(`NO_IMAGE ${key}`);
        continue;
      }

      const ext = path.extname(imageUrl).toLowerCase() || '.jpg';
      const output = path.join(outDir, `${key}${ext}`);
      await download(imageUrl, output);
      console.log(`DOWNLOADED ${key} -> ${path.basename(output)}`);
      await sleep(900);
    } catch (error) {
      console.log(`FAILED ${key} ${String(error.message || error)}`);
    }
  }
})();
