// ============ SETTINGS ============
const MAPTILER_KEY = 'XMvtepjFjLa1oN9MaKeE';            // API key for geocoding
const MOCK_API = 'https://jsonplaceholder.typicode.com'; // free fake API for POST and DELETE

// speed in km/h and cost in rupees per km for each travel mode
const MODES = {
  walk:   { speed: 5,   cost: 0 },
  car:    { speed: 55,  cost: 8 },
  bus:    { speed: 45,  cost: 2 },
  train:  { speed: 70,  cost: 1.5 },
  flight: { speed: 800, cost: 6 }
};

// ============ LOCAL STORAGE ============
// localStorage only stores text, so we convert with JSON.stringify / JSON.parse
let trips = JSON.parse(localStorage.getItem('trips')) || [];
function saveTrips() {
  localStorage.setItem('trips', JSON.stringify(trips));
}

// shortcut so we don't type document.getElementById every time
const $ = id => document.getElementById(id);

// ============ LOGIN ============
// returns an error message, or "" if the value is fine
function checkUsername(name) {
  if (name.length < 3) return 'Username must be at least 3 characters.';
  return '';
}
function checkPassword(pw) {
  if (pw.length < 6) return 'Password must be at least 6 characters.';
  if (!/\d/.test(pw)) return 'Password must contain a number.';
  return '';
}

$('loginBtn').addEventListener('click', () => {
  const name = $('username').value.trim();
  const pw = $('password').value;

  $('userError').textContent = checkUsername(name);
  $('passError').textContent = checkPassword(pw);
  $('loginError').textContent = '';
  if ($('userError').textContent || $('passError').textContent) return; // stop if invalid

  // demo check (a real app would ask a server to do this)
  if (name === 'student' && pw === 'pass123') {
    localStorage.setItem('user', name);   // remember that we are logged in
    showPage();
  } else {
    $('loginError').textContent = 'Wrong username or password.';
  }
});

$('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('user');
  showPage();
});

// show either the login page or the app, depending on whether a user is stored
function showPage() {
  const user = localStorage.getItem('user');
  $('loginPage').hidden = !!user;
  $('appPage').hidden = !user;
  if (user) {
    $('welcome').textContent = 'Welcome, ' + user;
    renderTable();
  }
}

// ============ API CALLS ============
// GET: ask MapTiler for the coordinates of a place name
async function getCoordinates(place) {
  const url = 'https://api.maptiler.com/geocoding/' + encodeURIComponent(place) + '.json?key=' + MAPTILER_KEY + '&limit=1';
  const response = await fetch(url);                 // GET is the default method
  if (!response.ok) throw new Error('Place search failed (error ' + response.status + ').');
  const data = await response.json();                // turn the text reply into an object
  if (data.features.length === 0) throw new Error('Could not find "' + place + '".');
  const f = data.features[0];
  return { lon: f.center[0], lat: f.center[1], name: f.place_name.split(',')[0] };
}

// POST / DELETE: talk to a fake server (it pretends to save, nothing is really stored)
async function callMockApi(method, path, body) {
  const options = { method: method };
  if (body) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }
  const response = await fetch(MOCK_API + path, options);
  return response.json();
}

// ============ MATHS ============
// haversine formula: straight-line distance between two coordinates in km
function distanceKm(a, b) {
  const rad = d => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

// ============ ADD TRIP ============
$('addBtn').addEventListener('click', async () => {
  const from = $('from').value.trim();
  const to = $('to').value.trim();
  const mode = $('mode').value;

  // form validation
  if (from.length < 2 || to.length < 2) { $('tripError').textContent = 'Enter both places (2+ letters).'; return; }
  if (from.toLowerCase() === to.toLowerCase()) { $('tripError').textContent = 'The two places must be different.'; return; }
  $('tripError').textContent = 'Working...';
  $('addBtn').disabled = true;

  try {
    const a = await getCoordinates(from);   // GET request 1
    const b = await getCoordinates(to);     // GET request 2

    const km = distanceKm(a, b);
    const hours = km / MODES[mode].speed;
    const cost = km * MODES[mode].cost;

    const trip = { id: Date.now(), from: a.name, to: b.name, mode: mode,
                   km: Math.round(km), hours: hours.toFixed(1), cost: Math.round(cost) };

    const reply = await callMockApi('POST', '/posts', trip);  // POST request: "save" on the fake server
    trip.serverId = reply.id;                                  // the fake server sends back an id

    trips.push(trip);
    saveTrips();
    renderTable();
    $('tripError').textContent = '';
    $('from').value = '';
    $('to').value = '';
  } catch (error) {
    $('tripError').textContent = error.message;
  }
  $('addBtn').disabled = false;
});

// ============ TABLE ============
function renderTable() {
  const text = $('search').value.toLowerCase();

  // filter() keeps only the trips whose places match the search box
  const shown = trips.filter(t => (t.from + ' ' + t.to).toLowerCase().includes(text));

  // map() turns each trip into a table row, join() glues the rows into one string
  $('tripTable').innerHTML = shown.map(t => `
    <tr>
      <td>${t.from}</td>
      <td>${t.to}</td>
      <td>${t.mode}</td>
      <td>${t.km} km</td>
      <td>${t.hours} h</td>
      <td>₹${t.cost}</td>
      <td><button class="red" data-id="${t.id}">Delete</button></td>
    </tr>`).join('');
}

$('search').addEventListener('input', renderTable);

// one listener on the table handles every Delete button (even ones added later)
$('tripTable').addEventListener('click', async (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  const id = Number(e.target.dataset.id);
  const trip = trips.find(t => t.id === id);
  try { await callMockApi('DELETE', '/posts/' + trip.serverId); } catch (err) { /* fake server: ignore errors */ }
  trips = trips.filter(t => t.id !== id);   // keep every trip except the deleted one
  saveTrips();
  renderTable();
});

$('clearBtn').addEventListener('click', () => {
  if (confirm('Delete all trips?')) {
    trips = [];
    saveTrips();
    renderTable();
  }
});

// ============ START ============
showPage();
