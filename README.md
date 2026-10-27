# DHL Keep Session

Firefox extension that attempts to keep the [DHL Germany shipment tracking page](https://www.dhl.de/de/privatkunden/kundenkonto/meine-sendungen.html) session active.

While the tracking page is open, it sends a silent request every 3 minutes without reloading the tab.

## Firefox

The extension source is in [`firefox/`](firefox/).

To test it, open `about:debugging#/runtime/this-firefox`, select **Load Temporary Add-on**, and choose `firefox/manifest.json`.

**Note:** DHL may use a separate session-renewal mechanism or an absolute session timeout. The keepalive request is not guaranteed to prevent logout.
