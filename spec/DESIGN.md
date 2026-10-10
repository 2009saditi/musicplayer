# Design Specification

This document outlines the high-level architecture and design specifications for the single-file Streamify web application clone.

## 1. Single `index.html` File Structure

The entire application resides inside a single `index.html` file organized into three main functional sections:

```
index.html
├── <head>
│   └── <style> (Inline CSS Design System, Sidebar Layout, Thumbnail Overlays, Components)
└── <body>
    ├── Application Layout Containers
    │   ├── Left Sidebar
    │   │   ├── Brand Header (Streamify Logo + Text)
    │   │   ├── Navigation Menu (Home 🏠)
    │   │   ├── Practice Section ("PRACTICE — SPEC THESE NEXT" + "SPEC IT" pill badges)
    │   │   └── Session Build Section ("SESSION BUILD" + description text)
    │   └── Main Body Container
    │       ├── Header / Navigation (Search bar)
    │       ├── Main Content Area (Library grid)
    │       └── Player Bar Container (Controls, Now Playing, Progress, Volume)
    └── <script> (Vanilla JS Application Logic & State Management)
```

### Layout Components Hierarchy
- **Left Sidebar**:
  - *Brand Header*: Renders official Streamify Primary Green Logo image (`https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Streamify_Primary_Logo_RGB_Green.png`) alongside Streamify typography.
  - *Main Navigation*: Contains `🏠 Home` menu item.
  - *Practice Block*: Heading `PRACTICE — SPEC THESE NEXT`, followed by 4 rows: `❤️ Liked Songs view`, `🕒 Recently played`, `≡ Play queue`, and `🌓 Light / dark theme`, each paired with a right-aligned rounded `SPEC IT` pill badge button.
  - *Session Build Footer*: Heading `SESSION BUILD`, followed by the exact caption string: *"A spec-driven demo — one file, no backend. Everything you see was written down first."*
- **Main View Area & Track Cards**:
  - *Track Card Cover*: A rounded square cover thumbnail background (gradient/solid) displaying a large, bold centered track initial (e.g. "P" for Paper Planes).
  - *Top-Right Overlay Heart Icon*: A circular translucent dark button containing an outline heart SVG (`♡`) placed at the top-right corner inside the cover thumbnail. Clicking this circular overlay toggles liked status and updates `localStorage`.
- **Player Bar (Fixed Bottom)**:
  - *Track Meta Section*: Displays current active track artwork, title, artist, and heart icon.
  - *Playback Controls Section*: Previous button, Play/Pause toggle button, Next button.
  - *Progress Section*: Current playback time label, interactive range input seek bar, total duration label.
  - *Volume Section*: Volume icon and interactive range input slider.
- **Hidden Audio Engine**: HTML5 `<audio>` element managed programmatically via Vanilla JS.

---

## 2. Track Object Data Structure

Track data will be declared as a hardcoded array of objects inside the `<script>` tag of `index.html`.

### Track Object Schema
```json
{
  "id": "String (Unique identifier, e.g., 'track-1')",
  "title": "String (Name of the song)",
  "artist": "String (Name of the artist/band)",
  "album": "String (Album name)",
  "duration": "Number (Duration in seconds)",
  "coverUrl": "String (Image URL or inline SVG / data URI)",
  "audioUrl": "String (Direct audio source file URL)"
}
```

### Data Collection Data Flow
```
[TRACKS.md Source Data] ──► Hardcoded JavaScript Array ──► Rendered to Library Grid Cards
```

---

## 3. Liked State Persistence Architecture

Track liking and persistence are managed purely via Browser `localStorage` using simple JSON serialization.

### Data Storage Key
- **Storage Key**: `Streamify_liked_tracks`
- **Data Format**: JSON string representation of an Array of Track IDs (e.g., `["track-1", "track-4"]`).

### Read / Write Lifecycle

1. **Initialization / Restoration**:
   - On application startup, read `localStorage.getItem('Streamify_liked_tracks')`.
   - Parse the JSON string into an in-memory `Set` of liked track IDs (`likedTrackIds`).
   - If key does not exist or parsing fails, initialize `likedTrackIds` as an empty `Set`.
   - Apply active/liked UI state (filled/outline heart inside thumbnail top-right overlay and player bar) during DOM rendering.

2. **Toggle / Mutation**:
   - When a user clicks the top-right overlay heart circle on a track thumbnail cover or player bar heart button:
     - Check if `trackId` is present in `likedTrackIds`.
     - If present, remove `trackId`; if absent, add `trackId`.
     - Serialize `Array.from(likedTrackIds)` to JSON using `JSON.stringify()`.
     - Write the serialized string back to `localStorage.setItem('Streamify_liked_tracks', jsonString)`.
     - Re-render/update affected heart icons in the DOM immediately.

---

## 4. Improvements Design

- **Sidebar Visual Layout**: Added left navigation sidebar featuring the green Streamify logo, `🏠 Home` link, a `PRACTICE — SPEC THESE NEXT` section with `SPEC IT` pill badges, and a `SESSION BUILD` summary block matching the screenshot design.
- **Top-Right Thumbnail Overlay Heart Button**: Track cover thumbnails present a bold centered initial with a top-right translucent circular heart button for toggling liked status directly on the cover art matching the screenshot design.
