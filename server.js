const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { createState } = require('./src/data');
const { findNearbyDrivers, calculateFare, buildAdminAnalytics } = require('./src/matching');

const port = process.env.PORT || 3000;
const state = createState();
const publicDir = path.join(__dirname, 'public');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function serveStatic(res, pathname) {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(publicDir, requestedPath);

  if (!filePath.startsWith(publicDir)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = requestUrl;

  try {
    if (req.method === 'GET' && pathname === '/api/state') {
      sendJson(res, 200, {
        passengers: state.passengers,
        drivers: state.drivers,
        trips: state.trips,
        analytics: buildAdminAnalytics(state),
      });
      return;
    }

    if (req.method === 'GET' && pathname.startsWith('/api/passengers/') && pathname.endsWith('/matches')) {
      const passengerId = pathname.split('/')[3];
      const passenger = state.passengers.find((item) => item.id === passengerId);
      if (!passenger) {
        sendJson(res, 404, { error: 'Passenger not found' });
        return;
      }
      sendJson(res, 200, {
        passenger,
        matches: findNearbyDrivers(passenger, state.drivers),
        tripFare: calculateFare(passenger.location, passenger.destination),
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/trips/request') {
      const { passengerId, driverId } = await collectBody(req);
      const passenger = state.passengers.find((item) => item.id === passengerId);
      const driver = state.drivers.find((item) => item.id === driverId);

      if (!passenger || !driver) {
        sendJson(res, 404, { error: 'Passenger or driver not found' });
        return;
      }

      const trip = {
        id: `trip-${state.trips.length + 1}`,
        passengerId,
        driverId,
        pickup: passenger.location,
        destination: passenger.destination,
        fare: calculateFare(passenger.location, passenger.destination),
        status: 'accepted',
        route: ['heading_to_pickup', 'passenger_onboard', 'arrived'],
        createdAt: new Date().toISOString(),
      };

      driver.status = 'busy';
      driver.activeTripId = trip.id;
      state.trips.push(trip);
      sendJson(res, 201, { trip, analytics: buildAdminAnalytics(state) });
      return;
    }

    if (req.method === 'POST' && pathname.startsWith('/api/trips/') && pathname.endsWith('/complete')) {
      const tripId = pathname.split('/')[3];
      const trip = state.trips.find((item) => item.id === tripId);
      if (!trip) {
        sendJson(res, 404, { error: 'Trip not found' });
        return;
      }

      const driver = state.drivers.find((item) => item.id === trip.driverId);
      if (driver) {
        driver.status = 'available';
        driver.activeTripId = null;
        driver.earnings += trip.fare;
        driver.completedTrips += 1;
      }

      trip.status = 'completed';
      trip.completedAt = new Date().toISOString();
      sendJson(res, 200, { trip, analytics: buildAdminAnalytics(state) });
      return;
    }

    if (req.method === 'GET') {
      serveStatic(res, pathname);
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    sendJson(res, 500, { error: 'Server error', details: error.message });
  }
});

server.listen(port, () => {
  console.log(`RIDEX demo running at http://localhost:${port}`);
});
