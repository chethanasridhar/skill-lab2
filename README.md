# Trip Planner Demo

A simple local web app built as a front-end demo for trip planning.
Users can log in with a demo account, add trips, compare travel modes, estimate time and cost, search saved trips, and delete entries. The app stores trip data in browser localStorage and uses mock API calls to simulate save/delete actions.

## Features
- Demo login form with client-side validation
- Add trips with origin, destination, and travel mode
- Estimate distance, travel time, and cost
- Search/filter trip history
- Delete trip entries or clear all trips
- Persistent data using localStorage
- Mock API behavior for simulating backend interactions

## Tech Stack
- HTML
- CSS
- Vanilla JavaScript

## Project Structure
trip-planner/
├── index.html
├── styles.css
├── app.js
├── README.md

## Run Locally
1. Open the project folder in a browser, or
2. Serve it locally using a static server:

```bash
python -m http.server 8000
