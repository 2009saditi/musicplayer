/* RESONATE - Bottom Player UI Component */
import { player } from '../player.js';
import { store } from '../store.js';
import { openSongDetailsModal } from './modals.js';
import { showToast } from './toast.js';

// SVGs for Player Controls
const SVGS = {
    play: `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>`,
    pause: `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
    prev: `<svg viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>`,
    next: `<svg viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>`,
    shuffle: `<svg viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>`,
    repeat: `<svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
    heart: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    lyrics: `<svg viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
    queue: `<svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
    volumeHigh: `<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
    volumeLow: `<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
    volumeMute: `<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
};

export function renderBottomPlayer() {
    const container = document.getElementById('bottom-player-container');
    if (!container) return;

    const track = player.getPlayingTrack();
    const isLiked = track ? store.isLiked(track.id) : false;
    const statusText = player.isLoading ? 'Loading...' : (player.isPlaying ? 'Playing' : 'Paused');

    // Build HTML skeleton
    container.innerHTML = `
        <!-- Now Playing Track Info -->
        <div class="player-meta-section">
            ${track ? `
                <img src="${track.coverUrl}" alt="${track.title}" class="player-artwork player-details-trigger">
                <div class="player-track-info">
                    <span class="player-title player-details-trigger">${track.title}</span>
                    <span class="player-artist">${track.artist}</span>
                    <span class="player-status">${statusText}</span>
                </div>
                <button class="btn-player-like btn-like-trigger ${isLiked ? 'liked' : ''}">
                    ${SVGS.heart}
                </button>
            ` : `
                <div style="width: 56px; height: 56px; border-radius: var(--radius-sm); background-color: var(--bg-card); border: 1px solid var(--border-color);"></div>
                <div class="player-track-info">
                    <span class="player-title" style="color: var(--text-secondary); cursor: default;">No track selected</span>
                    <span class="player-artist">-</span>
                </div>
            `}
        </div>

        <!-- Central Playback Controls & Timeline -->
        <div class="player-controls-section">
            <div class="control-buttons">
                <button class="btn-control-secondary btn-shuffle-trigger ${player.shuffle ? 'active' : ''}" title="Shuffle">
                    ${SVGS.shuffle}
                </button>
                <button class="btn-control-secondary btn-prev-trigger" title="Previous">
                    ${SVGS.prev}
                </button>
                <button class="btn-play-pause btn-play-trigger" title="${player.isPlaying ? 'Pause' : 'Play'}">
                    ${player.isPlaying ? SVGS.pause : SVGS.play}
                </button>
                <button class="btn-control-secondary btn-next-trigger" title="Next">
                    ${SVGS.next}
                </button>
                <button class="btn-control-secondary btn-repeat-trigger ${player.repeat !== 'none' ? 'active' : ''}" title="Repeat mode: ${player.repeat}">
                    ${SVGS.repeat}
                    ${player.repeat === 'track' ? '<span style="position: absolute; font-size: 7px; font-weight: 900; background: var(--accent-teal); color: #000; padding: 1px 3px; border-radius: 4px; top: 1px; right: -2px;">1</span>' : ''}
                </button>
            </div>
            
            <div class="progress-timeline">
                <span class="time-label current">0:00</span>
                <div class="slider-wrapper">
                    <input type="range" class="range-input timeline-slider" min="0" max="100" value="0" step="0.1">
                </div>
                <span class="time-label duration">0:00</span>
            </div>
        </div>

        <!-- Right extra features (lyrics, queue, volume) -->
        <div class="player-extra-section">
            <button class="btn-extra btn-lyrics-trigger" title="Lyrics">
                ${SVGS.lyrics}
            </button>
            <button class="btn-extra btn-queue-trigger ${store.currentView === 'queue' ? 'active' : ''}" title="Queue">
                ${SVGS.queue}
            </button>
            
            <div class="volume-control-wrapper">
                <button class="btn-control-secondary btn-volume-toggle" style="width:24px; height:24px;">
                    ${getVolumeIcon(player.volume)}
                </button>
                <div class="slider-wrapper">
                    <input type="range" class="range-input volume-slider" min="0" max="1" value="${player.volume}" step="0.01">
                </div>
            </div>
        </div>
    `;

    // BIND INTERACTIVE EVENTS
    bindPlayerEvents(container, track);
}

function bindPlayerEvents(container, track) {
    // Play/Pause Trigger
    container.querySelector('.btn-play-trigger').addEventListener('click', () => {
        player.togglePlay();
    });

    // Prev/Next Triggers
    container.querySelector('.btn-prev-trigger').addEventListener('click', () => player.previous());
    container.querySelector('.btn-next-trigger').addEventListener('click', () => player.next());

    // Shuffle Trigger
    container.querySelector('.btn-shuffle-trigger').addEventListener('click', () => {
        player.toggleShuffle();
        showToast(player.shuffle ? 'Shuffle enabled' : 'Shuffle disabled');
    });

    // Repeat Trigger
    container.querySelector('.btn-repeat-trigger').addEventListener('click', () => {
        player.toggleRepeat();
        showToast(`Repeat mode: ${player.repeat}`);
    });

    // Like Trigger (if track exists)
    if (track) {
        const likeBtn = container.querySelector('.btn-like-trigger');
        likeBtn.addEventListener('click', () => {
            store.toggleLike(track.id);
            const isLiked = store.isLiked(track.id);
            if (isLiked) {
                likeBtn.classList.add('liked');
                showToast(`Added to Liked Songs`);
            } else {
                likeBtn.classList.remove('liked');
                showToast(`Removed from Liked Songs`);
            }
        });

        // Click track cover/title opens details
        const detailTriggers = container.querySelectorAll('.player-details-trigger');
        detailTriggers.forEach(el => {
            el.addEventListener('click', () => {
                openSongDetailsModal(track.id);
            });
        });
    }

    // Lyrics Action
    container.querySelector('.btn-lyrics-trigger').addEventListener('click', () => {
        showToast('Lyrics are syncing... (not available for offline/demo tracks)');
    });

    // View Queue Action
    container.querySelector('.btn-queue-trigger').addEventListener('click', () => {
        if (store.currentView === 'queue') {
            store.setView('home');
        } else {
            store.setView('queue');
        }
    });

    // Timeline Drag / Seek Scrubbing
    const timeline = container.querySelector('.timeline-slider');
    const timeCurrent = container.querySelector('.time-label.current');
    const timeDuration = container.querySelector('.time-label.duration');
    
    // Set initial duration label
    if (track) {
        timeDuration.innerText = formatTime(player.getDuration());
    }

    let isUserDraggingTimeline = false;

    timeline.addEventListener('input', () => {
        isUserDraggingTimeline = true;
        // Update stamp while dragging
        const targetSec = (timeline.value / 100) * player.getDuration();
        timeCurrent.innerText = formatTime(targetSec);
    });

    timeline.addEventListener('change', () => {
        const targetSec = (timeline.value / 100) * player.getDuration();
        player.seek(targetSec);
        isUserDraggingTimeline = false;
    });

    // Volume Adjustment
    const volumeSlider = container.querySelector('.volume-slider');
    const volumeToggle = container.querySelector('.btn-volume-toggle');
    let preMutedVolume = 0.8;

    volumeSlider.addEventListener('input', () => {
        const vol = parseFloat(volumeSlider.value);
        player.setVolume(vol);
    });

    volumeToggle.addEventListener('click', () => {
        if (player.volume > 0) {
            preMutedVolume = player.volume;
            player.setVolume(0);
        } else {
            player.setVolume(preMutedVolume);
        }
    });

    // ----------------------------------------------------
    // PLAYER EVENT INTEGRATIONS
    // ----------------------------------------------------
    player.subscribe((p, event) => {
        if (!container.isConnected) return; // avoid updating unrendered component

        const pTrack = p.getPlayingTrack();
        
        // Handle timeline updates
        if (event.type === 'timeupdate' && !isUserDraggingTimeline) {
            const cur = p.getCurrentTime();
            const dur = p.getDuration();
            timeCurrent.innerText = formatTime(cur);
            if (dur > 0) {
                timeline.value = (cur / dur) * 100;
            }
        }
        // Handle duration metadata loads
        else if (event.type === 'durationchange') {
            timeDuration.innerText = formatTime(event.duration);
        }
        // Handle general playback play/pause state change
        else if (!event.type || event.type === 'trackchange' || event.type === 'loading' || event.type === 'playing' || event.type === 'pause') {
            const playPauseBtn = container.querySelector('.btn-play-trigger');
            const statusEl = container.querySelector('.player-status');
            if (p.isLoading) {
                if (statusEl) statusEl.textContent = 'Loading...';
                if (playPauseBtn) {
                    playPauseBtn.innerHTML = SVGS.pause;
                    playPauseBtn.title = 'Loading...';
                }
            } else if (p.isPlaying) {
                if (statusEl) statusEl.textContent = 'Playing';
                if (playPauseBtn) {
                    playPauseBtn.innerHTML = SVGS.pause;
                    playPauseBtn.title = 'Pause';
                }
            } else {
                if (statusEl) statusEl.textContent = 'Paused';
                if (playPauseBtn) {
                    playPauseBtn.innerHTML = SVGS.play;
                    playPauseBtn.title = 'Play';
                }
            }
            
            // Sync volume slider and icon
            volumeSlider.value = p.volume;
            volumeToggle.innerHTML = getVolumeIcon(p.volume);

            if (event.type === 'trackchange') {
                renderBottomPlayer();
            }
        }
    });
}

function getVolumeIcon(volume) {
    if (volume === 0) return SVGS.volumeMute;
    if (volume < 0.5) return SVGS.volumeLow;
    return SVGS.volumeHigh;
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// Auto re-render bottomPlayer if store updates (essential for queue tabs/likes highlights)
store.subscribe(() => {
    renderBottomPlayer();
});
export default renderBottomPlayer;
