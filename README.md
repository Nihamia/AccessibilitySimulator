# Accessibility Simulator

A browser-based accessibility and public transport digital twin focused on the Clementi MRT area in Singapore.

The project combines Mapbox GL JS, Three.js, OpenStreetMap-derived GeoJSON, and LTA DataMall data to visualise transport infrastructure, bus stops, bus routes, and simulated moving buses.

## Current Project Status

### Phase 1 — World and Map Rendering
- Mapbox GL JS map
- Street-style base map
- 3D Mapbox building extrusions
- Terrain and fog
- Three.js custom layer
- Clementi OpenStreetMap GeoJSON
- Road rendering
- Footpath rendering
- MRT railway and platform rendering
- MRT station rendering
- Crossing rendering
- Elevator rendering
- Landmark markers and labels

### Phase 2 — Public Transport Simulation
- LTA DataMall backend integration
- All Singapore bus stops downloaded with pagination
- Clementi bus stops filtered from LTA data
- 18 Clementi-area bus stops rendered
- Live Bus Arrival v3 integration
- Bus arrival popup on bus-stop click
- LTA Bus Routes integration
- 26,871 bus-route records retrieved
- 168 route records matched to Clementi bus stops
- Routes grouped by service number and direction
- OSM road network extracted
- 87 road LineStrings found
- Road graph built with 259 nodes
- Dijkstra shortest-path routing
- One-way road support
- 27 drawable road-following bus route groups
- Test moving bus animation
- Distance-based bus movement at a constant speed

## Project Goal

The goal is to build an accessibility-focused simulation of a small Singapore transport environment.

The simulator is intended to support the study of mobility challenges faced by wheelchair users, seniors, people with limited physical mobility, and caregivers.

Future simulation agents and analytics will help identify accessibility bottlenecks and test possible infrastructure improvements.

## Technology Stack

### Frontend
- Vite
- JavaScript
- Mapbox GL JS
- Three.js
- GeoJSON

### Backend
- Node.js
- Express
- Axios
- CORS
- dotenv

### Data
- LTA DataMall
- OpenStreetMap-derived GeoJSON
- Mapbox map and terrain data

## Project Structure

```text
AccessibilitySimulator/
├── src/
│   ├── data/
│   │   └── clementi.json
│   ├── layers/
│   │   └── threeLayer.js
│   ├── world/
│   │   ├── GeoJsonRenderer.js
│   │   ├── WorldRenderer.js
│   │   ├── landmarks.js
│   │   ├── routing/
│   │   │   └── RoadNetwork.js
│   │   └── renderers/
│   │       ├── RoadRenderer.js
│   │       ├── FootpathRenderer.js
│   │       ├── RailwayRenderer.js
│   │       ├── StationRenderer.js
│   │       ├── CrossingRenderer.js
│   │       ├── ElevatorRenderer.js
│   │       ├── BusStopRenderer.js
│   │       ├── BusRouteRenderer.js
│   │       ├── BusSimulationRenderer.js
│   │       └── LandmarkRenderer.js
│   └── map.js
├── server/
│   ├── routes/
│   │   ├── lta.js
│   │   └── busRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── .env
├── package.json
└── README.md
```

## Setup From the Start

### 1. Clone the Repository

```bash
git clone https://github.com/Nihamia/AccessibilitySimulator.git
cd AccessibilitySimulator
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Create the Frontend Environment File

Create a `.env` file in the project root:

```env
VITE_MAPBOX_TOKEN=YOUR_MAPBOX_ACCESS_TOKEN
```

Do not commit the `.env` file.

### 4. Install Backend Dependencies

```bash
cd server
npm install
```

### 5. Create the Backend Environment File

Create:

```text
server/.env
```

Add:

```env
LTA_API_KEY=YOUR_LTA_DATAMALL_ACCOUNT_KEY
```

Do not commit this file or expose the LTA account key publicly.

### 6. Start the Backend

From the `server` folder:

```bash
npm start
```

Expected output:

```text
Server running on http://localhost:3000
```

### 7. Start the Frontend

Open another terminal and run this from the project root:

```bash
npm run dev
```

Open the local Vite URL shown in the terminal.

## Running on Another Computer

After cloning or pulling the repository:

```bash
git pull
npm install
```

Start the frontend:

```bash
npm run dev
```

In a second terminal:

```bash
cd server
npm install
npm start
```

Remember to manually recreate:

```text
.env
server/.env
```

Environment files are intentionally not stored in GitHub.

## Backend API Endpoints

### Bus Stops

```text
GET http://localhost:3000/api/busStops
```

Downloads LTA bus-stop data using `$skip` pagination and filters stops to the Clementi simulation area.

Current result:

```text
18 bus stops
```

### Bus Arrival

```text
GET http://localhost:3000/api/busArrival/:busStopCode
```

Example:

```text
GET http://localhost:3000/api/busArrival/17179
```

Uses the LTA Bus Arrival v3 API.

The frontend displays live arrival estimates when a user clicks a bus-stop marker.

### Bus Routes

```text
GET http://localhost:3000/api/busRoutes
```

Downloads the LTA Bus Routes dataset using `$skip` pagination.

Current result:

```text
26,871 bus-route records
```

## Bus Route Processing

The current route pipeline is:

```text
LTA Bus Routes
      ↓
Match Clementi BusStopCode values
      ↓
Group by ServiceNo + Direction
      ↓
Sort by StopSequence
      ↓
Find nearest OSM road nodes
      ↓
Run Dijkstra shortest path
      ↓
Create road-following GeoJSON LineStrings
      ↓
Render bus routes in Mapbox
```

Current processing results:

```text
Clementi bus stops: 18
LTA bus-route records: 26,871
Clementi route records: 168
OSM road features: 87
Road graph nodes: 259
Drawable route lines: 27
```

## Road Network Routing

`RoadNetwork.js` currently:

- Extracts supported road types from `clementi.json`
- Converts road coordinates into graph nodes
- Connects neighbouring coordinates as weighted graph edges
- Calculates nearest road nodes for bus-stop coordinates
- Uses Dijkstra shortest-path routing
- Respects basic OSM `oneway` values

Currently supported road types:

```text
primary
primary_link
secondary
tertiary
residential
service
```

## Moving Bus Simulation

`BusSimulationRenderer.js` currently animates a test bus along the first successfully generated route.

Current test route:

```text
Service 105
Direction 1
```

The animation uses distance-based movement.

Example simulation speed:

```text
8 metres per second
≈ 28.8 km/h
```

## Current Limitations

The route geometry is generated from the local OSM road graph and LTA ordered bus stops. It is not yet an authoritative LTA route polyline.

Current limitations include:

- Road graph coverage is limited to the Clementi GeoJSON area
- Some route groups cannot find a complete directed road path
- One-way handling is basic
- Bus routes are not lane-level
- The moving bus is still a test visual marker
- Live LTA estimated bus coordinates are not yet connected to the moving-bus renderer
- Bus-stop dwell time is not simulated
- Traffic signals and congestion are not yet simulated

## Roadmap

### Phase 2
1. Real Bus Routes — In progress
2. Moving Buses — In progress
3. Pedestrian Agents
4. Wheelchair User Agents
5. Crossing Behaviour
6. Accessibility Scoring and Analytics

### Planned Bus Improvements

- Replace the bus marker with a 3D Three.js bus
- Use LTA Bus Arrival estimated bus coordinates
- Ignore invalid `0.0, 0.0` coordinates
- Use the LTA `Monitored` field
- Match live buses to route paths
- Add bus-stop dwell time
- Add service number labels
- Add WAB wheelchair-accessibility information
- Add bus occupancy/load information
- Support single-deck, double-deck, and bendy bus types
- Add periodic live-data refresh

### Planned Accessibility Simulation

- Pedestrian navigation
- Wheelchair route choices
- Crossing waiting behaviour
- Elevator usage
- Stair avoidance
- Accessible path preference
- Infrastructure bottleneck detection
- Accessibility scoring
- Scenario comparison and recommendations

## Security Notes

Never commit API keys.

The following should remain excluded from Git:

```text
.env
server/.env
node_modules/
server/node_modules/
```

If an API key is accidentally committed or publicly exposed, rotate or regenerate the key immediately.

## Git Workflow

Check changes:

```bash
git status
```

Stage everything:

```bash
git add .
```

Commit:

```bash
git commit -m "Add LTA bus routing and moving bus simulation"
```

Push:

```bash
git push
```

On another computer:

```bash
git pull
npm install
cd server
npm install
```

Then recreate the `.env` files if they do not exist.

## Repository

```text
https://github.com/Nihamia/AccessibilitySimulator
```
