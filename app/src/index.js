const express = require('express');
const os = require('os');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_VERSION = process.env.APP_VERSION || '1.0.0';
const startTime = Date.now();

// Prometheus metrics setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Middleware to record metrics on every request
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    const labels = { method: req.method, route, status: res.statusCode };
    httpRequestsTotal.inc(labels);
    end(labels);
  });
  next();
});

// Main endpoint — returns app info as JSON
app.get('/', (req, res) => {
  res.json({
    app: 'gitops-demo-app',
    version: APP_VERSION,
    hostname: os.hostname(),
    uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
    message: 'Deployed via ArgoCD GitOps pipeline',
  });
});

// Health endpoint — used by Kubernetes liveness/readiness probes
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Prometheus scraping endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`gitops-demo-app v${APP_VERSION} listening on port ${PORT}`);
});
