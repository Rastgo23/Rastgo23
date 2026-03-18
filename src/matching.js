const RATE_PER_100_METERS = 1000;
const SEARCH_RADIUS_METERS = 500;
const STANDBY_RADIUS_METERS = 1000;

function distanceMeters(a, b) {
  return Math.round(Math.hypot(a.x - b.x, a.y - b.y));
}

function calculateFare(pickup, destination) {
  const tripDistance = distanceMeters(pickup, destination);
  return Math.ceil(tripDistance / 100) * RATE_PER_100_METERS;
}

function findNearbyDrivers(passenger, drivers) {
  return drivers
    .map((driver) => {
      const pickupDistance = distanceMeters(passenger.location, driver.location);
      const zone = pickupDistance <= SEARCH_RADIUS_METERS
        ? 'priority'
        : pickupDistance <= STANDBY_RADIUS_METERS
          ? 'standby'
          : 'out_of_range';

      return {
        ...driver,
        pickupDistance,
        zone,
        estimatedFare: calculateFare(passenger.location, passenger.destination),
      };
    })
    .filter((driver) => driver.zone !== 'out_of_range' && driver.status === 'available')
    .sort((left, right) => left.pickupDistance - right.pickupDistance);
}

function buildAdminAnalytics(state) {
  const totalRevenue = state.trips
    .filter((trip) => trip.status === 'completed')
    .reduce((sum, trip) => sum + trip.fare, 0);

  return {
    totalPassengers: state.passengers.length,
    totalDrivers: state.drivers.length,
    activeTrips: state.trips.filter((trip) => trip.status === 'accepted').length,
    completedTrips: state.trips.filter((trip) => trip.status === 'completed').length,
    totalRevenue,
    driverPerformance: state.drivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      earnings: driver.earnings,
      completedTrips: driver.completedTrips,
      status: driver.status,
    })),
  };
}

module.exports = {
  RATE_PER_100_METERS,
  SEARCH_RADIUS_METERS,
  STANDBY_RADIUS_METERS,
  distanceMeters,
  calculateFare,
  findNearbyDrivers,
  buildAdminAnalytics,
};
