import { Registry, Counter } from 'prom-client';

let register: Registry;

if (global.prometheusRegistry) {
  register = global.prometheusRegistry;
} else {
  register = new Registry();
  global.prometheusRegistry = register;
}

export const scanCounter =
  (global.scanCounter as Counter<string>) ||
  new Counter({
    name: 'qrcode_scans_total',
    help: 'Total number of QR code scans',
    labelNames: ['short_code', 'target_url'],
    registers: [register],
  });

if (!global.scanCounter) {
  global.scanCounter = scanCounter;
}

export { register };

declare global {
  var prometheusRegistry: Registry | undefined;
  var scanCounter: Counter<string> | undefined;
}
