"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import type { ShopCatalog, ShopProduct } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/commerce/types";
import { getProductImage } from "@/lib/commerce/product-images";
import { addSelection, changeSelection, useSelection } from "@/lib/commerce/selection";

const categories = [
  { id: "clothing", title: "Bekleidung" }, { id: "accessories", title: "Accessoires" },
  { id: "equipment", title: "Geräte" }, { id: "supplements", title: "Supplements" },
];
function ProductImage({ product, variantId, index = null, priority = false }: { product: ShopProduct; variantId?: string; index?: number | null; priority?: boolean }) {
  const image = getProductImage(product, variantId, index);
  return image ? <Image src={image.url} alt={image.altText || product.title} fill sizes="(min-width: 900px) 40vw, 90vw" priority={priority} className={`g3-product-image${product.origin ? " g3-product-image-contain" : ""}`} /> : <ShoppingBag size={48} aria-label="Produktbild folgt" />;
}
function Notice({ catalog }: { catalog: ShopCatalog }) {
  return <div className="g3-commerce-notice">{catalog.preview ? "Shop-Vorschau · Musterprodukte und Beispielpreise · Noch kein Verkauf" : !catalog.checkoutEnabled ? "Kollektion in Vorbereitung · Der Kaufabschluss ist noch nicht freigegeben" : "G3 CrossFit · Dein Shop für Training und Alltag"}</div>;
}
function productBadge(product: ShopProduct) {
  return product.origin === "shopify" ? "Shopify-Muster" : product.origin === "sample" ? "Sortimentsvorschlag" : product.concept ? "Konzept" : "Produktart belegt";
}
function ShopNav({ catalog, category }: { catalog: ShopCatalog; category?: string }) {
  const count = useSelection().reduce((sum, l) => sum + l.quantity, 0);
  return <nav className="g3-commerce-nav" aria-label="Shop-Navigation"><Link href="/shop" aria-current={!category ? "page" : undefined}>Alle Artikel</Link>{categories.filter(c => catalog.products.some(p => p.category === c.id)).map(c => <Link key={c.id} href={`/shop/category/${c.id}`} aria-current={category === c.id ? "page" : undefined}>{c.title}</Link>)}<Link className="g3-bag-link" href="/shop/cart"><ShoppingBag size={17} aria-hidden="true" />Warenkorb ({count})</Link></nav>;
}
export default function ShopExperience({ catalog, category, handle, cart = false }: { catalog: ShopCatalog; category?: string; handle?: string; cart?: boolean }) {
  const categoryInfo = categories.find(c => c.id === category);
  const product = catalog.products.find(p => p.handle === handle);
  return <div className="g3-commerce"><Notice catalog={catalog} /><ShopNav catalog={catalog} category={category} />{catalog.error ? <div className="g3-shop-container g3-shop-empty" role="alert"><h1>Die Kollektion lädt gerade nicht.</h1><p>{catalog.error}</p><button className="g3-shop-button" onClick={() => window.location.reload()}>Erneut versuchen</button></div> : cart ? <SelectionCart catalog={catalog} /> : handle ? product ? <ProductDetail key={product.handle} product={product} preview={catalog.preview} /> : <div className="g3-shop-container g3-shop-empty"><h1>Artikel nicht gefunden</h1><Link href="/shop">Zur Kollektion</Link></div> : <Catalog catalog={catalog} category={category} title={categoryInfo?.title} />}</div>;
}
function Catalog({ catalog, category, title }: { catalog: ShopCatalog; category?: string; title?: string }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const products = catalog.products.filter(p => (!category || p.category === category) && p.title.toLocaleLowerCase("de").includes(search.toLocaleLowerCase("de")));
  if (sort !== "default") products.sort((a, b) => (Number(a.variants[0]?.price.amount || 0) - Number(b.variants[0]?.price.amount || 0)) * (sort === "low" ? 1 : -1));
  const hero = catalog.products.find(p => p.handle === "g3-classic-tee") || catalog.products[0];
  return <>
    {!category && <section className="g3-shop-hero"><div><h1>Dein Training.<br />Dein Style.</h1><p>Bekleidung für die Box, Geräte fürs Training und Supplements als Sortimentsvorschläge. Entdecke die G3-Kollektion und weitere Shopify-Musterartikel.</p><a href="#kollektion" className="g3-shop-button">Kollektion entdecken <ArrowUpRight size={18} aria-hidden="true" /></a><small>{catalog.preview ? "Gestaltungs-Mockups und Beispielpreise zur Abstimmung. Noch kein Verkauf." : "Wähle deinen Artikel und die passende Variante."}</small></div>{hero && <Link href={`/shop/${hero.handle}`} className="g3-shop-hero-image" aria-label={`${hero.title} ansehen`}><ProductImage product={hero} priority /></Link>}</section>}
    <section className="g3-shop-container" id="kollektion"><div className="g3-shop-heading"><div>{category ? <h1>{title}</h1> : <h2>Die erste Auswahl</h2>}<p>{`${products.length} Artikel${catalog.preview ? " in der Musterkollektion" : " in der Kollektion"}`}</p></div><div className="g3-shop-filters"><label><span>Artikel suchen</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Artikelname eingeben …" /></label><label><span>Sortierung</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="default">Kollektion</option><option value="low">Preis aufsteigend</option><option value="high">Preis absteigend</option></select></label></div></div>
    {products.length ? <div className="g3-shop-products">{products.map(p => <Link className="g3-shop-card" key={p.id} href={`/shop/${p.handle}`}><div className="g3-shop-card-image"><ProductImage product={p} /></div><div className="g3-shop-card-info"><h3>{p.title}{p.provenance && <span className="g3-product-badge">{productBadge(p)}</span>}</h3><ArrowUpRight size={18} aria-hidden="true" /></div><p>{p.variants.length ? formatPrice(Math.min(...p.variants.map(v => Number(v.price.amount))), p.variants[0].price.currencyCode) : "Preis folgt"}</p><small>{catalog.preview ? "Musterartikel · Beispielpreis" : `${p.variants.length} Varianten`}</small></Link>)}</div> : <div className="g3-shop-empty"><h3>{search ? "Keine passenden Artikel" : "Hier geht es bald weiter."}</h3><p>{search ? "Versuche einen anderen Suchbegriff." : "Sobald die Produkte feststehen, findest du sie hier."}</p><Link href="/shop/category/clothing">Bekleidung entdecken <ArrowRight size={16} aria-hidden="true" /></Link></div>}
    </section><section className="g3-shop-roadmap"><strong>Für Training und Alltag.</strong><p>{catalog.preview ? "Bekleidung, Geräte und Supplements in der Vorschau. Sortiment, Lieferanten und Produktangaben werden vor dem Verkaufsstart abgestimmt." : "Entdecke die Kollektion und wähle deine passenden Trainingsbegleiter."}</p></section>
  </>;
}
function ProductDetail({ product, preview }: { product: ShopProduct; preview: boolean }) {
  const [options, setOptions] = useState<Record<string, string>>(() => Object.fromEntries(product.variants[0]?.selectedOptions.map(o => [o.name, o.value]) || []));
  const [image, setImage] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const variant = product.variants.find(v => v.selectedOptions.every(o => options[o.name] === o.value));
  const optionNames = [...new Set(product.variants.flatMap(v => v.selectedOptions.map(o => o.name)))];
  return <section className="g3-shop-container"><Link className="g3-back" href="/shop">Zurück zur Kollektion</Link><div className="g3-shop-detail"><div><div className="g3-shop-detail-image"><ProductImage product={product} variantId={variant?.id} index={image} priority /></div>{product.images.length > 1 && <div className="g3-shop-thumbs">{product.images.map((img, i) => <button key={img.url} aria-label={`Produktbild ${i + 1}`} aria-pressed={getProductImage(product, variant?.id, image)?.url === img.url} onClick={() => setImage(i)}><Image src={img.url} width={72} height={80} alt="" /></button>)}</div>}</div><div className="g3-shop-detail-copy"><h1>{product.title}</h1>{product.provenance && <span className="g3-product-badge">{productBadge(product)}</span>}<p className="g3-shop-price">{variant ? formatPrice(variant.price.amount, variant.price.currencyCode) : "Diese Kombination ist nicht verfügbar"}</p><p>{product.description}</p>
  {optionNames.map(name => <fieldset key={name}><legend>{name === "Size" ? "Größe" : name === "Color" ? "Farbe" : name}</legend><div className="g3-option-row">{[...new Set(product.variants.flatMap(v => v.selectedOptions.filter(o => o.name === name).map(o => o.value)))].map(value => <button key={value} type="button" aria-pressed={options[name] === value} onClick={() => { setOptions(prev => ({ ...prev, [name]: value })); setImage(null); setMessage(""); }}>{value}</button>)}</div></fieldset>)}
  <label className="g3-quantity-label">Menge<input type="number" min={1} max={20} value={quantity} onChange={e => setQuantity(Math.min(20, Math.max(1, Number(e.target.value) || 1)))} /></label>
  <button className="g3-shop-button" disabled={!variant || (!preview && !variant.availableForSale)} onClick={() => { if (variant) { addSelection(variant.id, quantity); setMessage(`${product.title} wurde deiner Auswahl hinzugefügt.`); } }}>{variant && !preview && !variant.availableForSale ? "Nicht verfügbar" : "In den Warenkorb"}<Plus size={18} aria-hidden="true" /></button><p className="g3-shop-status" role="status">{message}</p>{message && <Link href="/shop/cart">Warenkorb ansehen <ArrowRight size={16} aria-hidden="true" /></Link>}<small>{preview ? "Musterartikel und unverbindliche Auswahl. Es wird keine Bestellung ausgelöst." : "Versand und endgültiger Gesamtbetrag werden im Shopify-Checkout angezeigt."}</small></div></div></section>;
}
function SelectionCart({ catalog }: { catalog: ShopCatalog }) {
  const lines = useSelection();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const resolved = lines.map(line => {
    const product = catalog.products.find(p => p.variants.some(v => v.id === line.variantId));
    return { ...line, product, variant: product?.variants.find(v => v.id === line.variantId) };
  });
  const currencies = new Set(resolved.flatMap(l => l.variant ? [l.variant.price.currencyCode] : []));
  const invalid = resolved.some(l => !l.product || !l.variant || (!catalog.preview && !l.variant.availableForSale)) || currencies.size > 1;
  const subtotal = resolved.reduce((sum, l) => sum + Number(l.variant?.price.amount || 0) * l.quantity, 0);
  async function checkout() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/shopify/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout konnte nicht geöffnet werden.");
      window.location.assign(data.checkoutUrl);
    } catch (e) { setError(e instanceof Error ? e.message : "Bitte versuche es später erneut."); setBusy(false); }
  }
  return <section className="g3-shop-container"><h1>Deine Auswahl</h1>{lines.length ? <div className="g3-cart-layout"><div>{resolved.map(l => <article className="g3-cart-line" key={l.variantId}>{l.product && <Link href={`/shop/${l.product.handle}`} className="g3-cart-image"><ProductImage product={l.product} variantId={l.variantId} /></Link>}<div><h2>{l.product?.title || "Artikel nicht mehr verfügbar"}</h2><p>{l.variant?.title}</p>{l.variant && <p>{formatPrice(l.variant.price.amount, l.variant.price.currencyCode)}</p>}<div className="g3-cart-quantity"><button aria-label={`Menge für ${l.product?.title || "Artikel"} verringern`} onClick={() => changeSelection(l.variantId, l.quantity - 1)}><Minus size={15} /></button><span>{l.quantity}</span><button disabled={l.quantity >= 20} aria-label={`Menge für ${l.product?.title || "Artikel"} erhöhen`} onClick={() => changeSelection(l.variantId, l.quantity + 1)}><Plus size={15} /></button><button aria-label={`${l.product?.title || "Artikel"} entfernen`} onClick={() => changeSelection(l.variantId, 0)}><Trash2 size={15} /></button></div></div></article>)}</div><aside className="g3-cart-summary"><h2>Zusammenfassung</h2><p>Zwischensumme <strong>{currencies.size <= 1 ? formatPrice(subtotal, [...currencies][0] || "EUR") : "Unterschiedliche Währungen"}</strong></p><small>{catalog.preview ? "Beispielpreise. Diese Vorschau nimmt noch keine Bestellungen an." : "Versand, Steuern und endgültiger Gesamtbetrag werden im Shopify-Checkout bestätigt."}</small>{invalid && <p role="alert">Bitte entferne nicht mehr verfügbare Artikel oder Varianten mit einer anderen Währung.</p>}<button className="g3-shop-button" disabled={!catalog.checkoutEnabled || invalid || busy} onClick={checkout}>{catalog.checkoutEnabled ? busy ? "Checkout öffnet …" : "Zu Shopify Checkout" : "Kaufabschluss noch nicht freigegeben"}</button>{error && <p role="alert">{error}</p>}<Link href="/shop">Weiter stöbern</Link></aside></div> : <div className="g3-shop-empty"><ShoppingBag size={42} aria-hidden="true" /><h2>Dein Warenkorb ist noch leer.</h2><p>Finde deinen Artikel und wähle die passende Variante.</p><Link href="/shop" className="g3-shop-button">Zur Kollektion <ArrowRight size={18} /></Link></div>}</section>;
}
