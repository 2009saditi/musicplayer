# Task Breakdown Specification

This document breaks down the implementation of the single-file Streamify web application into exactly 3 sequential phases plus an Improvements phase.

---

## Phase 1: Core Layout, Visual Design & Track Data Rendering
Focuses on establishing the single `index.html` structure, inline CSS design system, hardcoding track data, rendering the visible library grid, and static player bar layout.
- [ ] **Task 1.1**: Create `index.html` structure with `<head>`, `<style>`, HTML container sections (header, grid, player bar), and `<script>` tag.
- [ ] **Task 1.2**: Implement inline CSS dark mode styling, layout grids, typography, hover effects, and responsive player bar container.
- [ ] **Task 1.3**: Embed hardcoded track array data inside the `<script>` block.
- [ ] **Task 1.4**: Render the visible library grid dynamically using the hardcoded track data [Implements: REQ-1].
- [ ] **Task 1.5**: Render static placeholder player bar controls with artwork, title, artist, play/pause icon, seek bar, time labels, and volume slider [Implements: REQ-7, REQ-9].

**Phase 1 Verification**: Open `index.html` in browser preview; verify that a styled Streamify-themed interface displays the full library grid of tracks and a fixed bottom player bar layout.

---

## Phase 2: Audio Playback Engine & Interactive Controls
Focuses on core audio playback logic, HTML5 audio integration, playback controls, dynamic seek bar updates, and sequential track navigation.
- [ ] **Task 2.1**: Implement HTML5 `<audio>` engine and bind track card click handlers to load track audio and trigger playback [Implements: REQ-2].
- [ ] **Task 2.2**: Implement Play/Pause toggle functionality on player bar control [Implements: REQ-3, REQ-4].
- [ ] **Task 2.3**: Implement Next and Previous track navigation controls [Implements: REQ-5, REQ-6].
- [ ] **Task 2.4**: Implement real-time seek bar and timestamp updates during audio playback [Implements: REQ-7].
- [ ] **Task 2.5**: Implement manual seek bar scrubbing functionality to update current playback timestamp [Implements: REQ-8].
- [ ] **Task 2.6**: Implement volume slider control to adjust audio gain level dynamically [Implements: REQ-9].
- [ ] **Task 2.7**: Implement audio `ended` event listener to trigger auto-playing the next track upon completion [Implements: REQ-13].

**Phase 2 Verification**: Open `index.html` in browser preview; click a track to initiate audio playback, test play/pause, scrub the seek bar, change volume, navigate next/prev, and verify automatic progression to the next track when audio ends.

---

## Phase 3: Search Filtering & Liked State Persistence
Focuses on search capability and saving/restoring liked track statuses to `localStorage`.
- [ ] **Task 3.1**: Implement live search filtering on the search input field to dynamically filter displayed library grid tracks by title or artist [Implements: REQ-10].
- [ ] **Task 3.2**: Implement track like/heart button click handler to toggle liked state and save updated track ID list to `localStorage` [Implements: REQ-11].
- [ ] **Task 3.3**: Implement initialization logic on page load to restore liked track state from `localStorage` and render heart indicators [Implements: REQ-12].

**Phase 3 Verification**: Open `index.html` in browser preview; type into the search bar to verify grid filtering, click heart buttons to like/unlike tracks, and reload the page to verify that liked states persist across refreshes.

---

## Improvements
Focuses on layout enhancement (sidebar matching user screenshot) and thumbnail styling with top-right overlay heart button.
- [ ] **Task 4.1**: Implement left sidebar containing Streamify logo, Home menu item, `PRACTICE — SPEC THESE NEXT` section with `SPEC IT` pill badges, and `SESSION BUILD` summary block [Implements: REQ-14].
- [ ] **Task 4.2**: Render track cover thumbnails with bold centered track initials and a top-right translucent circular heart overlay button that toggles liked status and persists to `localStorage` [Implements: REQ-15].

**Improvements Verification**: Open `index.html` in browser preview; verify that the sidebar matches the design with Streamify logo, Home item, Practice section with badges, and Session Build text, and verify track cards present centered initials with top-right overlay heart buttons.
