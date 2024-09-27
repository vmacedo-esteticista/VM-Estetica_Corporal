export const geocodeLoc = async (location) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&${location}`);
    const data = await response.json();

    if (data) {
      const { lat, lon, address: { road, suburb, city, state, country, postcode } } = data;
      const formattedAddress = `${road}, ${suburb}, ${city}, ${state}, ${country}, ${postcode}, lat=${lat}&lon=${lon}`;
      return { formattedAddress, lat, lon };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching geocode data:', error);
    return null;
  }
};

export const geocodeEnd = async (address) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data && data.length > 0) {
      const { display_name, lat, lon } = data[0];
      const formattedAddress = `${display_name}, lat=${lat}&lon=${lon}`;
      return { formattedAddress, lat, lon };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching geocode data:', error);
    return null;
  }
};
