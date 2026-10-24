"use client";

import { useSyncExternalStore } from "react";
import { validateLines } from "./validation";
import type { SelectionLine } from "./types";
const key = "g3-shopify-selection-v1";
const event = "g3-shop-selection";
let memory = "[]";
function snapshot() { try { return localStorage.getItem(key) || memory; } catch { return memory; } }
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(event, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(event, callback); };
}
function parse(raw: string): SelectionLine[] {
  try { return validateLines(JSON.parse(raw), true) || []; } catch { return []; }
}
export function useSelection() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  return parse(raw);
}
export function changeSelection(variantId: string, quantity: number) {
  const lines = parse(snapshot()).filter(l => l.variantId !== variantId);
  if (quantity > 0) lines.push({ variantId, quantity });
  if (lines.length && !validateLines(lines, true)) return;
  memory = JSON.stringify(lines);
  try { localStorage.setItem(key, memory); } catch { /* Keep this tab's selection in memory. */ }
  window.dispatchEvent(new Event(event));
}
export function addSelection(variantId: string, quantity: number) {
  const current = parse(snapshot()).find(l => l.variantId === variantId)?.quantity || 0;
  changeSelection(variantId, Math.min(20, current + quantity));
}
