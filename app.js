// ====================================================================
//  Madère 2026 — Carnet de voyage
//  Pure-JS PWA. No build step. Works offline once cached.
// ====================================================================

// ---------- DATA ----------------------------------------------------

// Coordinates verified May 2026 against IPMA, OSM, Wikipedia, sea-seek, Michelin.
// `q` field is the canonical Google/Apple Maps query (preferred over raw coords —
// avoids the "pin in the sea" problem when coords are slightly off the actual building).
const PLACES = {
  'aeroport':              { name: "Aéroport de Madère",          q: "Aeroporto da Madeira Cristiano Ronaldo",                          lat: 32.69780, lng: -16.77460, type: 'sight', desc: "Aéroport Cristiano Ronaldo (FNC). Vents traversiers fréquents — prévoir large pour les retours." },
  'estreito':              { name: "Estreito da Calheta",         q: "Estreito da Calheta, Madeira",                                    lat: 32.73798, lng: -17.18095, type: 'sight', desc: "Le village de la base. Côte sud-ouest, climat doux, à 5 min de la marina." },
  'praia-calheta':         { name: "Praia da Calheta",            q: "Praia da Calheta, Madeira",                                       lat: 32.72035, lng: -17.17831, type: 'sight', desc: "Plage de sable jaune importé du Maroc. Pontons plats, eau calme, parfaite pour une première baignade." },
  'marina-calheta':        { name: "Marina da Calheta",           q: "Marina da Calheta, Madeira",                                      lat: 32.71781, lng: -17.17211, type: 'sight', desc: "Port de plaisance. Point d'embarquement pour les sorties en mer (Lobosonda, On Tales, H2O Madeira)." },
  'mercado':               { name: "Mercado dos Lavradores",      q: "Mercado dos Lavradores, Funchal",                                 lat: 32.64865, lng: -16.90377, type: 'sight', desc: "Marché central de Funchal. Halle Art déco, fruits exotiques (anonas, maracujás), poissons frais. Attention aux prix gonflés des fruits — négocier ou observer avant." },
  'cathedrale':            { name: "Cathédrale Sé de Funchal",    q: "Sé Catedral do Funchal",                                          lat: 32.64760, lng: -16.90880, type: 'sight', desc: "Cathédrale du XVe siècle. Plafond mudéjar en bois de cèdre. Largo da Sé." },
  'zona-velha':            { name: "Zona Velha de Funchal",       q: "Zona Velha do Funchal Rua de Santa Maria",                        lat: 32.64790, lng: -16.90360, type: 'sight', desc: "Vieille ville plate, ruelles pavées, portes peintes (Projecto ARTeria). Restaurants en terrasse rua de Santa Maria." },
  'telepherique':          { name: "Téléphérique Funchal-Monte",  q: "Teleférico do Funchal estação Almirante Reis",                    lat: 32.64850, lng: -16.90360, type: 'sight', desc: "Station basse au parc Almirante Reis (à côté de la Zona Velha). 15 min de cabine au-dessus de la baie." },
  'monte-palace':          { name: "Monte Palace Tropical Garden", q: "Monte Palace Tropical Garden Funchal",                            lat: 32.67404, lng: -16.90200, type: 'sight', desc: "Jardin tropical au sommet de Monte. Mosaïques portugaises (azulejos), étangs à carpes koï, jardins japonais." },
  'blandys':               { name: "Blandy's Wine Lodge",         q: "Blandy's Wine Lodge Funchal Avenida Arriaga",                     lat: 32.64720, lng: -16.91180, type: 'sight', desc: "Cave historique du vin de Madère, Av. Arriaga 28. Visite guidée + dégustation, parfaitement accessible." },
  'vila-peixe':            { name: "Vila do Peixe",               q: "Vila do Peixe restaurante Câmara de Lobos",                       lat: 32.64600, lng: -16.97650, type: 'meal',  desc: "Poisson frais grillé au gros sel face au port de Câmara de Lobos. Référence Michelin Guide. Rua Dr João Abel de Freitas 30A." },
  'vila-carne':            { name: "Vila da Carne",               q: "Vila da Carne restaurante Câmara de Lobos",                       lat: 32.64600, lng: -16.97650, type: 'meal',  desc: "Sœur jumelle de Vila do Peixe, juste à côté. Espetada de référence à Câmara de Lobos. Rua Dr João Abel de Freitas 30." },
  'cascata-anjos':         { name: "Cascata dos Anjos",           q: "Cascata dos Anjos Ponta do Sol Madeira",                          lat: 32.68290, lng: -17.10960, type: 'sight', desc: "Cascade qui tombe sur la chaussée (ancienne ER101). On passe sous les embruns en voiture, fenêtres fermées." },
  'seixal':                { name: "Praia do Seixal",             q: "Praia do Seixal Madeira",                                         lat: 32.82400, lng: -17.10932, type: 'sight', desc: "Plage de sable noir volcanique sur la côte nord. Cadre spectaculaire entre falaises." },
  'fanal':                 { name: "Forêt de Fanal",              q: "Posto Florestal do Fanal Madeira",                                lat: 32.80951, lng: -17.14098, type: 'sight', desc: "Posto Florestal do Fanal. Forêt de lauriers (Laurissilva) brumeuse, irréelle quand la brume descend. Patrimoine Unesco." },
  'porto-moniz':           { name: "Piscines de Porto Moniz",     q: "Piscinas Naturais de Porto Moniz",                                lat: 32.86700, lng: -17.17400, type: 'sight', desc: "Piscines naturelles aménagées dans la lave. Vestiaires, douches, accès facile." },
  'cachalote':             { name: "Restaurante Cachalote",       q: "Restaurante Cachalote Porto Moniz",                               lat: 32.86680, lng: -17.17440, type: 'meal',  desc: "Poisson grillé en terrasse, posé sur la roche volcanique face aux piscines. Maison de 1969. Forte de São João Batista." },
  'cabo-girao':            { name: "Cabo Girão Skywalk",          q: "Miradouro do Cabo Girão Skywalk",                                 lat: 32.65652, lng: -17.00444, type: 'sight', desc: "Plateforme de verre suspendue à 580 m, l'une des plus hautes falaises maritimes d'Europe." },
  'pico-areeiro':          { name: "Pico do Areeiro",             q: "Pico do Arieiro Madeira",                                         lat: 32.73477, lng: -16.92871, type: 'sight', desc: "3e sommet de l'île (1818 m), accessible en voiture. Vue à 360° sur le centre montagneux." },
  'pico-areeiro-parking':  { name: "Parking Pico do Areeiro",     q: "Pico do Arieiro parking",                                         lat: 32.73477, lng: -16.92871, type: 'sight', desc: "Parking du sommet (payant). Point de départ du sentier PR1 vers Pico Ruivo / Stairway to Heaven." },
  'ribeiro-frio':          { name: "Ribeiro Frio",                q: "Ribeiro Frio Posto Aquícola Madeira",                             lat: 32.73600, lng: -16.88550, type: 'meal',  desc: "Posto Aquícola : truites élevées sur place, cuisine simple en pleine forêt de lauriers. Sur la route ER103." },
  'santana':               { name: "Casas de Santana",            q: "Casas Típicas de Santana Madeira",                                lat: 32.80526, lng: -16.88241, type: 'sight', desc: "Maisons triangulaires colorées au toit de chaume, emblèmes du nord de l'île. Trois sont conservées au Parque Temático." },
  'cantinho-serra':        { name: "Cantinho da Serra (Santana)", q: "Cantinho da Serra restaurante Santana Pico das Pedras",           lat: 32.78950, lng: -16.88950, type: 'meal',  desc: "Cuisine madérienne au feu de bois, Estrada do Pico das Pedras 57, Santana — à combiner avec la visite des Casas. ⚠️ N'EST PAS à Calheta." },
  'sao-lourenco':          { name: "Ponta de São Lourenço",       q: "Vereda da Ponta de São Lourenço PR8 parking",                     lat: 32.74322, lng: -16.70094, type: 'sight', desc: "Pointe est de l'île. Parking PR8, panorama lunaire de roches rouges et noires." },
  'rabacal':               { name: "Parking Rabaçal",             q: "Rabaçal Levada das 25 Fontes parking",                            lat: 32.75472, lng: -17.13375, type: 'sight', desc: "Altitude 1291 m. Point de départ des Levadas das 25 Fontes (PR6) et do Risco. Sentiers plats le long des canaux." },
  'ponta-sol':             { name: "Ponta do Sol",                q: "Ponta do Sol Madeira",                                            lat: 32.67740, lng: -17.10000, type: 'sight', desc: "Village dans le creux d'une falaise, le plus ensoleillé de l'île." },
  'camara-lobos':          { name: "Câmara de Lobos",             q: "Câmara de Lobos porto",                                           lat: 32.64600, lng: -16.97700, type: 'sight', desc: "Port de pêche peint par Churchill. Un dernier expresso face aux barques colorées." },

  // Festa da Flor 2026 — venues vérifiés
  'avenida-mar':           { name: "Avenida do Mar (Cortejo)",     q: "Avenida do Mar Funchal",                                          lat: 32.64530, lng: -16.90820, type: 'event', desc: "Avenida do Mar e das Comunidades Madeirenses, Funchal. Le grand cortège fleuri y défile dimanche 17 mai à 16h30." },
  'avenida-arriaga':       { name: "Avenida Arriaga (Mercado da Flor)", q: "Avenida Arriaga Funchal",                                    lat: 32.64720, lng: -16.91100, type: 'event', desc: "Avenue commerciale piétonne au centre de Funchal. Mercado da Flor + tapis floraux entre la Loja do Cidadão et le Largo do Corpo Santo. Marché 10h–minuit (sam jusqu'à 1h)." },
  'pavilhao-flor':         { name: "Pavilhão da Flor",             q: "Largo da Restauração Funchal",                                    lat: 32.64739, lng: -16.90969, type: 'event', desc: "Largo da Restauração, à l'extrémité est de l'Avenida Arriaga (face au fort São Lourenço). 71e Exposição da Flor, ouverte tous les jours du séjour. Entrée libre, ~30 min." },
  'praca-povo':            { name: "Praça do Povo (Classic Cars)", q: "Praça do Povo Funchal",                                           lat: 32.64480, lng: -16.90600, type: 'event', desc: "Place inaugurée en 2014, sur le front de mer face à la marina de Funchal. Madeira Classic Car Revival du 22 au 24 mai. Concours costume vintage samedi 14h–15h." },
  'canico':                { name: "Caniço (Festa da Cebola)",     q: "Caniço Santa Cruz Madeira",                                       lat: 32.64850, lng: -16.84290, type: 'event', desc: "Village de Caniço, municipalité de Santa Cruz, ~50 min de Funchal. Festa da Cebola du 22 au 24 mai : cortège de tracteurs, enchère d'oignons, musique et stands." },

  // Restaurants vérifiés — TripAdvisor / Michelin Guide / TheFork (mai 2026)
  'akua':              { name: "Ákua by Chef Júlio Pereira",  q: "Akua restaurante Funchal Rua dos Murças",          lat: 32.64770, lng: -16.90840, type: 'meal', desc: "★ Michelin Guide. Cuisine madérienne contemporaine, accent fruits de mer. Rua dos Murças 6, Funchal centre. TripAdvisor 4.5/5, Google 4.7. €€€ — réservation impérative pour 5." },
  'kampo':             { name: "Kampo by Chef Júlio Pereira", q: "Kampo restaurante Funchal Rua da Alfândega",       lat: 32.64790, lng: -16.90770, type: 'meal', desc: "★ Michelin Guide. Sœur d'Ákua, plus orientée viande (queue de bœuf, T-bone, surf-and-turf). Rua da Alfândega 74, Funchal. TripAdvisor 4.5+, Google 4.7. €€-€€€." },
  'razao':             { name: "RAZÃO por Octávio Freitas",   q: "Razão Octávio Freitas Socalco Nature Calheta",     lat: 32.72510, lng: -17.18100, type: 'meal', desc: "Chef ex-Il Gallo d'Oro (2 ⭐). Cuisine d'auteur, produit régional. À l'hôtel Socalco Nature Calheta, à 5 min de la base. €€€. Réservation impérative." },
  'onda-azul':         { name: "Onda Azul (Calheta Beach)",   q: "Onda Azul Calheta Beach Hotel",                    lat: 32.71970, lng: -17.17280, type: 'meal', desc: "Restaurant du Calheta Beach Hotel, en bord de plage. Madère + international. TheFork 8.5/10. €€. Bonne option sans réserver très en avance." },
  'old-pharmacy':      { name: "The Old Pharmacy",            q: "The Old Pharmacy Ponta do Sol",                    lat: 32.68040, lng: -17.10000, type: 'meal', desc: "Tapas, petiscos, brunch, bar à vins, ambiance lounge. Centre du village face à l'église. TripAdvisor 4.3/5 (618 avis), Google 4.5. €€." },
  'orca-porto-moniz':  { name: "Restaurante Orca",            q: "Restaurante Orca Porto Moniz",                     lat: 32.86670, lng: -17.17460, type: 'meal', desc: "Plan B si Cachalote complet — juste à côté, même rotunda des piscines. Poisson madérien, même vue. €€." },
  'avenida-gastropub': { name: "Avenida GastroPub & Grill",   q: "Avenida GastroPub Grill Ribeira Brava",            lat: 32.67310, lng: -17.06170, type: 'meal', desc: "Sur l'avenue front de mer de Ribeira Brava. Burgers, viandes grillées, poissons. TripAdvisor 4.3/5. €€. Pratique sur la route Calheta ↔ Funchal." },
  'o-recante':         { name: "Restaurante O Recante",       q: "Restaurante O Recante Caniçal",                    lat: 32.74050, lng: -16.74100, type: 'meal', desc: "★ Top de l'est (TripAdvisor 4.8/5, ~185 avis). Pêche du jour, poulpe tendre, gambas à l'ail. Estrada de São Lourenço 67, Caniçal — sur la route du PR8. €€. Réservation conseillée." },
  'mercado-velho':     { name: "Restaurante Mercado Velho",   q: "Restaurante Mercado Velho Machico",                lat: 32.71790, lng: -16.76410, type: 'meal', desc: "Dans un bâtiment XVIIe restauré, sous les platanes (Alameda dos Plátanos), Machico. Poisson madérien traditionnel. €€." },

  // Parking — utile pour le Cortejo de la Festa da Flor
  'parking-almirante': { name: "Parking Almirante Reis (Cortejo)", q: "Parque de Estacionamento Almirante Reis Funchal", lat: 32.64830, lng: -16.90230, type: 'sight', desc: "Le grand parking souterrain du centre Funchal, ouvert le dimanche (~€1.40/h, ~€10/jour). 8–10 min à pied de l'Avenida do Mar. ⚠️ Accès uniquement via Rua D. Carlos I (côté est) — le tunnel Sá Carneiro est fermé pendant le Cortejo. Arriver avant 14h." }
};

const DAYS = [
  {
    id: 1, dow: 'Dim', emoji: '✈️', featured: true,
    title: "Atterrissage & Festa da Flor",
    subtitle: "Funchal Airport → cortège fleuri → Calheta",
    items: [
      { time: "14:00", title: "Récupération de la voiture", body: "Sortie aéroport, choix : direct Calheta (50 min) — OU détour Funchal pour le cortège (voir Bonus).", places: ['aeroport'] },
      { time: "16:30", title: "★ Cortejo Alegórico (Festa da Flor)", body: "Le grand cortège fleuri, Avenida do Mar à Funchal. Coup de chance : il tombe le jour de l'arrivée. ~1500 figurants, chars en fleurs. Visible gratuitement le long de l'avenue. Si fatigue : zapper et filer à Calheta. 🅿️ Parking : Parque Almirante Reis (accès Rua D. Carlos I — le tunnel Sá Carneiro est fermé). Arriver avant 14h.", places: ['avenida-mar', 'parking-almirante'] },
      { time: "18:30", title: "Cap à l'ouest", body: "VR1 puis VE3 — 50 min de routes côtières jusqu'à Estreito da Calheta.", places: ['estreito'] },
      { time: "19:30", title: "Check-in & piscine", body: "Les jambes posées, le voyage commence vraiment.", places: [] },
      { time: "21:00", title: "Dîner — Razão (option ★)", body: "À 5 min de l'hôtel : RAZÃO par Octávio Freitas (ex-Il Gallo d'Oro, 2 étoiles Michelin) au Socalco Nature. Réservation impérative pour 5. Sinon : Onda Azul à la marina.", places: ['razao', 'onda-azul'] }
    ]
  },
  {
    id: 2, dow: 'Lun', emoji: '⛪', featured: false,
    title: "Funchal en pleine Festa da Flor",
    subtitle: "Marché, fleurs, téléphérique, Monte",
    items: [
      { time: "10:00", title: "Mercado dos Lavradores", body: "Anonas, maracujás, fruta deliciosa — goûter avant d'acheter, les prix au stand sont gonflés pour les touristes.", places: ['mercado'] },
      { time: "11:00", title: "Mercado da Flor & tapis floraux", body: "Pendant la Festa da Flor : marché aux fleurs sur l'Avenida Arriaga, et 18 tapis floraux entre la Loja do Cidadão et le Largo do Corpo Santo.", places: [] },
      { time: "12:30", title: "Centre historique", body: "Cathédrale Sé, ruelles plates de la Zona Velha (rues peintes du projet ARTeria).", places: ['cathedrale', 'zona-velha'] },
      { time: "14:30", title: "Exposição da Flor", body: "Pavilhão da Flor, Largo da Restauração — 71e exposition florale annuelle, ouverte tous les jours du voyage. Courte (~30 min).", places: [] },
      { time: "15:30", title: "Téléphérique de Monte", body: "15 minutes de cabine au-dessus de la baie. Au sommet : Jardin Tropical de Monte Palace.", places: ['telepherique', 'monte-palace'] },
      { time: "17:00", title: "Carros de cesto", body: "Descente en panier d'osier pour les plus jeunes ; les parents redescendent en téléphérique.", places: [] },
      { time: "Soir", title: "Dîner — Ákua ★", body: "Cuisine madérienne contemporaine du chef Júlio Pereira (Michelin Guide). Rua dos Murças 6, en plein centre Funchal. Alternative : Kampo (sœur d'Ákua, plus orientée viande).", places: ['akua', 'kampo'] }
    ]
  },
  {
    id: 3, dow: 'Mar', emoji: '🐬', featured: true,
    title: "Au large, les dauphins",
    subtitle: "Sortie en mer depuis la marina de Calheta",
    items: [
      { time: "09:30", title: "Embarquement marina de Calheta", body: "⚠️ Pas de catamaran à Calheta — uniquement bateaux moyens. Lobosonda : bateau bois traditionnel Ribeira Brava (16 places, plus stable, à demander) ou semi-rigide Stenella (rapide, secoué). Alternatives : On Tales (yacht voilier) ou H2O Madeira.", places: ['marina-calheta'] },
      { time: "10–13h", title: "3 heures au large", body: "Dauphins communs, baleines pilotes, parfois tortues caouannes. Les guides sont biologistes marins.", places: [] },
      { time: "14:00", title: "Repos hôtel", body: "Le sel, la peau qui tire, la sieste qui s'impose.", places: [] },
      { time: "19:30", title: "Dîner — Vila do Peixe", body: "Poisson frais grillé au gros sel face au port de Câmara de Lobos. Référence Michelin Guide.", places: ['vila-peixe'] }
    ]
  },
  {
    id: 4, dow: 'Mer', emoji: '🌊', featured: false, rest: true,
    title: "La côte volcanique",
    subtitle: "Cap au nord-ouest — parents au repos à l'hôtel",
    items: [
      { time: "10:00", title: "Route panoramique", body: "Cascata dos Anjos qui tombe sur la chaussée, Seixal et son sable noir, forêt de Fanal si la brume joue le jeu.", places: ['cascata-anjos', 'seixal', 'fanal'] },
      { time: "12:30", title: "Porto Moniz", body: "Piscines naturelles de lave — eau de mer dans la roche noire. La carte postale de Madère.", places: ['porto-moniz'] },
      { time: "14:00", title: "Déjeuner aux piscines", body: "Cachalote (poisson grillé, terrasse sur la roche, maison de 1969) ou son voisin direct Orca si complet — même rotunda des piscines.", places: ['cachalote', 'orca-porto-moniz'] }
    ]
  },
  {
    id: 5, dow: 'Jeu', emoji: '⛰️', featured: false,
    title: "Le grand circuit oriental",
    subtitle: "Toute l'île en voiture · panoramas pour tous",
    items: [
      { time: "09:00", title: "Cabo Girão", body: "Skywalk vitré à 580 m au-dessus de l'océan — accès direct depuis le parking.", places: ['cabo-girao'] },
      { time: "11:00", title: "Pico do Areeiro · 1818 m", body: "On monte en voiture jusqu'au sommet. Vue à 360° sur le centre montagneux.", places: ['pico-areeiro'] },
      { time: "13:00", title: "Déjeuner — au choix", body: "Truites de Ribeiro Frio en pleine forêt de lauriers, OU Cantinho da Serra (Estrada do Pico das Pedras, Santana) — cuisine au feu de bois, idéal pour enchaîner avec la visite des Casas Típicas.", places: ['ribeiro-frio', 'cantinho-serra'] },
      { time: "15:00", title: "Casas de Santana & São Lourenço", body: "Maisons triangulaires colorées (Parque Temático), puis cap à l'est pour le panorama lunaire de la Ponta de São Lourenço.", places: ['santana', 'sao-lourenco'] },
      { time: "19:00", title: "Retour Calheta", body: "1h15 de route par la VR1 (côte sud).", places: [] }
    ]
  },
  {
    id: 6, dow: 'Ven', emoji: '🌿', featured: false, rest: true,
    title: "Levada & dîner d'adieu",
    subtitle: "Levada douce, parents au repos le matin",
    items: [
      { time: "Matin", title: "Levada das 25 Fontes ou do Risco", body: "Sentiers PR6 plats (alt. 1291 m au départ) le long des canaux d'irrigation. La Madère secrète — mousse et eau claire.", places: ['rabacal'] },
      { time: "13:00", title: "Déjeuner — The Old Pharmacy", body: "Tapas, brunch, bar à vins en centre Ponta do Sol (TripAdvisor 4.3, ~620 avis). Le village est dans le creux d'une falaise — le plus ensoleillé de l'île.", places: ['old-pharmacy', 'ponta-sol'] },
      { time: "18:30", title: "Coucher de soleil au Cabo Girão", body: "Ou depuis la piscine, selon les forces.", places: ['cabo-girao'] },
      { time: "20:30", title: "Dîner d'adieu — Vila da Carne", body: "L'espetada de référence à Câmara de Lobos. Sœur jumelle de Vila do Peixe (juste à côté).", places: ['vila-carne'] }
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
        const cls = p.type === 'meal' ? 'loc-chip meal' : p.type === 'event' ? 'loc-chip event' : 'loc-chip';
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

  // Chip clicks are wired globally via setupChipDelegation()

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
      if (tab === 'map' && map) {
        // Multi-call invalidate covers the CSS transition + first paint —
        // fixes the "map only renders 1/3 of the time" issue.
        [40, 200, 600].forEach(d => setTimeout(() => map.invalidateSize(), d));
      }
    });
  });
}

// ---------- MODAL: PLACE -------------------------------------------

function openPlaceModal(placeId) {
  const p = PLACES[placeId];
  if (!p) return;
  // Reset modal in case it was previously used by openWeatherChooser
  $('#btnWaze').style.display = 'flex';
  $('#btnApple').style.display = 'flex';
  $('#btnShare').style.display = 'flex';
  $('#btnGmaps').style.display = 'flex';
  $('#btnGmaps').innerHTML = '<span class="btn-icon">🗺️</span><span>Itinéraire · Google Maps</span>';
  $('#btnApple').innerHTML = '<span class="btn-icon">🍎</span><span>Itinéraire · Plans (Apple)</span>';
  $('#btnWaze').innerHTML  = '<span class="btn-icon">🚗</span><span>Itinéraire · Waze</span>';
  $('#btnShare').innerHTML = '<span class="btn-icon">↗︎</span><span>Partager le lieu</span>';
  const ipmaBtn = $('#btnIpma'); if (ipmaBtn) ipmaBtn.remove();
  const kicker = p.type === 'meal' ? 'Restaurant' : p.type === 'event' ? 'Événement' : 'Destination';
  $('#modalKicker').textContent = kicker;
  $('#modalTitle').textContent = p.name;
  $('#modalDesc').textContent = p.desc || '';
  $('#modalCoords').textContent = '';
  // Build Maps URLs using the canonical place name (q). Google/Apple geocode the
  // business directly — far more reliable than raw lat,lng (which can land 50m
  // off, sometimes in the sea for coastal restaurants).
  // Waze stays coords-based since it has no place-name lookup.
  const query = p.q ? encodeURIComponent(p.q) : `${p.lat},${p.lng}`;
  $('#btnWaze').href  = `https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=no&zoom=17`;
  $('#btnGmaps').href = `https://www.google.com/maps?q=${query}`;
  $('#btnApple').href = `https://maps.apple.com/?q=${query}`;
  $('#btnShare').onclick = async () => {
    const text = `${p.name} — https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
    if (navigator.share) {
      try { await navigator.share({ title: p.name, text }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(text); toast('Lien copié'); } catch {}
    }
  };
  $('#modalCoords').onclick = null;
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
  const fu = $('#forceUpdate');
  if (fu) fu.addEventListener('click', () => {
    toast('Effacement du cache…', 1500);
    setTimeout(forceAppUpdate, 200);
  });
  const ver = $('#appVersion');
  if (ver) ver.textContent = `Version ${APP_VERSION}`;
}

// ---------- MAP -----------------------------------------------------

// One distinctive colour per day for the route polylines
const DAY_COLORS = {
  1: '#c8553d', // terracotta
  2: '#d4a574', // gold
  3: '#1a4d5c', // ocean
  4: '#5a6f4a', // moss
  5: '#8b5a8c', // plum
  6: '#3a6a8a', // slate blue
  7: '#0d2e38'  // ocean deep
};

let mapPolylines = [];

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

  // Build place → days mapping
  const placeDays = {};
  DAYS.forEach(day => day.items.forEach(it => it.places.forEach(pid => {
    placeDays[pid] = placeDays[pid] || new Set();
    placeDays[pid].add(day.id);
  })));

  // Add markers (only for places referenced in any day)
  Object.entries(PLACES).forEach(([pid, p]) => {
    const days = [...(placeDays[pid] || [])].sort();
    if (days.length === 0) return;
    const cls = p.type === 'meal' ? 'leaflet-pin meal' : p.type === 'event' ? 'leaflet-pin event' : 'leaflet-pin';
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

  // Build per-day route polylines (drawn but hidden by default; filter toggles them)
  DAYS.forEach(day => {
    const pts = [];
    day.items.forEach(it => it.places.forEach(pid => {
      const p = PLACES[pid];
      if (p) pts.push([p.lat, p.lng]);
    }));
    if (pts.length < 2) return;
    const line = L.polyline(pts, {
      color: DAY_COLORS[day.id],
      weight: 3,
      opacity: 0.75,
      dashArray: '6 6',
      lineCap: 'round',
      lineJoin: 'round'
    });
    line._dayId = day.id;
    mapPolylines.push(line);
  });

  renderMapList();

  // Filter buttons (days only)
  $$('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-pill').forEach(b => b.classList.toggle('active', b === btn));
      activeFilter = btn.dataset.filter;
      applyMapFilter();
    });
  });

  // Draw all routes on initial "all" filter
  applyMapFilter();

  // ResizeObserver fixes the "map only renders 1 in 3 times" bug — when the
  // pane goes from hidden → visible, Leaflet doesn't know its new size until
  // we tell it. Calling invalidateSize on every resize covers that, plus
  // orientation changes and PWA install events.
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      if (map) map.invalidateSize();
    });
    ro.observe(document.getElementById('leaflet-map'));
  }
}

function applyMapFilter() {
  let visiblePoints = [];
  // Markers
  mapMarkers.forEach(m => {
    let show = true;
    if (activeFilter.startsWith('d')) {
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
  // Polylines — show one specific day, or all days if "all"
  mapPolylines.forEach(line => {
    let show = true;
    if (activeFilter.startsWith('d')) {
      show = line._dayId === parseInt(activeFilter.slice(1), 10);
    }
    if (show) line.addTo(map);
    else map.removeLayer(line);
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
  // Show every meal place — even ones not pinned to a specific day,
  // so the user has the full set of vetted options.
  const rows = Object.entries(PLACES)
    .filter(([, p]) => p.type === 'meal')
    .sort(([a], [b]) => {
      const da = placeDays[a] ? Math.min(...placeDays[a]) : 99;
      const db = placeDays[b] ? Math.min(...placeDays[b]) : 99;
      return da - db;
    })
    .map(([pid, p]) => {
      const days = placeDays[pid] ? [...placeDays[pid]].sort() : [];
      const dayLabel = days.length
        ? days.map(d => DAYS[d-1].dow).join(' · ')
        : 'À la carte';
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

// External weather page targets
const METEOBLUE_URL = 'https://www.meteoblue.com/en/weather/14-days/estreito-da-calheta_portugal_2268419';
const IPMA_URL      = 'https://www.ipma.pt/en/otempo/prev.localidade.hora/index.jsp?idDistrito=31&idConcelho=502&idLocal=2310303';

function paintWeather(dayId, w) {
  const el = document.querySelector(`[data-weather-day="${dayId}"]`);
  if (!el) return;
  el.classList.remove('skeleton');
  if (!w) {
    el.querySelector('.weather-icon').textContent = '🌤️';
    el.querySelector('.weather-temps').textContent = '— °';
    el.querySelector('.weather-desc').textContent = 'Tap pour les prévisions';
  } else {
    const [emoji, label] = WMO[w.code] || ['🌤️', 'Variable'];
    el.querySelector('.weather-icon').textContent = emoji;
    el.querySelector('.weather-temps').innerHTML = `${w.hi}°<span class="lo">/ ${w.lo}°</span>`;
    el.querySelector('.weather-desc').textContent = `${label} · tap pour détails`;
  }
  // Wire the click — opens reputable weather site for Madeira
  el.onclick = () => openWeatherChooser(dayId);
}

function openWeatherChooser(dayId) {
  // Two reputable sources: meteoblue (deep-link to Estreito da Calheta, 14-day)
  // and IPMA (Portuguese national weather service, official).
  const day = DAYS.find(d => d.id === dayId);
  const dateLabel = day ? fmtDateShort(dateForDay(day.id - 1)) : '';
  $('#modalKicker').textContent = 'Météo · sources de référence';
  $('#modalTitle').textContent = `Prévisions Madère — ${dateLabel}`;
  $('#modalDesc').textContent = "Deux sources réputées : meteoblue (prévisions 14 jours, lien direct sur Estreito da Calheta) et IPMA, le service météorologique officiel portugais.";
  $('#modalCoords').textContent = '';
  $('#btnWaze').style.display = 'none';
  $('#btnApple').style.display = 'none';
  $('#btnShare').style.display = 'none';
  $('#btnGmaps').style.display = 'flex';
  $('#btnGmaps').href = METEOBLUE_URL;
  $('#btnGmaps').innerHTML = '<span class="btn-icon">⛅</span><span>Meteoblue · 14 jours</span>';
  // Re-purpose share button as IPMA link
  const ipmaBtn = document.createElement('a');
  ipmaBtn.className = 'btn btn-secondary';
  ipmaBtn.id = 'btnIpma';
  ipmaBtn.href = IPMA_URL;
  ipmaBtn.target = '_blank';
  ipmaBtn.rel = 'noopener';
  ipmaBtn.innerHTML = '<span class="btn-icon">🇵🇹</span><span>IPMA · officiel Portugal</span>';
  const existing = $('#btnIpma');
  if (existing) existing.remove();
  $('#btnShare').parentNode.appendChild(ipmaBtn);
  openModal('#modal');
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

const APP_VERSION = 'mad26-v8';

// If the URL contains ?refresh=1 (or ?refresh=anything), wipe caches and reload
// without the param. Acts as a one-tap "kick the stale Safari cache" link the
// user can save as a bookmark and visit when the app feels stuck on old code.
(function handleRefreshParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('refresh')) return;
    Promise.all([
      'serviceWorker' in navigator
        ? navigator.serviceWorker.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister())))
        : Promise.resolve(),
      'caches' in window
        ? caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k))))
        : Promise.resolve()
    ]).finally(() => {
      const u = new URL(window.location.href);
      u.searchParams.delete('refresh');
      u.searchParams.set('v', Date.now());
      window.location.replace(u.toString());
    });
  } catch {}
})();

function setupSW() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    try {
      // updateViaCache:'none' → the SW script itself is never cached, so the
      // browser always fetches the freshest sw.js. Without this, iOS PWA can
      // hold onto an old SW for hours/days.
      const reg = await navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' });
      reg.addEventListener('updatefound', () => {
        const sw = reg.installing;
        if (!sw) return;
        sw.addEventListener('statechange', () => {
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            toast('Nouvelle version dispo · rechargement…', 2200);
            sw.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloaded) return;
        reloaded = true;
        window.location.reload();
      });
      // Periodic check (every 30 min while app is open)
      setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
      // Check once on first load too
      reg.update().catch(() => {});
    } catch {}
  });
}

// Nuclear option: unregister all SWs, drop all caches, and reload.
// Wired to a button in Settings so users stuck on a stale cache can recover.
async function forceAppUpdate() {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch {}
  // Cache-busted reload
  const u = new URL(window.location.href);
  u.searchParams.set('v', Date.now());
  window.location.replace(u.toString());
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

function setupChipDelegation() {
  // Single delegated listener so chips work everywhere — day timelines,
  // Bonus tab (Festa da Flor cards, Stairway block), restaurant cards, etc.
  document.addEventListener('click', e => {
    const chip = e.target.closest('.loc-chip[data-place]');
    if (!chip) return;
    e.preventDefault();
    e.stopPropagation();
    openPlaceModal(chip.dataset.place);
  });
}

function boot() {
  renderDays();
  renderRestaurants();
  setupTabs();
  setupModals();
  setupSettings();
  setupSwipeNav();
  setupPagerScrollSync();
  setupMap();
  setupChipDelegation();
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
