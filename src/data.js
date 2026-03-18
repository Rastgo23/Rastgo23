function createState() {
  return {
    passengers: [
      {
        id: 'passenger-a',
        name: 'Passenger A',
        phone: '+964750000001',
        location: { x: 0, y: 0, label: 'Point m' },
        destination: { x: 900, y: 200, label: 'Point C' },
        paymentOptions: ['Cash', 'Wallet', 'Card'],
      },
      {
        id: 'passenger-b',
        name: 'Passenger B',
        phone: '+964750000002',
        location: { x: 300, y: 400, label: 'Point n' },
        destination: { x: 900, y: 200, label: 'Point C' },
        paymentOptions: ['Cash', 'Wallet'],
      },
    ],
    drivers: [
      { id: 'driver-o', name: 'Taxi O', location: { x: 80, y: 50 }, status: 'available', vehicle: 'Toyota', earnings: 15000, completedTrips: 3 },
      { id: 'driver-p', name: 'Taxi P', location: { x: 130, y: 90 }, status: 'available', vehicle: 'Hyundai', earnings: 22000, completedTrips: 5 },
      { id: 'driver-q', name: 'Taxi Q', location: { x: 220, y: 180 }, status: 'available', vehicle: 'Kia', earnings: 17000, completedTrips: 4 },
      { id: 'driver-s', name: 'Taxi S', location: { x: 1400, y: 300 }, status: 'available', vehicle: 'Nissan', earnings: 12000, completedTrips: 2 },
      { id: 'driver-l', name: 'Taxi L', location: { x: 1600, y: 700 }, status: 'available', vehicle: 'MG', earnings: 9000, completedTrips: 1 },
    ],
    trips: [
      {
        id: 'trip-0',
        passengerId: 'passenger-b',
        driverId: 'driver-p',
        pickup: { x: 300, y: 400, label: 'Point n' },
        destination: { x: 900, y: 200, label: 'Point C' },
        fare: 7000,
        status: 'completed',
        createdAt: '2026-03-17T10:00:00.000Z',
        completedAt: '2026-03-17T10:18:00.000Z',
      },
    ],
  };
}

module.exports = { createState };
