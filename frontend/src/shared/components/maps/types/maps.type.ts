export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface SearchSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}
