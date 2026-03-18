# RIDEX Taxi Apps Demo

RIDEX is a demo taxi platform that contains three apps in one project:

- **Passenger App**: sign-up, booking, live driver tracking, fare calculation, and payment options.
- **Driver App**: driver registration, accept/reject ride flow, GPS navigation preview, and earnings dashboard.
- **Admin Panel**: management analytics for users, drivers, payments, and completed trips.

## Matching and fare algorithm

This demo follows the requested taxi logic:

1. **Fare rule**: every **100 meters = 1,000 IQD**.
2. Two passengers are seeded in the system:
   - Passenger **A** at point **m**.
   - Passenger **B** at point **n**.
   - Both want to go to point **C**.
3. Drivers **O, P, Q** are placed close to the two passengers.
4. Drivers **S, L** are farther away, beyond the preferred pickup zone.
5. When a passenger requests a taxi:
   - RIDEX checks the passenger location.
   - Drivers inside **500 meters** are marked as **priority**.
   - Drivers between **500 meters and 1 kilometer** are marked as **standby**.
   - Drivers beyond **1 kilometer** are ignored.
   - Available drivers are sorted by nearest distance.
   - The fare is displayed for both passenger and driver.
6. The driver app shows the request so the driver can accept/reject it.
7. The passenger app shows nearby drivers on the map.
8. The driver app shows pickup and destination on the map.
9. The admin panel shows analytics for all completed trips.

## Stack used in this demo

- **Backend**: Node.js HTTP server (Express-ready architecture)
- **Persistent data (demo mocked in-memory)**: designed for PostgreSQL in production
- **Realtime/cache (planned architecture)**: Redis / Firebase for live GPS and nearby driver cache
- **Frontend**: static web apps served from the Node backend for Passenger, Driver, and Admin views

## Project structure

```
.
├── public/
│   ├── admin.html
│   ├── app.js
│   ├── driver.html
│   ├── index.html
│   ├── passenger.html
│   └── styles.css
├── src/
│   ├── data.js
│   └── matching.js
├── package.json
└── server.js
```

## Run locally

```bash
npm install
npm start
```

Then open:

- `http://localhost:3000/`
- `http://localhost:3000/passenger.html`
- `http://localhost:3000/driver.html`
- `http://localhost:3000/admin.html`

## API endpoints

- `GET /api/state`
- `GET /api/passengers/:id/matches`
- `POST /api/trips/request`
- `POST /api/trips/:id/complete`

## Next production steps

To turn this demo into a production taxi platform:

- Replace the in-memory dataset with **PostgreSQL** models.
- Add **JWT authentication** for passengers, drivers, and admins.
- Add **Socket.IO / Firebase Realtime DB** for live GPS updates.
- Add **Redis geospatial queries** for nearby-driver lookup.
- Connect a real map provider like **Google Maps**.
- Add real payments such as card/wallet/cash settlement.
