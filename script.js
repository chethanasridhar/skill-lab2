
const MAPTILER_KEY = 'XMvtepjFjLa1oN9MaKeE';            
const MOCK_API = 'https://jsonplaceholder.typicode.com'; 

const MODES = {
  walk:   { speed: 5,   cost: 0 },
  car:    { speed: 55,  cost: 8 },
  bus:    { speed: 45,  cost: 2 },
  train:  { speed: 70,  cost: 1.5 },
  flight: { speed: 800, cost: 6 }
};


let trips = JSON.parse(localStorage.getItem('trips')) || [];
function saveTrips() {
  localStorage.setItem('trips', JSON.stringify(trips));
}


const $ = id => document.getElementById(id);


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
  if ($('userError').textContent || $('passError').textContent) return; 

  
  if (name === 'student' && pw === 'pass123') {
    localStorage.setItem('user', name);   
    showPage();
  } else {
    $('loginError').textContent = 'Wrong username or password.';
  }
});

$('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('user');
  showPage();
});

function showPage() {
  const user = localStorage.getItem('user');
  $('loginPage').hidden = !!user;
  $('appPage').hidden = !user;
  if (user) {
    $('welcome').textContent = 'Welcome, ' + user;
    renderTable();
  }
}


async function getCoordinates(place) {
  const url = 'https://api.maptiler.com/geocoding/' + encodeURIComponent(place) + '.json?key=' + MAPTILER_KEY + '&limit=1';
  const response = await fetch(url);                 
  if (!response.ok) throw new Error('Place search failed (error ' + response.status + ').');
  const data = await response.json();               
  if (data.features.length === 0) throw new Error('Could not find "' + place + '".');
  const f = data.features[0];
  return { lon: f.center[0], lat: f.center[1], name: f.place_name.split(',')[0] };
}

async function callMockApi(method, path, body) {
  const options = { method: method };
  if (body) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }
  const response = await fetch(MOCK_API + path, options);
  return response.json();
}

function distanceKm(a, b) {
  const rad = d => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

$('addBtn').addEventListener('click', async () => {
  const from = $('from').value.trim();
  const to = $('to').value.trim();
  const mode = $('mode').value;

  if (from.length < 2 || to.length < 2) { $('tripError').textContent = 'Enter both places (2+ letters).'; return; }
  if (from.toLowerCase() === to.toLowerCase()) { $('tripError').textContent = 'The two places must be different.'; return; }
  $('tripError').textContent = 'Working...';
  $('addBtn').disabled = true;

  try {
    const a = await getCoordinates(from);   
    const b = await getCoordinates(to);     

    const km = distanceKm(a, b);
    const hours = km / MODES[mode].speed;
    const cost = km * MODES[mode].cost;

    const trip = { id: Date.now(), from: a.name, to: b.name, mode: mode,
                   km: Math.round(km), hours: hours.toFixed(1), cost: Math.round(cost) };

    const reply = await callMockApi('POST', '/posts', trip); 
    trip.serverId = reply.id;                                  

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


function renderTable() {
  const text = $('search').value.toLowerCase();


  const shown = trips.filter(t => (t.from + ' ' + t.to).toLowerCase().includes(text));

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

$('tripTable').addEventListener('click', async (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  const id = Number(e.target.dataset.id);
  const trip = trips.find(t => t.id === id);
  try { await callMockApi('DELETE', '/posts/' + trip.serverId); } catch (err) {  }
  trips = trips.filter(t => t.id !== id); 
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

showPage();
