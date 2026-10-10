# TRACKS.md

The library for this session. Six tracks. Titles, artists, and durations below.

Audio sources use the SoundHelix sample MP3s (the doc's offline fallback): they
stream cross-origin reliably, so `index.html` plays out of the box even without
local files. To go fully offline, drop `track-01.mp3` … `track-06.mp3` into
`./assets/audio/` and swap the `src` values in the hardcoded array to the local
paths. Cover art lives at `./assets/covers/`; if a cover file is missing the app
falls back to a generated gradient, so nothing breaks visually.

| # | Title            | Artist         | Audio file / URL                                             | Cover file    | Duration |
|---|------------------|----------------|--------------------------------------------------------------|---------------|----------|
| 1 | Midnight Signal  | The Nocturnes  | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3 | cover-01.jpg  | 6:13     |
| 2 | Paper Planes     | Kite Season    | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3 | cover-02.jpg  | 6:07     |
| 3 | Neon Harbor      | Violet Static  | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3 | cover-03.jpg  | 6:20     |
| 4 | Slow Tide        | Marlow Bay     | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3 | cover-04.jpg  | 6:32     |
| 5 | Copper Sky       | Ada & the Owls | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3 | cover-05.jpg  | 6:55     |
| 6 | Little Machines  | Foxglove       | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3 | cover-06.jpg  | 4:59     |

Durations are the SoundHelix clip lengths; the player shows the true length once
audio metadata loads, so the table is only a hint for the spec.
