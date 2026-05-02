// ====================================================================
//  Madère 2026 — Carnet de voyage
//  Pure-JS PWA. No build step. Works offline once cached.
// ====================================================================

// ---------- DATA ----------------------------------------------------

const PLACES = {
  'aeroport':              { name: "Aéroport de Madère",          lat: 32.6979, lng: -16.7745, type: 'sight', desc: "Aéroport Cristiano Ronaldo. Vents traversiers fréquents — prévoir large pour les retours." },
  'estreito':              { name: "Estreito da Calheta",         lat: 32.7286, lng: -17.1797, type: 'sight', desc: "Le village de la base. Côte sud-ouest, climat doux, accès marina." },
  'praia-calheta':         { name: "Praia da Calheta",            lat: 32.7186, lng: -17.1739, type: 'sight', desc: "Plage de sable jaune importé. Pontons plats, eau calme, parfaite pour la première baignade." },
  'cantinho-serra':        { name: "Cantinho da Serra",           lat: 32.7340, lng: -17.1820, type: 'meal',  desc: "Cuisine madérienne typique au feu de bois. Idéal pour une première espetada à l'arrivée." },
  'mercado':               { name: "Mercado dos Lavradores",      lat: 32.6481, lng: -16.9056, type: 'sight', desc: "Marché central de Funchal. Halle Art déco, fruits exotiques (anonas, maracujás), poissons frais." },
  'cathedrale':            { name: "Cathédrale Sé de Funchal",    lat: 32.6477, lng: -16.9088, type: 'sight', desc: "Cathédrale du XVe siècle. Plafond mudéjar en bois de cèdre." },
  'zona-velha':            { name: "Zona Velha de Funchal",       lat: 32.6471, lng: -16.9035, type: 'sight', desc: "Vieille ville plate, ruelles pavées, portes peintes. Restaurants en terrasse." },
  'telepherique':          { name: "Téléphérique Funchal-Monte",  lat: 32.6485, lng: -16.9035, type: 'sight', desc: "Station basse, à côté de la Zona Velha. 15 minutes de cabine au-dessus de la baie." },
  'monte-palace':          { name: "Monte Palace Tropical Garden", lat: 32.6717, lng: -16.9020, type: 'sight', desc: "Jardin tropical au sommet de Monte. Mosaïques portugaises, étangs à carpes koï." },
  'blandys':               { name: "Blandy's Wine Lodge",         lat: 32.6470, lng: -16.9082, type: 'sight', desc: "Cave historique du vin de Madère. Visite guidée + dégustation, parfaitement accessible." },
  'marina-calheta':        { name: "Marina da Calheta",           lat: 32.7188, lng: -17.1734, type: 'sight', desc: "Port de plaisance. À 5 min de l'hôtel — embarquement Lobosonda pour les dauphins." },
  'vila-peixe':            { name: "Vila do Peixe",               lat: 32.6452, lng: -16.9755, type: 'meal',  desc: "Poisson frais grillé au gros sel face au port de Câmara de Lobos." },
  'cascata-anjos':         { name: "Cascata dos Anjos",           lat: 32.7505, lng: -17.2230, type: 'sight', desc: "Cascade qui tombe sur la chaussée. On passe sous les embruns en voiture." },
  'seixal':                { name: "Praia do Seixal",             lat: 32.8231, lng: -17.0999, type: 'sight', desc: "Plage de sable noir volcanique sur la côte nord." },
  'fanal':                 { name: "Forêt de Fanal",              lat: 32.8155, lng: -17.1604, type: 'sight', desc: "Forêt de lauriers brumeuse, irréelle quand la brume descend. Patrimoine Unesco." },
  'porto-moniz':           { name: "Piscines de Porto Moniz",     lat: 32.8682, lng: -17.1727, type: 'sight', desc: "Piscines naturelles aménagées dans la lave. Vestiaires, douches, accès facile." },
  'cachalote':             { name: "Restaurante Cachalote",       lat: 32.8688, lng: -17.1727, type: 'meal',  desc: "Poisson grillé en terrasse face aux piscines de lave." },
  'cabo-girao':            { name: "Cabo Girão Skywalk",          lat: 32.6552, lng: -17.0048, type: 'sight', desc: "Plateforme de verre suspendue à 580 m, l'une des plus hautes falaises maritimes d'Europe." },
  'pico-areeiro':          { name: "Pico do Areeiro",             lat: 32.7349, lng: -16.9277, type: 'sight', desc: "3e sommet de l'île (1818 m), accessible en voiture. Vue à 360° sur le centre montagneux." },
  'pico-areeiro-parking':  { name: "Parking Pico do Areeiro",     lat: 32.7349, lng: -16.9277, type: 'sight', desc: "Parking du sommet (payant). Point de départ du sentier PR1 vers le Stairway to Heaven." },
  'ribeiro-frio':          { name: "Ribeiro Frio",                lat: 32.7361, lng: -16.8855, type: 'meal',  desc: "Truites élevées sur place, cuisine simple en pleine forêt de lauriers." },
  'santana':               { name: "Santana",                     lat: 32.8014, lng: -16.8800, type: 'sight', desc: "Maisons triangulaires colorées au toit de chaume, emblèmes du nord de l'île." },
  'sao-lourenco':          { name: "Ponta de São Lourenço",       lat: 32.7434, lng: -16.7037, type: 'sight', desc: "Pointe est de l'île, panorama lunaire de roches rouges et noires." },
  'rabacal':               { name: "Parking Rabaçal",             lat: 32.7570, lng: -17.1359, type: 'sight', desc: "Point de départ des Levadas das 25 Fontes et do Risco. Sentiers plats le long des canaux." },
  'ponta-sol':             { name: "Ponta do Sol",                lat: 32.6781, lng: -17.1006, type: 'meal',  desc: "Village dans le creux d'une falaise, le plus ensoleillé de l'île." },
  'vila-carne':            { name: "Vila da Carne",               lat: 32.6451, lng: -16.9758, type: 'meal',  desc: "L'espetada de référence à Câmara de Lobos, vue sur le port." },
  'camara-lobos':          { name: "Câmara de Lobos",             lat: 32.6453, lng: -16.9762, type: 'sight', desc: "Port de pêche peint par Churchill. Un dernier expresso face aux barques colorées." }
};

const DAYS = [
  {
    id: 1, dow: 'Dim', emoji: '✈️', featured: false,
    title: "Atterrissage en douceur",
    subtitle: "Funchal Airport → Estreito da Calheta",
    items: [
      { time: "14:00", title: "Récupération de la voiture", body: "Cap à l'ouest par la VR1 puis VE3 — 50 min de routes côtières.", places: ['aeroport', 'estreito'] },
      { time: "16:00", title: "Check-in & piscine", body: "Les jambes posées, le voyage commence vraiment.", places: [] },
      { time: "18:00", title: "Praia da Calheta", body: "Sable jaune importé, pontons plats, eau calme — parfait pour une première baignade.", places: ['praia-calheta'] },
      { time: "20:00", title: "Dîner — Cantinho da Serra", body: "Cuisine madérienne au feu de bois.", places: ['cantinho-serra'] }
    ]
  },
  {
    id: 2, dow: 'Lun', emoji: '⛪', featured: false,
    title: "Funchal, capitale en pente",
    subtitle: "Marché, téléphérique, jardin de Monte",
    items: [
      { time: "10:00", title: "Mercado dos Lavradores", body: "Anonas, maracujás, fruta deliciosa — on goûte tout, on n'achète presque rien.", places: ['mercado'] },
      { time: "12:00", title: "Centre historique", body: "Cathédrale Sé, ruelles plates de la Zona Velha — adapté pour tout le monde.", places: ['cathedrale', 'zona-velha'] },
      { time: "15:00", title: "Téléphérique de Monte", body: "15 minutes de cabine au-dessus de la baie. Au sommet : Jardin Tropical de Monte Palace.", places: ['telepherique', 'monte-palace'] },
      { time: "17:00", title: "Carros de cesto", body: "Descente en panier d'osier pour les plus jeunes ; les parents redescendent en téléphérique.", places: [] },
      { time: "Soir", title: "Dégustation Blandy's", body: "Cave historique du vin de Madère.", places: ['blandys'] }
    ]
  },
  {
    id: 3, dow: 'Mar', emoji: '🐬', featured: true,
    title: "Au large, les dauphins",
    subtitle: "Catamaran depuis la marina de Calheta",
    items: [
      { time: "09:30", title: "Embarquement marina de Calheta", body: "Lobosonda, catamaran stable, sièges, toilettes, ombre — pensé pour tous les âges.", places: ['marina-calheta'] },
      { time: "10–13h", title: "3 heures au large", body: "Dauphins communs, baleines pilotes, parfois tortues caouannes. Les guides sont biologistes marins.", places: [] },
      { time: "14:00", title: "Repos hôtel", body: "Le sel, la peau qui tire, la sieste qui s'impose.", places: [] },
      { time: "19:30", title: "Dîner — Vila do Peixe", body: "Poisson frais grillé au gros sel face au port de Câmara de Lobos.", places: ['vila-peixe'] }
    ]
  },
  {
    id: 4, dow: 'Mer', emoji: '🌊', featured: false, rest: true,
    title: "La côte volcanique",
    subtitle: "Cap au nord-ouest — parents au repos à l'hôtel",
    items: [
      { time: "10:00", title: "Route panoramique", body: "Cascata dos Anjos qui tombe sur la chaussée, Seixal et son sable noir, forêt de Fanal si la brume joue le jeu.", places: ['cascata-anjos', 'seixal', 'fanal'] },
      { time: "12:30", title: "Porto Moniz", body: "Piscines naturelles de lave — eau de mer dans la roche noire. La carte postale de Madère.", places: ['porto-moniz'] },
      { time: "14:00", title: "Déjeuner — Cachalote", body: "Poisson grillé en terrasse face aux piscines de lave.", places: ['cachalote'] }
    ]
  },
  {
    id: 5, dow: 'Jeu', emoji: '⛰️', featured: false,
    title: "Le grand circuit oriental",
    subtitle: "Toute l'île en voiture · panoramas pour tous",
    items: [
      { time: "09:00", title: "Cabo Girão", body: "Skywalk vitré à 580 m au-dessus de l'océan — accès direct depuis le parking.", places: ['cabo-girao'] },
      { time: "11:00", title: "Pico do Areeiro · 1818 m", body: "On monte en voiture jusqu'au sommet. Vue à 360° sur le centre montagneux.", places: ['pico-areeiro'] },
      { time: "13:00", title: "Déjeuner — Ribeiro Frio", body: "Truites élevées sur place, cuisine simple en pleine forêt de lauriers.", places: ['ribeiro-frio'] },
      { time: "15:00", title: "Santana & Ponta de São Lourenço", body: "Maisons triangulaires colorées, puis panorama depuis le belvédère de la pointe est.", places: ['santana', 'sao-lourenco'] },
      { time: "19:00", title: "Retour Calheta", body: "1 h de route par la côte sud.", places: [] }
    ]
  },
  {
    id: 6, dow: 'Ven', emoji: '🌿', featured: false, rest: true,
    title: "Levada & dîner d'adieu",
    subtitle: "Levada douce, parents au repos le matin",
    items: [
      { time: "Matin", title: "Levada das 25 Fontes ou do Risco", body: "Sentiers plats le long des canaux d'irrigation. La Madère secrète — mousse et eau claire.", places: ['rabacal'] },
      { time: "13:00", title: "Déjeuner — Ponta do Sol", body: "Village dans le creux d'une falaise, le plus ensoleillé de l'île.", places: ['ponta-sol'] },
      { time: "18:30", title: "Coucher de soleil au Cabo Girão", body: "Ou depuis la piscine, selon les forces.", places: ['cabo-girao'] },
      { time: "20:30", title: "Dîner d'adieu — Vila da Carne", body: "L'espetada de référence à Câmara de Lobos.", places: ['vila-carne'] }
    ]
  },
  {
    id: 7, dow: 'Sam', emoji: '🛫', featured: false,
    title: "L'au-revoir tranquille",
    subtitle: "1 h de route vers l'aéroport",
    items: [
      { time: "10:00", title: "Check-out", body: "On charge la voiture sans précipitation.", places: [] },
      { time: "11:30", title: "Détour Câmara de Lobos", body: "Un dernier expresso face au port que peignait Churchill.", places: ['camara-lobos'] },
      { time: "13:00", title: "Aéroport", body: "Madère est connue pour ses vents — prévoir large.", places: ['aeroport'] },
      { time: "14:00", title: "Décollage", body: "Adeus, ilha das flores.", places: [] }
    ]
  }
];

// Weather code → emoji + label (WMO codes via Open-Meteo)
const WMO = {
  0:  ['☀️', 'Ciel dégagé'],
  1:  ['🌤️', 'Plutôt clair'],
  2:  ['⛅️', 'Partiellement nuageux'],
  3:  ['☁️', 'Couvert'],
  45: ['🌫️', 'Brouillard'],
  48: ['🌫️', 'Brouillard givrant'],
  51: ['🌦️', 'Bruine légère'],
  53: ['🌦️', 'Bruine'],
  55: ['🌧️', 'Bruine forte'],
  61: ['🌧️', 'Pluie légère'],
  63: ['🌧️', 'Pluie'],
  65: ['🌧️', 'Pluie forte'],
  71: ['🌨️', 'Neige légère'],
  73: ['🌨️', 'Neige'],
  75: ['❄️', 'Neige forte'],
  77: ['🌨️', 'Grésil'],
  80: ['🌦️', 'Averses'],
  81: ['🌧️', 'Averses'],
  82: ['⛈️', 'Averses violentes'],
  85: ['🌨️', 'Averses neigeuses'],
  86: ['❄️', 'Averses neigeuses fortes'],
  95: ['⛈️', 'Orages'],
  96: ['⛈️', 'Orages + grêle'],
  99: ['⛈️', 'Orages violents']
};

// ---------- STATE ---------------------------------------------------

const STORAGE = {
  tripStart: 'mad26.tripStart',
  done:      'mad26.done',
  weather:   'mad26.weather'
};

let currentDayIdx = 0;
let map = null;
let mapMarkers = [];
let activeFilter = 'all';

// ---------- HELPERS -------------------------------------------------

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function nextSunday(from = new Date()) {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  const offset = (7 - d.getDay()) % 7;
  d.setDate(d.getDate() + (offset === 0 ? 7 : offset));
  return d;
}

function getTripStart() {
  const stored = localStorage.getItem(STORAGE.tripStart);
  if (stored) {
    const d = new Date(stored + 'T00:00:00');
    if (!isNaN(d)) return d;
  }
  // Default: trip starts Sunday May 17, 2026
  return new Date('2026-05-17T00:00:00');
}

function setTripStart(isoDate) {
  localStorage.setItem(STORAGE.tripStart, isoDate);
}

function dateForDay(idx) {
  const start = getTripStart();
  const d = new Date(start);
  d.setDate(d.getDate() + idx);
  return d;
}

function fmtDate(d) {
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function fmtDateShort(d) {
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function getDoneSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE.done) || '[]'));
  } catch { return new Set(); }
}

function saveDoneSet(set) {
  localStorage.setItem(STORAGE.done, JSON.stringify([...set]));
}

function toast(msg, ms = 1800) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), ms);
}

// ---------- RENDER: DAY PAGES --------------------------------------

function renderDays() {
  const pager = $('#daysPager');
  const done = getDoneSet();
  pager.innerHTML = DAYS.map(day => {
    const date = dateForDay(day.id - 1);
    const items = day.items.map((it, i) => {
      const itemId = `d${day.id}-i${i}`;
      const isDone = done.has(itemId);
      const chips = it.places.map(pid => {
        const p = PLACES[pid];
        if (!p) return '';
        const cls = p.type === 'meal' ? 'loc-chip meal' : 'loc-chip';
        return `<a class="${cls}" data-place="${pid}">${escapeHtml(p.name)}</a>`;
      }).join('');
      return `
        <div class="tl-item ${isDone ? 'done' : ''}" data-item="${itemId}">
          <div class="tl-when">${escapeHtml(it.time)}</div>
          <div class="tl-what">
            <strong>${escapeHtml(it.title)}</strong>
            ${escapeHtml(it.body)}
            ${chips ? `<div class="chips">${chips}</div>` : ''}
          </div>
          <div class="tl-check" role="button" aria-label="Marquer comme fait"></div>
        </div>`;
    }).join('');
    return `
      <article class="day-page" data-day="${day.id}">
        <div class="day-hero ${day.featured ? 'featured' : ''}">
          <div class="day-tag">Jour ${String(day.id).padStart(2, '0')} · ${day.dow}</div>
          <h2>${escapeHtml(day.title)}</h2>
          <div class="subtitle">${escapeHtml(day.subtitle)}</div>
          ${day.rest ? `<div class="day-rest-flag">⊙ Parents au repos</div>` : ''}
          <div class="day-emoji">${day.emoji}</div>
          <div class="weather skeleton" data-weather-day="${day.id}">
            <div class="weather-icon">·</div>
            <div class="weather-info">
              <div class="weather-temps">— °</div>
              <div class="weather-desc">Météo</div>
            </div>
          </div>
        </div>
        <div class="timeline">${items}</div>
      </article>`;
  }).join('');

  // Wire chip clicks
  $$('.loc-chip', pager).forEach(chip => {
    chip.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      openPlaceModal(chip.dataset.place);
    });
  });

  // Wire check toggles
  $$('.tl-check', pager).forEach(check => {
    check.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const item = check.closest('.tl-item');
      const id = item.dataset.item;
      const set = getDoneSet();
      if (set.has(id)) { set.delete(id); item.classList.remove('done'); }
      else             { set.add(id); item.classList.add('done'); }
      saveDoneSet(set);
    });
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ---------- DAY PAGER NAV ------------------------------------------

function setCurrentDay(idx, { scroll = true } = {}) {
  idx = Math.max(0, Math.min(DAYS.length - 1, idx));
  currentDayIdx = idx;
  const pager = $('#daysPager');
  if (scroll) {
    pager.scrollTo({ left: pager.clientWidth * idx, behavior: 'smooth' });
  }
  // Update meta
  $('#dayCounter').textContent = `${idx + 1}/${DAYS.length}`;
  $('#dayCounterLabel').textContent = `Jour ${idx + 1} · ${DAYS[idx].dow}`;
  $('#dayDate').textContent = fmtDateShort(dateForDay(idx));
  $('#progressBar').style.width = `${((idx + 1) / DAYS.length) * 100}%`;
  // Buttons
  $('#prevDay').disabled = idx === 0;
  $('#nextDay').disabled = idx === DAYS.length - 1;
}

function setupPagerScrollSync() {
  const pager = $('#daysPager');
  let raf = 0;
  pager.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const idx = Math.round(pager.scrollLeft / pager.clientWidth);
      if (idx !== currentDayIdx) setCurrentDay(idx, { scroll: false });
    });
  });
}

// ---------- TABS ----------------------------------------------------

function setupTabs() {
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      $$('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      $$('.pane').forEach(p => p.classList.toggle('active', p.id === `pane-${tab}`));
      if (tab === 'map') {
        // Leaflet needs a size recalculation when shown
        setTimeout(() => map && map.invalidateSize(), 60);
      }
    });
  });
}

// ---------- MODAL: PLACE -------------------------------------------

function openPlaceModal(placeId) {
  const p = PLACES[placeId];
  if (!p) return;
  $('#modalKicker').textContent = p.type === 'meal' ? 'Restaurant' : 'Destination';
  $('#modalTitle').textContent = p.name;
  $('#modalDesc').textContent = p.desc || '';
  $('#modalCoords').textContent = `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)} · tap pour copier`;
  $('#btnWaze').href  = `https://www.waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`;
  $('#btnGmaps').href = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
  $('#btnApple').href = `https://maps.apple.com/?ll=${p.lat},${p.lng}&q=${encodeURIComponent(p.name)}`;
  $('#btnShare').onclick = async () => {
    const text = `${p.name} — https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
    if (navigator.share) {
      try { await navigator.share({ title: p.name, text }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(text); toast('Lien copié'); } catch {}
    }
  };
  $('#modalCoords').onclick = async () => {
    try {
      await navigator.clipboard.writeText(`${p.lat}, ${p.lng}`);
      toast('Coordonnées copiées');
    } catch {}
  };
  openModal('#modal');
}

function openModal(sel) {
  $(sel).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(sel) {
  $(sel).classList.remove('open');
  document.body.style.overflow = '';
}

function setupModals() {
  $('#modalClose').addEventListener('click', () => closeModal('#modal'));
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal('#modal'); });
  $('#settingsClose').addEventListener('click', () => closeModal('#settingsModal'));
  $('#settingsModal').addEventListener('click', e => { if (e.target.id === 'settingsModal') closeModal('#settingsModal'); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal('#modal'); closeModal('#settingsModal'); }
    if (e.key === 'ArrowLeft' && $('#pane-days').classList.contains('active')) setCurrentDay(currentDayIdx - 1);
    if (e.key === 'ArrowRight' && $('#pane-days').classList.contains('active')) setCurrentDay(currentDayIdx + 1);
  });
}

// ---------- SETTINGS ------------------------------------------------

function setupSettings() {
  const input = $('#tripStart');
  input.value = isoDate(getTripStart());
  $('#settingsBtn').addEventListener('click', () => openModal('#settingsModal'));
  input.addEventListener('change', () => {
    if (!input.value) return;
    setTripStart(input.value);
    // Re-render dates / refresh weather
    renderDays();
    setCurrentDay(currentDayIdx, { scroll: true });
    fetchWeather();
    toast('Dates mises à jour');
  });
  $('#resetData').addEventListener('click', () => {
    localStorage.removeItem(STORAGE.done);
    renderDays();
    toast('Cases réinitialisées');
  });
}

// ---------- MAP -----------------------------------------------------

function setupMap() {
  // Basic Leaflet map centred on Madeira
  map = L.map('leaflet-map', {
    center: [32.7607, -16.9595],
    zoom: 10,
    zoomControl: true,
    attributionControl: true
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  // Build place → days mapping for filter labels
  const placeDays = {};
  DAYS.forEach(day => day.items.forEach(it => it.places.forEach(pid => {
    placeDays[pid] = placeDays[pid] || new Set();
    placeDays[pid].add(day.id);
  })));

  // Add markers
  Object.entries(PLACES).forEach(([pid, p]) => {
    const days = [...(placeDays[pid] || [])].sort();
    if (days.length === 0) return; // skip places never referenced
    const cls = p.type === 'meal' ? 'leaflet-pin meal' : 'leaflet-pin';
    const label = days.map(d => DAYS[d-1].dow.charAt(0)).join('');
    const icon = L.divIcon({
      html: `<div class="${cls}"><span>${label}</span></div>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 28]
    });
    const m = L.marker([p.lat, p.lng], { icon })
      .addTo(map)
      .on('click', () => openPlaceModal(pid));
    m._pid = pid;
    m._days = days;
    m._type = p.type;
    mapMarkers.push(m);
  });

  // Build the list below
  renderMapList();

  // Filter buttons
  $$('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-pill').forEach(b => b.classList.toggle('active', b === btn));
      activeFilter = btn.dataset.filter;
      applyMapFilter();
    });
  });
}

function applyMapFilter() {
  let visiblePoints = [];
  mapMarkers.forEach(m => {
    let show = true;
    if (activeFilter === 'meal') show = m._type === 'meal';
    else if (activeFilter === 'sight') show = m._type === 'sight';
    else if (activeFilter.startsWith('d')) {
      const dayNum = parseInt(activeFilter.slice(1), 10);
      show = m._days.includes(dayNum);
    }
    if (show) {
      m.addTo(map);
      visiblePoints.push(m.getLatLng());
    } else {
      map.removeLayer(m);
    }
  });
  if (visiblePoints.length > 0) {
    const bounds = L.latLngBounds(visiblePoints);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }
  renderMapList();
}

function renderMapList() {
  const placeDays = {};
  DAYS.forEach(day => day.items.forEach(it => it.places.forEach(pid => {
    placeDays[pid] = placeDays[pid] || new Set();
    placeDays[pid].add(day.id);
  })));
  const list = $('#mapList');
  const rows = Object.entries(PLACES)
    .filter(([pid]) => placeDays[pid])
    .filter(([pid, p]) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'meal') return p.type === 'meal';
      if (activeFilter === 'sight') return p.type === 'sight';
      if (activeFilter.startsWith('d')) return placeDays[pid].has(parseInt(activeFilter.slice(1), 10));
      return true;
    })
    .map(([pid, p]) => {
      const days = [...placeDays[pid]].sort();
      const dayRefs = days.map(d => DAYS[d-1].dow).join(' · ');
      const cls = p.type === 'meal' ? 'map-row meal' : 'map-row';
      const label = days.map(d => d).join('');
      return `
        <div class="${cls}" data-place="${pid}">
          <div class="pin">${label}</div>
          <div class="info">
            <div class="name">${escapeHtml(p.name)}</div>
            <div class="day-ref">${dayRefs}${p.type === 'meal' ? ' · Restaurant' : ''}</div>
          </div>
        </div>`;
    }).join('');
  list.innerHTML = rows || '<div style="padding:24px;text-align:center;color:var(--whisper);font-size:13px;">Aucun lieu pour ce filtre.</div>';
  $$('.map-row', list).forEach(row => {
    row.addEventListener('click', () => {
      const pid = row.dataset.place;
      const p = PLACES[pid];
      // Pan map and open marker
      map.flyTo([p.lat, p.lng], 14, { duration: 0.6 });
      openPlaceModal(pid);
    });
  });
}

// ---------- RESTAURANT LIST IN EATS PANE ---------------------------

function renderRestaurants() {
  const placeDays = {};
  DAYS.forEach(day => day.items.forEach(it => it.places.forEach(pid => {
    placeDays[pid] = placeDays[pid] || new Set();
    placeDays[pid].add(day.id);
  })));
  const list = $('#restaurantList');
  const rows = Object.entries(PLACES)
    .filter(([pid, p]) => p.type === 'meal' && placeDays[pid])
    .map(([pid, p]) => {
      const days = [...placeDays[pid]].sort();
      const dayLabel = days.map(d => `${DAYS[d-1].dow}`).join(' · ');
      return `
        <div class="card-block" style="padding:18px;margin-bottom:10px;cursor:pointer;" data-place="${pid}">
          <div class="card-kicker">${dayLabel}</div>
          <h3 style="font-size:18px;margin-bottom:6px;">${escapeHtml(p.name)}</h3>
          <p style="font-size:13px;line-height:1.5;color:var(--whisper);">${escapeHtml(p.desc)}</p>
        </div>`;
    }).join('');
  list.innerHTML = rows;
  $$('[data-place]', list).forEach(card => {
    card.addEventListener('click', () => openPlaceModal(card.dataset.place));
  });
}

// ---------- WEATHER -------------------------------------------------

async function fetchWeather() {
  // Coordinates of Estreito da Calheta (the trip base)
  const lat = 32.7286, lng = -17.1797;
  const start = getTripStart();
  const startISO = isoDate(start);
  const end = new Date(start);
  end.setDate(end.getDate() + DAYS.length - 1);
  const endISO = isoDate(end);

  // Open-Meteo forecast: works up to 16 days out
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
              `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
              `&timezone=Atlantic%2FMadeira` +
              `&start_date=${startISO}&end_date=${endISO}`;

  let data = null;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      data = await res.json();
      localStorage.setItem(STORAGE.weather, JSON.stringify({ key: startISO, data }));
    }
  } catch {}

  // Cache fallback
  if (!data) {
    try {
      const cached = JSON.parse(localStorage.getItem(STORAGE.weather) || 'null');
      if (cached && cached.key === startISO) data = cached.data;
    } catch {}
  }

  if (!data || !data.daily) {
    // Outside forecast window or offline with no cache
    DAYS.forEach((d, i) => paintWeather(d.id, null));
    return;
  }

  const { time, weather_code, temperature_2m_max, temperature_2m_min } = data.daily;
  DAYS.forEach((d, i) => {
    const dateISO = isoDate(dateForDay(i));
    const idx = time.indexOf(dateISO);
    if (idx === -1) {
      paintWeather(d.id, null);
    } else {
      paintWeather(d.id, {
        code: weather_code[idx],
        hi: Math.round(temperature_2m_max[idx]),
        lo: Math.round(temperature_2m_min[idx])
      });
    }
  });
}

function paintWeather(dayId, w) {
  const el = document.querySelector(`[data-weather-day="${dayId}"]`);
  if (!el) return;
  el.classList.remove('skeleton');
  if (!w) {
    el.querySelector('.weather-icon').textContent = '🌤️';
    el.querySelector('.weather-temps').textContent = '— °';
    el.querySelector('.weather-desc').textContent = 'Prévisions hors fenêtre';
    return;
  }
  const [emoji, label] = WMO[w.code] || ['🌤️', 'Variable'];
  el.querySelector('.weather-icon').textContent = emoji;
  el.querySelector('.weather-temps').innerHTML = `${w.hi}°<span class="lo">/ ${w.lo}°</span>`;
  el.querySelector('.weather-desc').textContent = label;
}

// ---------- INSTALL PROMPT (PWA) -----------------------------------

let deferredInstall = null;
function setupInstall() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstall = e;
    if (localStorage.getItem('mad26.installDismissed') !== '1') {
      $('#installPrompt').classList.add('show');
    }
  });
  $('#installAccept').addEventListener('click', async () => {
    $('#installPrompt').classList.remove('show');
    if (!deferredInstall) return;
    deferredInstall.prompt();
    deferredInstall = null;
  });
  $('#installDismiss').addEventListener('click', () => {
    $('#installPrompt').classList.remove('show');
    localStorage.setItem('mad26.installDismissed', '1');
  });
}

// ---------- SERVICE WORKER ------------------------------------------

function setupSW() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// ---------- SWIPE NAV BUTTONS --------------------------------------

function setupSwipeNav() {
  $('#prevDay').addEventListener('click', () => setCurrentDay(currentDayIdx - 1));
  $('#nextDay').addEventListener('click', () => setCurrentDay(currentDayIdx + 1));
}

// ---------- AUTO-SELECT TODAY'S DAY --------------------------------

function autoSelectToday() {
  const start = getTripStart();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today - start) / 86400000);
  if (diff >= 0 && diff < DAYS.length) {
    setCurrentDay(diff, { scroll: true });
  } else {
    setCurrentDay(0, { scroll: false });
  }
}

// ---------- BOOT ----------------------------------------------------

function boot() {
  renderDays();
  renderRestaurants();
  setupTabs();
  setupModals();
  setupSettings();
  setupSwipeNav();
  setupPagerScrollSync();
  setupMap();
  setupInstall();
  setupSW();
  autoSelectToday();
  fetchWeather();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
