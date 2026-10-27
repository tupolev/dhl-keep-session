"use strict";

const DHL_KEEPALIVE_URL = "https://www.dhl.de/de/privatkunden/kundenkonto/meine-sendungen.html";
let inFlight = false;

browser.runtime.onMessage.addListener((message) => {
  if (message?.type !== "DHL_KEEPALIVE") return;
  if (inFlight || location.pathname !== "/de/privatkunden/kundenkonto/meine-sendungen.html") return;

  inFlight = true;
  // Petición GET de la página, con las cookies normales de la sesión.
  // No recarga la pestaña, no toca el DOM y no hace clic en ningún control.
  void fetch(DHL_KEEPALIVE_URL, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(20000)
  }).then((response) => {
    console.debug("[DHL Keepalive] Petición silenciosa:", response.status, response.url);
    if (!response.ok || !response.url.startsWith(DHL_KEEPALIVE_URL)) {
      console.info("[DHL Keepalive] Respuesta no concluyente; puede requerirse nuevo login.");
    }
  }).catch((error) => {
    console.debug("[DHL Keepalive] Falló la petición silenciosa:", error);
  }).finally(() => {
    inFlight = false;
  });
});
