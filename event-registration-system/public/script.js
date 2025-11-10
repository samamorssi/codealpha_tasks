 const API_URL = 'http://localhost:5000/api';

// Load all events
async function loadEvents() {
  const res = await fetch(`${API_URL}/events`);
  const events = await res.json();

  const container = document.getElementById('events');
  container.innerHTML = '';

  events.forEach(ev => {
    const div = document.createElement('div');
    div.className = 'event';
    div.innerHTML = `
      <h3>${ev.title}</h3>
      <p>${ev.description || ''}</p>
      <p><b>Date:</b> ${new Date(ev.date).toLocaleString()}</p>
      <button onclick="viewEvent('${ev._id}')">View Details</button>
    `;
    container.appendChild(div);
  });
}

function viewEvent(id) {
  window.location.href = `event.html?id=${id}`;
}

// Load single event
async function loadEventDetails() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('id');

  const res = await fetch(`${API_URL}/events/${eventId}`);
  const ev = await res.json();

  document.getElementById('eventDetails').innerHTML = `
    <h1>${ev.title}</h1>
    <p>${ev.description}</p>
    <p><b>Date:</b> ${new Date(ev.date).toLocaleString()}</p>
    <p><b>Location:</b> ${ev.location || 'N/A'}</p>
  `;

  document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;

    await fetch(`${API_URL}/registrations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userName, userEmail, eventId })
    });

    alert('✅ Registered successfully!');
  };
}

// Load user’s registrations
async function loadRegistrations() {
  const email = document.getElementById('emailInput').value;
  const res = await fetch(`${API_URL}/registrations/${email}`);
  const regs = await res.json();

  const container = document.getElementById('registrations');
  container.innerHTML = '';

  regs.forEach(r => {
    const div = document.createElement('div');
    div.className = 'registration';
    div.innerHTML = `
      <p><b>Event:</b> ${r.eventId?.title}</p>
      <p><b>Date:</b> ${new Date(r.eventId?.date).toLocaleString()}</p>
      <p><b>Registered on:</b> ${new Date(r.createdAt).toLocaleString()}</p>
      <button onclick="cancelRegistration('${r._id}')">Cancel</button>
    `;
    container.appendChild(div);
  });
}

// Cancel a registration
async function cancelRegistration(id) {
  if (!confirm('Cancel this registration?')) return;
  await fetch(`${API_URL}/registrations/${id}`, { method: 'DELETE' });
  alert('❌ Registration canceled');
  loadRegistrations();
}
