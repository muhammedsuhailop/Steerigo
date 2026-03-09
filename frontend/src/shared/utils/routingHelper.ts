export const getRouteGeometry = async (
  start: [number, number],
  end: [number, number],
) => {
  try {
    // OSRM Public API
    const OSRM_BASE_URL =
      process.env.OSRM_BASE_URL || "https://router.project-osrm.org";
    const response = await fetch(
      `${OSRM_BASE_URL}}/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
    );
    const data = await response.json();

    if (data.code === "Ok") {
      return data.routes[0].geometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]],
      );
    }
    return [start, end];
  } catch (error) {
    console.error("Routing error:", error);
    return [start, end];
  }
};
