export const getRouteGeometry = async (
  start: [number, number],
  end: [number, number],
) => {
  try {
    // OSRM Public API
    const OSRM_BASE_URL =
      import.meta.env.VITE_OSRM_BASE_URL || "https://router.project-osrm.org";
    const response = await fetch(
      `${OSRM_BASE_URL}/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
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

export const getRouteData = async (
  start: [number, number],
  end: [number, number],
) => {
  try {
    const OSRM_BASE_URL =
      import.meta.env.VITE_OSRM_BASE_URL || "https://router.project-osrm.org";
    const response = await fetch(
      `${OSRM_BASE_URL}/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=true`,
    );
    const data = await response.json();

    if (data.code === "Ok") {
      const route = data.routes[0];
      return {
        coordinates: route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]],
        ),
        instructions: route.legs[0].steps,
        duration: route.duration,
      };
    }
    return null;
  } catch (error) {
    console.error("Routing error:", error);
    return null;
  }
};
