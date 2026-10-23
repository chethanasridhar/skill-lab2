# Trip Planner Application

A lightweight, single-page web application for calculating distance, estimated travel time, and travel costs between two locations using multiple transport modes. Features an interactive map, geocoding, local trip storage, and trip history analytics.

## Features

- **Interactive Map:** Displays routes and location markers using Leaflet and MapTiler.
- **Geocoding:** Uses the MapTiler Geocoding API with local caching to reduce network requests.
- **Multiple Transport Modes:** Supports walking, bicycle, car, bus, train, and flight with configurable speed, cost, and distance multipliers.
- **Traveler-Based Cost Calculation:** Adjusts fares based on the number of travelers and whether costs apply per person or per vehicle.
- **Trip History and Analytics:**
  - Stores planned trips in `localStorage`.
  - Tracks total trips, cumulative distance, and estimated expenditure.
  - Supports searching and filtering by transport mode, distance, and keywords.
- **Responsive and Accessible Design:** Uses semantic HTML5, CSS variables, CSS Grid, Flexbox, accessible labels, and keyboard-friendly focus states.

## Technologies Used

- HTML5 and CSS3
- Vanilla JavaScript (ES6+)
- [Leaflet.js](https://leafletjs.com/) — Interactive mapping
- [MapTiler API](https://www.maptiler.com/) — Map tiles and geocoding

## Getting Started

### Prerequisites

A modern web browser and a MapTiler API key.

### MapTiler API Setup

1. Create a free account at [MapTiler](https://www.maptiler.com/).
2. Obtain an API key from the MapTiler Cloud dashboard.
3. Open `index.html` and replace the placeholder key in the JavaScript section:

```javascript
const MAPTILER_KEY = 'YOUR_MAPTILER_API_KEY';
```

4. Open the application in your browser and start planning trips.
