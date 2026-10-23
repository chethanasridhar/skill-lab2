# Trip Planner Application

A responsive web application to plan trips, compare transport modes, estimate travel time and costs, and manage trip history.

## Features

- Interactive maps and route visualization using Leaflet and MapTiler.
- Geocoding API integration with local caching.
- Six transport modes: walking, bicycle, car, bus, train, and flight.
- Traveler-based fare calculation and travel estimates.
- Login form with input validation.
- Trip history, analytics, tables, search, and filters.
- Persistent data storage using `localStorage`.
- Interactive buttons, form events, and responsive styling.
- Modular JavaScript methods and framework experimentation.

## Technologies

- HTML5 and CSS3
- Vanilla JavaScript (ES6+)
- Leaflet.js
- MapTiler API
- Browser Local Storage

## Getting Started

1. Obtain an API key from [MapTiler](https://www.maptiler.com/).
2. Configure the key in your JavaScript file:

```javascript
const MAPTILER_KEY = 'YOUR_MAPTILER_API_KEY';
```

3. Run the application using a local development server.

## Project Structure

```text
trip-planner/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Limitations

Travel times and costs are estimates. Client-side login validation does not provide secure authentication.
