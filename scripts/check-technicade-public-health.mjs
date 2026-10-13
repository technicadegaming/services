#!/usr/bin/env node
// Read-only public HTTP smoke check for Technicade customer-facing domains.
// No authentication, payments, customer data, or API usage is required.
// Vercel READY / DNS records are insufficient without an actual HTTPS response.
const targets = [
  { name: "Technicade main website", url: "https://technicade.tech/", required: true },
  { name: "Technicade services", url: "https://services.technicade.tech/", required: true },
  { name: "Technicade digital store", url: "https://store.technicade.tech/", required: true },
  { name: "Technicade Tools", url: "https://tools.technicade.tech/", required: true },
  { name: "DoneDate", url: "https://donedate.technicade.tech/", required: true },
  { name: "Shift Check", url: "https://shiftcheck.technicade.tech/", required: true },
  { name: "Equipment QR", url: "https://equipmentqr.technicade.tech/", required: true },
  { name: "ExceptionDesk", url: "https://exceptiondesk.technicade.tech/", required: true },
  // API-backed search is pending owner-supplied Google Places credentials.
  // Keep the domain visible in monitoring without blocking the other apps.
  { name: "WhatToDoNow (awaiting API setup)", url: "https://whattodonow.technicade.tech/", required: false },
];

async function request(target) {
  const start = Date.now();
  try {
    const response = await fetch(target.url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
      headers: {
        "User-Agent": "Technicade-Public-Health/1.0 (GitHub Actions; no customer session)",
        "Accept": "text/html,application/xhtml+xml",
      },
    });
    await response.body?.cancel();
    const finalUrl = new URL(response.url);
    const ok = response.status >= 200 && response.status < 400 &&
      finalUrl.protocol === "https:";
    return {
      ok,
      detail: `HTTP ${response.status}, ${Date.now() - start} ms, ${finalUrl.hostname}`,
    };
  } catch (error) {
    const name = error instanceof Error ? error.name : "network error";
    return { ok: false, detail: `${name} after ${Date.now() - start} ms` };
  }
}

let failures = 0;
let warnings = 0;
for (const target of targets) {
  let result = await request(target);
  // Retry transient upstream/network failures once. Do not retry missing pages.
  if (!result.ok && !result.detail.startsWith("HTTP 4")) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    result = await request(target);
  }
  const label = result.ok ? "PASS" : target.required ? "FAIL" : "WARN";
  console.log(`${label}: ${target.name} — ${result.detail}`);
  if (!result.ok && target.required) failures++;
  if (!result.ok && !target.required) warnings++;
}
console.log(`Checked ${targets.length} public endpoints: ${failures} required failures; ${warnings} optional warnings.`);
if (failures) process.exitCode = 1;
