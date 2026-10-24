import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));

function loadSource(relativePath) {
  const filename = path.join(testDirectory, '..', relativePath);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, URL }, { filename });
  return loadedModule.exports;
}

const { serializeJsonLd } = loadSource('src/lib/serialize-json-ld.ts');
const { getPublicCalendarUrl } = loadSource('src/lib/public-calendar.ts');

test('JSON-LD cannot terminate its script element and round-trips unchanged', () => {
  const data = { name: '</script><script>alert("x")</script>', nested: { value: '<&>' } };
  const serialized = serializeJsonLd(data);
  assert.ok(!serialized.includes('<'));
  assert.ok(serialized.includes('\\u003c/script>'));
  assert.deepEqual(JSON.parse(serialized), data);
});

test('JSON-LD preserves normal public facts and Unicode', () => {
  const data = { name: 'G3 CrossFit', address: 'Tempelhofer Ufer 36', note: 'für dich' };
  assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
});

test('no public calendar is advertised when configuration is missing or invalid', () => {
  for (const value of [undefined, '', '   ', '/schedule', 'not a url', 'javascript:alert(1)', 'http://example.com']) {
    assert.equal(getPublicCalendarUrl(value), null);
  }
});

test('a configured HTTPS calendar URL is preserved', () => {
  assert.equal(getPublicCalendarUrl('https://app.wodify.com/calendar?tenant=verified'), 'https://app.wodify.com/calendar?tenant=verified');
});

const { validateLines, isSafeCheckoutUrl } = loadSource('src/lib/commerce/validation.ts');

test('checkout accepts variant IDs and quantities only, never client prices', () => {
  const input = [{ variantId: 'gid://shopify/ProductVariant/123', quantity: 2, price: 0.01 }];
  assert.deepEqual(JSON.parse(JSON.stringify(validateLines(input))), [{ variantId: input[0].variantId, quantity: 2 }]);
});

test('checkout rejects malformed, duplicate and excessive cart lines', () => {
  const variantId = 'gid://shopify/ProductVariant/123';
  for (const input of [null, {}, [], [{ variantId: '123', quantity: 1 }], [{ variantId, quantity: -1 }], [{ variantId, quantity: 0 }], [{ variantId, quantity: 21 }], [{ variantId, quantity: 1.2 }], [{ variantId, quantity: '1' }], [{ variantId, quantity: 1 }, { variantId, quantity: 2 }], Array.from({ length: 51 }, (_, i) => ({ variantId: `gid://shopify/ProductVariant/${i}`, quantity: 1 }))]) {
    assert.equal(validateLines(input), null);
  }
});

test('checkout redirects only to the configured shop or Shopify checkout hosts', () => {
  const domain = 'g3.myshopify.com';
  assert.equal(isSafeCheckoutUrl('https://g3.myshopify.com/checkouts/abc', domain), true);
  assert.equal(isSafeCheckoutUrl('https://checkout.shopify.com/abc', domain), true);
  for (const url of ['http://g3.myshopify.com/checkouts', 'https://g3.myshopify.com.evil.test/', 'https://evil.test/', 'javascript:alert(1)', 'https://user:password@g3.myshopify.com/']) {
    assert.equal(isSafeCheckoutUrl(url, domain), false);
  }
});

const { getProductImage } = loadSource('src/lib/commerce/product-images.ts');
const expanded = JSON.parse(fs.readFileSync(path.join(testDirectory, '../src/data/shopify-preview.json'), 'utf8'));
const merch = { products: expanded.products.filter(p => !p.origin) };

test('G3 presentation contains exactly eight products with correct provenance and dedicated color images', () => {
  assert.equal(merch.products.length, 8);
  assert.equal(merch.products.filter(p => p.concept).length, 6);
  assert.deepEqual(merch.products.filter(p => !p.concept).map(p => p.handle), ['g3-college-jacke', 'g3-tasse']);
  for (const product of merch.products) {
    const colors = [...new Set(product.variants.map(v => v.selectedOptions.find(o => o.name === 'Farbe').value))];
    assert.equal(product.images.length, colors.length);
    assert.equal(new Set(product.images.map(i => i.url)).size, colors.length);
    for (const v of product.variants) {
      assert.ok(product.images.some(i => i.url === v.image.url));
      assert.ok(fs.existsSync(path.join(testDirectory, '../public', v.image.url)));
    }
  }
});

test('main and cart images follow the selected variant, with a safe gallery fallback', () => {
  const p = merch.products.find(p => p.handle === 'g3-classic-tee');
  const dark = p.variants.find(v => v.title === 'L / Unisex / Anthrazit');
  const white = p.variants.find(v => v.title === 'L / Unisex / Weiß');
  assert.notEqual(getProductImage(p, dark.id).url, getProductImage(p, white.id).url);
  assert.equal(getProductImage(p, white.id).url, white.image.url);
  assert.equal(getProductImage(p, white.id, 0).url, p.images[0].url);
  assert.equal(getProductImage(p, white.id, null).url, white.image.url);
  assert.equal(getProductImage(p, 'missing').url, p.images[0].url);
  assert.equal(getProductImage({ ...p, images: [], variants: [] }), undefined);
});

test('concept variant IDs are usable for preview selection but never accepted for checkout', () => {
  const lines = [{ variantId: merch.products[0].variants[0].id, quantity: 1 }];
  assert.equal(validateLines(lines), null);
  assert.ok(validateLines(lines, true));
});


test('expanded catalog preserves Shopify products and fills every advertised category with isolated samples', () => {
  const products = expanded.products;
  assert.equal(products.length, 51);
  assert.equal(new Set(products.map(p => p.handle)).size, products.length);
  assert.equal(products.filter(p => p.origin === 'shopify').length, 29);
  assert.equal(products.filter(p => p.category === 'equipment').length, 8);
  assert.equal(products.filter(p => p.category === 'supplements').length, 6);
  const ids = products.flatMap(p => p.variants.map(v => v.id));
  assert.equal(new Set(ids).size, ids.length);
  for (const p of products.filter(p => p.origin === 'sample')) {
    assert.equal(p.concept, true);
    for (const v of p.variants) {
      assert.equal(v.price.currencyCode, 'EUR');
      assert.ok(v.image);
      assert.equal(validateLines([{ variantId: v.id, quantity: 1 }]), null);
      assert.ok(validateLines([{ variantId: v.id, quantity: 1 }], true));
    }
  }
  const shirt = products.find(p => p.handle === 'workout-shirt');
  const olive = shirt.variants.find(v => v.selectedOptions.some(o => o.value === 'Olive'));
  assert.ok(olive.image);
  assert.equal(getProductImage(shirt, olive.id).url, olive.image.url);
  assert.notEqual(olive.image.url, shirt.images[0].url);
});

const { sequenceFrame, sequenceProgress, containedFrame } = loadSource('src/lib/scroll-sequence.ts');
test('scroll sequence clamps progress and maps both endpoints to actual frames', () => {
  assert.equal(sequenceFrame(0, 240), 0);
  assert.equal(sequenceFrame(1, 240), 239);
  assert.equal(sequenceFrame(-1, 240), 0);
  assert.equal(sequenceFrame(2, 240), 239);
  assert.equal(sequenceFrame(NaN, 240), 0);
  assert.equal(sequenceProgress(50, 100, 500), 0);
  assert.equal(sequenceProgress(300, 100, 500), .5);
  assert.equal(sequenceProgress(600, 100, 500), 1);
  assert.equal(sequenceProgress(100, 100, 100), 0);
});
test('scroll sequence contains the complete scene on portrait and landscape canvases', () => {
  const portrait = containedFrame(390, 600, 960, 540);
  assert.equal(portrait.width, 390);
  assert.equal(portrait.x, 0);
  assert.ok(portrait.y > 0);
  const wide = containedFrame(1400, 500, 960, 540);
  assert.equal(wide.height, 500);
  assert.ok(wide.x > 0);
});
test('all 240 scroll frames exist and remain within the prototype transfer budget', () => {
  const folder = path.join(testDirectory, '../public/sequences/g3-owner-tour');
  const manifest = JSON.parse(fs.readFileSync(path.join(folder, 'manifest.json'), 'utf8'));
  assert.equal(manifest.frameCount, 240);
  let bytes = 0;
  for (let i = 0; i < manifest.frameCount; i++) bytes += fs.statSync(path.join(folder, `${String(i).padStart(4, '0')}.webp`)).size;
  assert.equal(bytes, manifest.bytes);
  assert.ok(bytes < 12 * 1024 * 1024);
});


const { coveredFrame } = loadSource('src/lib/scroll-sequence.ts');
test('hero cover fills the frame while preserving the source aspect ratio', () => {
  const rect = coveredFrame(1440, 1000, 960, 540);
  assert.ok(rect.width >= 1440 && rect.height >= 1000);
  assert.ok(Math.abs(rect.width / rect.height - 960 / 540) < 1e-10);
  assert.ok(rect.x <= 0 && rect.y <= 0);
});
