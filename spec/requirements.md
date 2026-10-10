# Requirements Specification

This document defines the functional requirements for the Streamify web application clone using the Easy Approach to Requirements Syntax (EARS) pattern: **WHEN <trigger> THE SYSTEM SHALL <behaviour>**.

## Functional Requirements
1. **REQ-1**: WHEN the application is loaded, THE SYSTEM SHALL display a library grid rendering all tracks from `TRACKS.md`.
2. **REQ-2**: WHEN a user clicks a track in the library grid, THE SYSTEM SHALL start playback of the selected track and update the player bar.
3. **REQ-3**: WHEN a user clicks the play/pause button while audio is playing, THE SYSTEM SHALL pause audio playback.
4. **REQ-4**: WHEN a user clicks the play/pause button while audio is paused, THE SYSTEM SHALL resume audio playback.
5. **REQ-5**: WHEN a user clicks the next track button, THE SYSTEM SHALL play the next sequential track in the current playlist or grid.
6. **REQ-6**: WHEN a user clicks the previous track button, THE SYSTEM SHALL play the previous sequential track in the current playlist or grid.
7. **REQ-7**: WHEN a track is actively playing, THE SYSTEM SHALL dynamically update the seek bar and current playback time indicator.
8. **REQ-8**: WHEN a user adjusts the seek bar, THE SYSTEM SHALL update the track's current playback timestamp to the selected position.
9. **REQ-9**: WHEN a user adjusts the volume control, THE SYSTEM SHALL modify the playback volume level accordingly.
10. **REQ-10**: WHEN a user inputs text into the search bar, THE SYSTEM SHALL filter the library grid to display only tracks whose title or artist matches the query.
11. **REQ-11**: WHEN a user clicks the like button for a track, THE SYSTEM SHALL toggle the liked status of the track and save the updated state to `localStorage`.
12. **REQ-12**: WHEN the application is loaded or reloaded, THE SYSTEM SHALL retrieve liked track statuses from `localStorage` and display them accordingly.
13. **REQ-13**: WHEN the currently playing track reaches its end, THE SYSTEM SHALL automatically begin playback of the next track.

## Improvements
14. **REQ-14**: WHEN the application is rendered, THE SYSTEM SHALL display a left navigation sidebar containing:
    - Streamify Primary Logo with text (`https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Streamify_Primary_Logo_RGB_Green.png`).
    - A "Home" option with a house emoji/icon (`🏠`).
    - A "PRACTICE — SPEC THESE NEXT" section listing items ("❤️ Liked Songs view", "🕒 Recently played", "≡ Play queue", "🌓 Light / dark theme"), each accompanied by a "SPEC IT" pill badge.
    - A "SESSION BUILD" section with description text: *"A spec-driven demo — one file, no backend. Everything you see was written down first."*
15. **REQ-15**: WHEN a track card is rendered in the library grid, THE SYSTEM SHALL display a rounded cover thumbnail featuring the song's initial letter prominently in the center, and a translucent circular heart icon button overlaid at the top-right corner of the thumbnail that toggles the track's liked status upon click.
