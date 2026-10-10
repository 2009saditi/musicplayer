/* RESONATE - View Renderers & Component Collections */
import { store } from '../store.js';
import { player } from '../player.js';
import { getTrackBlob, saveTrackBlob } from '../database.js';
import { openSongDetailsModal, openMetadataEditorModal, openPlaylistSelectorModal } from './modals.js';
import { showToast } from './toast.js';
import { parseID3Tags } from '../utils/id3.js';

// SVG Icons
const SVGS = {
    play: `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>`,
    pause: `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
    heart: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    menu: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>`,
    music: `<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
    trash: `<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    edit: `<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    download: `<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    queue: `<svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg>`,
    arrowUp: `<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>`,
    arrowDown: `<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    folder: `<svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
    artist: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
};

// Main renderer entry
export function renderActiveView() {
    const container = document.getElementById('view-container');
    if (!container) return;

    // Reset view container scroll
    container.scrollTop = 0;

    const view = store.currentView;
    const param = store.currentViewParam;

    switch (view) {
        case 'home':
            renderHomeView(container);
            break;
        case 'search':
            renderSearchView(container);
            break;
        case 'liked-songs':
            renderLikedSongsView(container);
            break;
        case 'recently-played':
            renderRecentlyPlayedView(container);
            break;
        case 'queue':
            renderQueueView(container);
            break;
        case 'uploaded-songs':
            renderUploadedSongsView(container);
            break;
        case 'downloads':
            renderDownloadsView(container);
            break;
        case 'playlists':
            renderPlaylistsView(container);
            break;
        case 'playlist':
            renderSinglePlaylistView(container, param);
            break;
        case 'albums':
            renderAlbumsView(container);
            break;
        case 'album':
            renderSingleAlbumView(container, param);
            break;
        case 'artists':
            renderArtistsView(container);
            break;
        case 'artist':
            renderSingleArtistView(container, param);
            break;
        default:
            renderHomeView(container);
    }
}

// ----------------------------------------------------
// 1. HOME VIEW RENDERER
// ----------------------------------------------------
function renderHomeView(container) {
    const allSongs = store.getAllSongs();
    const featured = store.getCurrentTrack() || allSongs[0] || null;
    const isFeaturedLiked = featured ? store.isLiked(featured.id) : false;

    // Filter tracks by mood / genre selected in filter bar
    let filteredSongs = allSongs;
    if (store.activeGenre !== 'All') {
        filteredSongs = allSongs.filter(s => s.genre && s.genre.toLowerCase() === store.activeGenre.toLowerCase());
    }

    const recentlyPlayedSongs = store.getRecentlyPlayed().slice(0, 6);
    const recommendedSongs = allSongs.slice().reverse().slice(0, 6); // reverse for recommendations

    let html = `
        <div class="view-title-row">
            <div>
                <h1 class="view-title">Listen Now</h1>
                <p class="view-subtitle">Welcome to Streamify — Your Personal Music Sanctuary</p>
            </div>
            <div class="stats-badge">Library: <span>${allSongs.length} Tracks</span></div>
        </div>
    `;

    // 1.1 Featured Track Spot
    if (featured) {
        html += `
            <div class="featured-track-container">
                <img src="${featured.coverUrl}" alt="${featured.title}" class="featured-artwork">
                <div class="featured-details">
                    <span class="featured-badge">Featured Track</span>
                    <h2 class="featured-title">${featured.title}</h2>
                    <p class="featured-artist">${featured.artist}</p>
                    <div class="featured-actions">
                        <button class="btn-primary btn-featured-play" data-song-id="${featured.id}">
                            ${SVGS.play} Play
                        </button>
                        <button class="btn-featured-icon btn-featured-like ${isFeaturedLiked ? 'liked' : ''}" data-song-id="${featured.id}" title="Like">
                            ${SVGS.heart}
                        </button>
                        <button class="btn-featured-icon btn-featured-details" data-song-id="${featured.id}" title="Details">
                            ${SVGS.menu}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // 1.2 Mood / Genre selection filter chips
    const genres = ['All', 'Chill', 'Electronic', 'Indie', 'Night'];
    html += `
        <div class="genre-bar">
            ${genres.map(g => `
                <button class="genre-chip ${store.activeGenre === g ? 'active' : ''}" data-genre="${g}">${g}</button>
            `).join('')}
        </div>
    `;

    // 1.3 Display tracks grid
    html += `
        <h2 class="tracks-section-header">Your Tracks</h2>
        ${filteredSongs.length > 0 ? renderTrackGrid(filteredSongs) : renderEmptyLibraryState()}
    `;

    // 1.4 Recently played section (conditional on activity)
    if (recentlyPlayedSongs.length > 0) {
        html += `
            <h2 class="tracks-section-header" style="margin-top: 32px;">Recently Played</h2>
            ${renderTrackGrid(recentlyPlayedSongs)}
        `;
    }

    // 1.5 Recommended section
    html += `
        <h2 class="tracks-section-header" style="margin-top: 32px;">Recommended Music</h2>
        ${renderTrackGrid(recommendedSongs)}
    `;

    container.innerHTML = html;

    // BIND EVENT LISTENERS
    container.querySelector('.genre-bar').addEventListener('click', (e) => {
        const chip = e.target.closest('.genre-chip');
        if (chip) {
            store.activeGenre = chip.getAttribute('data-genre');
            store.setView('home'); // trigger re-render
        }
    });

    if (featured) {
        container.querySelector('.btn-featured-play').addEventListener('click', () => {
            player.playSong(featured.id);
        });

        container.querySelector('.btn-featured-like').addEventListener('click', () => {
            store.toggleLike(featured.id);
            store.setView('home');
        });

        container.querySelector('.btn-featured-details').addEventListener('click', () => {
            openSongDetailsModal(featured.id);
        });
    }

    bindGridPlayAndActions(container);
}

// ----------------------------------------------------
// 2. SEARCH VIEW RENDERER
// ----------------------------------------------------
function renderSearchView(container) {
    const allSongs = store.getAllSongs();
    const query = (document.getElementById('global-search-input')?.value || '').trim().toLowerCase();
    
    let html = `
        <h1 class="view-title">Search</h1>
        <p class="view-subtitle" style="margin-bottom: 24px;">Find your favorite tracks, artists, albums, or playlists</p>
    `;

    if (!query) {
        // Show Search Suggestions & Recent Searches
        html += `
            <div style="margin-bottom: 30px;">
                <h3 class="tracks-section-header" style="font-size: 15px; color: var(--text-secondary); margin-bottom: 12px;">Suggested Genres</h3>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="genre-chip search-suggest-btn" data-term="Electronic">Electronic</button>
                    <button class="genre-chip search-suggest-btn" data-term="Chill">Chill</button>
                    <button class="genre-chip search-suggest-btn" data-term="Indie">Indie</button>
                    <button class="genre-chip search-suggest-btn" data-term="Night">Night</button>
                </div>
            </div>
        `;

        if (store.searchHistory.length > 0) {
            html += `
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                        <h3 class="tracks-section-header" style="font-size: 15px; color: var(--text-secondary); margin-bottom: 0;">Recent Searches</h3>
                        <button class="btn-secondary btn-clear-history-search" style="font-size:12px; padding: 4px 10px; border-radius:var(--radius-sm)">Clear History</button>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        ${store.searchHistory.map(term => `
                            <div class="search-history-row" style="display:flex; justify-content:space-between; align-items:center; padding: 10px 14px; border-radius: var(--radius-md); background: rgba(255,255,255,0.01);" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='rgba(255,255,255,0.01)'">
                                <button class="search-term-btn" data-term="${term}" style="font-weight: 500; font-size:14px; color:var(--text-primary); text-align:left; flex: 1;">🔍 ${term}</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    } else {
        // Filter by Query across title, artist, album, genre
        const matches = allSongs.filter(s => 
            s.title.toLowerCase().includes(query) ||
            s.artist.toLowerCase().includes(query) ||
            (s.album && s.album.toLowerCase().includes(query)) ||
            (s.genre && s.genre.toLowerCase().includes(query))
        );

        // Filter Playlists matching query
        const matchPlaylists = store.getPlaylists().filter(p => p.name.toLowerCase().includes(query));

        if (matches.length === 0 && matchPlaylists.length === 0) {
            html += `
                <div class="empty-state-wrapper">
                    <div class="empty-state-icon">🔍</div>
                    <div class="empty-state-title">No results found</div>
                    <div class="empty-state-subtitle">Make sure spelling is correct or check other criteria.</div>
                </div>
            `;
        } else {
            if (matches.length > 0) {
                html += `
                    <h2 class="tracks-section-header">Matching Songs</h2>
                    ${renderTrackGrid(matches)}
                `;
            }

            if (matchPlaylists.length > 0) {
                html += `
                    <h2 class="tracks-section-header" style="margin-top: 32px;">Playlists</h2>
                    <div class="tracks-grid">
                        ${matchPlaylists.map(p => `
                            <div class="track-card search-playlist-card" data-playlist-id="${p.id}">
                                <div class="card-artwork-wrapper">
                                    <img src="${p.coverUrl}" class="card-artwork" alt="${p.name}">
                                </div>
                                <div class="card-title">${p.name}</div>
                                <div class="card-subtitle">Playlist • ${p.trackIds.length} Songs</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }
    }

    container.innerHTML = html;

    // BIND SEARCH ACTIONS
    const searchInput = document.getElementById('global-search-input');
    
    // Bind search suggestion clicks
    container.querySelectorAll('.search-suggest-btn, .search-term-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const term = btn.getAttribute('data-term');
            if (searchInput) {
                searchInput.value = term;
                // Save search history
                store.addSearchTerm(term);
                store.setView('search');
            }
        });
    });

    // Clear search history
    const clearHistoryBtn = container.querySelector('.btn-clear-history-search');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            store.clearSearchHistory();
            store.setView('search');
        });
    }

    // Bind playlist click
    container.querySelectorAll('.search-playlist-card').forEach(card => {
        card.addEventListener('click', () => {
            const pid = card.getAttribute('data-playlist-id');
            store.setView('playlist', pid);
        });
    });

    bindGridPlayAndActions(container);
}

// ----------------------------------------------------
// 3. LIKED SONGS VIEW RENDERER
// ----------------------------------------------------
function renderLikedSongsView(container) {
    const liked = store.getLikedSongs();
    
    let html = `
        <div style="display: flex; gap: 32px; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap;">
            <div style="width: 180px; height: 180px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #1d976c 0%, #93f9b9 100%); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-lg); font-size: 80px; flex-shrink:0;">❤️</div>
            <div style="flex:1;">
                <span class="featured-badge" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #fff;">Playlist</span>
                <h1 class="view-title" style="font-size: 48px; margin: 6px 0;">Liked Songs</h1>
                <p class="view-subtitle">${liked.length} track${liked.length !== 1 ? 's' : ''} in your liked library</p>
            </div>
        </div>
    `;

    if (liked.length === 0) {
        html += `
            <div class="empty-state-wrapper">
                <div class="empty-state-icon">❤️</div>
                <div class="empty-state-title">You haven't liked any songs yet.</div>
                <div class="empty-state-subtitle">Heart songs while exploring the library to collect them here.</div>
            </div>
        `;
        container.innerHTML = html;
        return;
    }

    html += `
        <div style="display:flex; gap:16px; align-items:center; margin-bottom: 24px;">
            <button class="btn-primary btn-play-all-liked" style="gap:8px;">
                ${SVGS.play} Play All
            </button>
            <button class="btn-secondary btn-shuffle-liked" style="gap:8px;">
                ${SVGS.shuffle} Shuffle Play
            </button>
        </div>

        ${renderTrackTable(liked)}
    `;

    container.innerHTML = html;

    // EVENT LISTENERS
    container.querySelector('.btn-play-all-liked').addEventListener('click', () => {
        store.setQueue(liked, 0);
        player.playSong(liked[0].id);
    });

    container.querySelector('.btn-shuffle-liked').addEventListener('click', () => {
        // Toggle shuffle
        if (!player.shuffle) player.toggleShuffle();
        store.setQueue(liked, 0);
        // Play random song
        const randIdx = Math.floor(Math.random() * liked.length);
        player.playSong(liked[randIdx].id);
    });

    bindTablePlayAndActions(container, liked);
}

// ----------------------------------------------------
// 4. RECENTLY PLAYED VIEW RENDERER
// ----------------------------------------------------
function renderRecentlyPlayedView(container) {
    const recents = store.getRecentlyPlayed();

    let html = `
        <div class="view-title-row">
            <div>
                <h1 class="view-title">Recently Played</h1>
                <p class="view-subtitle">Your playback history</p>
            </div>
            ${recents.length > 0 ? `
                <button class="btn-danger btn-clear-history" style="font-size: 13px;">Clear History</button>
            ` : ''}
        </div>
    `;

    if (recents.length === 0) {
        html += `
            <div class="empty-state-wrapper">
                <div class="empty-state-icon">🕒</div>
                <div class="empty-state-title">Your playback history is empty</div>
                <div class="empty-state-subtitle">Play audio tracks, and they will automatically show up here.</div>
            </div>
        `;
        container.innerHTML = html;
        return;
    }

    // Display with a specific custom column for last played time
    html += `
        <div class="track-list-table">
            <div class="track-list-header" style="grid-template-columns: 48px 1fr 1fr 1.5fr 48px;">
                <div class="col-index">#</div>
                <div>Title</div>
                <div>Artist</div>
                <div>Last Played</div>
                <div style="text-align:center;">Action</div>
            </div>
            ${recents.map((song, i) => {
                const isPlaying = player.isPlaying && player.getPlayingTrack()?.id === song.id;
                const timeStr = formatRelativeTime(song.playedAt);
                return `
                    <div class="track-list-row ${isPlaying ? 'active' : ''}" data-song-id="${song.id}" style="grid-template-columns: 48px 1fr 1fr 1.5fr 48px;">
                        <div class="col-index">
                            ${isPlaying ? `
                                <div style="color:var(--accent-teal); font-weight:bold;">▶</div>
                            ` : i + 1}
                        </div>
                        <div class="col-meta">
                            <img src="${song.coverUrl}" class="list-artwork" alt="${song.title}">
                            <div class="col-title">${song.title}</div>
                        </div>
                        <div class="col-artist">${song.artist}</div>
                        <div style="font-size: 13px; color: var(--text-secondary);">${timeStr}</div>
                        <div class="col-actions">
                            <button class="btn-list-action btn-row-options-trigger" data-song-id="${song.id}">
                                ${SVGS.menu}
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    container.innerHTML = html;

    // EVENT LISTENERS
    container.querySelector('.btn-clear-history')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your playback history?')) {
            store.clearHistory();
            store.setView('recently-played');
        }
    });

    bindTablePlayAndActions(container, recents);
}

// ----------------------------------------------------
// 5. QUEUE VIEW RENDERER
// ----------------------------------------------------
function renderQueueView(container) {
    const queueIds = store.queue;
    const activeIdx = store.queueIndex;
    
    // Resolve songs from queue IDs
    const resolvedQueue = queueIds.map(id => store.getSongById(id)).filter(Boolean);
    const nowPlaying = resolvedQueue[activeIdx];
    const nextUp = resolvedQueue.slice(activeIdx + 1);

    let html = `
        <div class="view-title-row">
            <div>
                <h1 class="view-title">Play Queue</h1>
                <p class="view-subtitle">Manage track order and playback sequence</p>
            </div>
            ${resolvedQueue.length > 1 ? `
                <button class="btn-secondary btn-clear-queue" style="font-size: 13px; border-color: var(--border-color);">Clear Queue</button>
            ` : ''}
        </div>
    `;

    if (!nowPlaying) {
        html += `
            <div class="empty-state-wrapper">
                <div class="empty-state-icon">≡</div>
                <div class="empty-state-title">Your queue is empty.</div>
                <div class="empty-state-subtitle">Go to library and play a song to initialize queue.</div>
            </div>
        `;
        container.innerHTML = html;
        return;
    }

    // Now Playing Spotlight
    html += `
        <h3 class="tracks-section-header" style="font-size:15px; color:var(--text-secondary); margin-bottom: 12px;">Now Playing</h3>
        <div class="track-list-row active" data-song-id="${nowPlaying.id}" style="grid-template-columns: 48px 1fr 1fr 48px; border:1px solid rgba(0, 245, 212, 0.15); margin-bottom: 24px; padding: 14px 16px;">
            <div class="col-index">▶</div>
            <div class="col-meta">
                <img src="${nowPlaying.coverUrl}" class="list-artwork" alt="${nowPlaying.title}">
                <div class="col-title">${nowPlaying.title}</div>
            </div>
            <div class="col-artist">${nowPlaying.artist}</div>
            <div class="col-actions">
                <button class="btn-list-action btn-row-options-trigger" data-song-id="${nowPlaying.id}">
                    ${SVGS.menu}
                </button>
            </div>
        </div>
    `;

    // Next Up listings
    html += `
        <h3 class="tracks-section-header" style="font-size:15px; color:var(--text-secondary); margin-bottom: 12px;">Next Up</h3>
    `;

    if (nextUp.length === 0) {
        html += `
            <div style="padding: 24px; text-align:center; border: 1px dashed var(--border-color); border-radius: var(--radius-md); color: var(--text-secondary); font-style: italic; font-size:13px; margin-bottom:30px;">
                End of Queue. No upcoming songs.
            </div>
        `;
    } else {
        html += `
            <div class="track-list-table" style="margin-bottom: 40px;">
                <div class="track-list-header" style="grid-template-columns: 48px 1fr 1fr 100px 48px;">
                    <div class="col-index">#</div>
                    <div>Title</div>
                    <div>Artist</div>
                    <div style="text-align:center;">Reorder</div>
                    <div style="text-align:center;">Remove</div>
                </div>
                ${nextUp.map((song, idx) => {
                    const actualQueueIndex = activeIdx + 1 + idx;
                    return `
                        <div class="track-list-row" data-song-id="${song.id}" style="grid-template-columns: 48px 1fr 1fr 100px 48px;">
                            <div class="col-index">${idx + 1}</div>
                            <div class="col-meta">
                                <img src="${song.coverUrl}" class="list-artwork" alt="${song.title}">
                                <div class="col-title">${song.title}</div>
                            </div>
                            <div class="col-artist">${song.artist}</div>
                            
                            <!-- Reorder arrows -->
                            <div style="display:flex; justify-content:center; gap:6px;">
                                <button class="btn-list-action btn-move-up" data-idx="${actualQueueIndex}" title="Move Up" style="width:28px; height:28px; border-radius: var(--radius-sm);">
                                    ${SVGS.arrowUp}
                                </button>
                                <button class="btn-list-action btn-move-down" data-idx="${actualQueueIndex}" title="Move Down" style="width:28px; height:28px; border-radius: var(--radius-sm);">
                                    ${SVGS.arrowDown}
                                </button>
                            </div>
                            
                            <!-- Remove trigger -->
                            <div class="col-actions">
                                <button class="btn-list-action btn-remove-queue" data-idx="${actualQueueIndex}" title="Remove from Queue">
                                    ${SVGS.trash}
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    container.innerHTML = html;

    // EVENT LISTENERS
    container.querySelector('.btn-clear-queue')?.addEventListener('click', () => {
        store.clearQueue();
        store.setView('queue');
    });

    // Handle reorders
    container.querySelectorAll('.btn-move-up').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute('data-idx'));
            store.reorderQueue(idx, idx - 1);
            store.setView('queue');
        });
    });

    container.querySelectorAll('.btn-move-down').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute('data-idx'));
            store.reorderQueue(idx, idx + 1);
            store.setView('queue');
        });
    });

    // Handle queue removals
    container.querySelectorAll('.btn-remove-queue').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute('data-idx'));
            store.removeFromQueue(idx);
            store.setView('queue');
            showToast('Removed from Queue');
        });
    });

    bindTablePlayAndActions(container, resolvedQueue);
}

// ----------------------------------------------------
// 6. UPLOADED SONGS VIEW RENDERER
// ----------------------------------------------------
function renderUploadedSongsView(container) {
    const uploads = store.getUploadedSongs();
    
    // Sort logic
    const sortVal = localStorage.getItem('resonate_upload_sort') || 'name';
    let sortedUploads = [...uploads];
    if (sortVal === 'name') {
        sortedUploads.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortVal === 'duration') {
        sortedUploads.sort((a, b) => b.duration - a.duration);
    } else if (sortVal === 'date') {
        sortedUploads.sort((a, b) => b.uploadedAt - a.uploadedAt);
    }

    let html = `
        <div class="view-title-row">
            <div>
                <h1 class="view-title">Uploaded Songs</h1>
                <p class="view-subtitle">Your personal cloud music locker</p>
            </div>
            <div class="stats-badge" style="background: rgba(0, 245, 212, 0.05); border-color: rgba(0, 245, 212, 0.15);">
                Uploaded: <span>${uploads.length} Songs</span>
            </div>
        </div>

        <!-- Drag & Drop Upload Zone -->
        <div class="upload-dropzone" id="upload-dropzone-panel">
            ${SVGS.upload}
            <div class="upload-dropzone-text">Drag & Drop Audio Files Here</div>
            <div class="upload-dropzone-subtext">Supports MP3, WAV, OGG, M4A up to 30MB</div>
            <button class="btn-secondary btn-upload-zone-browse" style="pointer-events: none;">Browse Files</button>
            <input type="file" id="zone-hidden-file-input" multiple accept="audio/mp3,audio/wav,audio/ogg,audio/m4a" style="display: none;">
        </div>
    `;

    if (uploads.length === 0) {
        html += `
            <div class="empty-state-wrapper">
                <div class="empty-state-icon">📤</div>
                <div class="empty-state-title">Your library is empty</div>
                <div class="empty-state-subtitle">Drag and drop or browse audio files above to add them to your cloud collection.</div>
            </div>
        `;
        container.innerHTML = html;
        initUploadDropzone(container);
        return;
    }

    // Render Filters/Sorting
    html += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom:12px;">
            <div style="font-size:14px; font-weight:700; color:var(--text-secondary);">Sort Collection</div>
            <select class="form-input upload-sort-select" style="width:140px; padding: 6px 12px; font-size:12px;">
                <option value="name" ${sortVal === 'name' ? 'selected' : ''}>Sort by Title</option>
                <option value="duration" ${sortVal === 'duration' ? 'selected' : ''}>Sort by Duration</option>
                <option value="date" ${sortVal === 'date' ? 'selected' : ''}>Sort by Date</option>
            </select>
        </div>

        <!-- Tabular List -->
        ${renderTrackTable(sortedUploads, true)}
    `;

    container.innerHTML = html;

    // EVENT LISTENERS & DROPZONE
    initUploadDropzone(container);

    // Sort listener
    const select = container.querySelector('.upload-sort-select');
    if (select) {
        select.addEventListener('change', () => {
            localStorage.setItem('resonate_upload_sort', select.value);
            store.setView('uploaded-songs');
        });
    }

    bindTablePlayAndActions(container, sortedUploads);
}

// ----------------------------------------------------
// 7. DOWNLOADS VIEW RENDERER
// ----------------------------------------------------
function renderDownloadsView(container) {
    const downloads = store.getDownloadedSongs();

    let html = `
        <div class="view-title-row">
            <div>
                <h1 class="view-title">Downloads</h1>
                <p class="view-subtitle">Offline accessible audio tracks</p>
            </div>
            <div class="stats-badge">Offline Cache: <span>${downloads.length} Tracks</span></div>
        </div>
    `;

    if (downloads.length === 0) {
        html += `
            <div class="empty-state-wrapper">
                <div class="empty-state-icon">⬇️</div>
                <div class="empty-state-title">No downloaded songs yet.</div>
                <div class="empty-state-subtitle">Tracks downloaded from the three-dot option menu will be saved here for offline play.</div>
            </div>
        `;
        container.innerHTML = html;
        return;
    }

    html += `
        <div style="display:flex; gap:16px; align-items:center; margin-bottom: 24px;">
            <button class="btn-primary btn-play-all-downloads" style="gap:8px;">
                ${SVGS.play} Play Offline
            </button>
        </div>

        ${renderTrackTable(downloads)}
    `;

    container.innerHTML = html;

    // EVENT LISTENERS
    container.querySelector('.btn-play-all-downloads').addEventListener('click', () => {
        store.setQueue(downloads, 0);
        player.playSong(downloads[0].id);
    });

    bindTablePlayAndActions(container, downloads);
}

// ----------------------------------------------------
// 8. PLAYLISTS GRID & SINGLE PLAYLIST
// ----------------------------------------------------
function renderPlaylistsView(container) {
    const playlists = store.getPlaylists();

    let html = `
        <div class="view-title-row">
            <div>
                <h1 class="view-title">Playlists</h1>
                <p class="view-subtitle">Your personalized music folders</p>
            </div>
            <button class="btn-primary btn-create-playlist-main">+ Create Playlist</button>
        </div>
    `;

    if (playlists.length === 0) {
        html += `
            <div class="empty-state-wrapper">
                <div class="empty-state-icon">🎵</div>
                <div class="empty-state-title">Create your first playlist.</div>
                <div class="empty-state-subtitle">Organize songs by your favorite mood, events, or artists.</div>
            </div>
        `;
        container.innerHTML = html;
        container.querySelector('.btn-create-playlist-main').addEventListener('click', createPlaylistTrigger);
        return;
    }

    html += `
        <div class="tracks-grid">
            ${playlists.map(p => `
                <div class="track-card playlist-grid-card" data-playlist-id="${p.id}">
                    <div class="card-artwork-wrapper">
                        <img src="${p.coverUrl}" class="card-artwork" alt="${p.name}">
                        <div class="card-play-overlay">
                            <button class="btn-card-play playlist-card-play-btn" data-playlist-id="${p.id}" title="Play Playlist">
                                ${SVGS.play}
                            </button>
                        </div>
                    </div>
                    <div class="card-title">${p.name}</div>
                    <div class="card-subtitle">Playlist • ${p.trackIds.length} Song${p.trackIds.length !== 1 ? 's' : ''}</div>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = html;

    // EVENT LISTENERS
    container.querySelector('.btn-create-playlist-main').addEventListener('click', createPlaylistTrigger);
    
    container.querySelectorAll('.playlist-grid-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // If play button clicked, play playlist
            if (e.target.closest('.playlist-card-play-btn')) {
                e.stopPropagation();
                const pid = card.getAttribute('data-playlist-id');
                const p = store.getPlaylistById(pid);
                if (p && p.trackIds.length > 0) {
                    const tracks = p.trackIds.map(id => store.getSongById(id)).filter(Boolean);
                    store.setQueue(tracks, 0);
                    player.playSong(tracks[0].id);
                } else {
                    showToast('Playlist is empty');
                }
                return;
            }
            const pid = card.getAttribute('data-playlist-id');
            store.setView('playlist', pid);
        });
    });
}

function createPlaylistTrigger() {
    const name = prompt('Enter a name for the new playlist:');
    if (name && name.trim()) {
        const playlist = store.createPlaylist(name.trim());
        store.setView('playlist', playlist.id);
    }
}

function renderSinglePlaylistView(container, playlistId) {
    const p = store.getPlaylistById(playlistId);
    if (!p) {
        store.setView('playlists');
        return;
    }

    const playlistSongs = p.trackIds.map(id => store.getSongById(id)).filter(Boolean);

    let html = `
        <div style="display: flex; gap: 32px; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap;">
            <div style="width: 180px; height: 180px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #1350b6 0%, #2c7873 100%); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-lg); overflow: hidden; flex-shrink:0;">
                <img src="${p.coverUrl}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex:1;">
                <span class="featured-badge" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #fff;">Playlist</span>
                <h1 class="view-title" style="font-size: 44px; margin: 6px 0; display:flex; align-items:center; gap:12px;">
                    <span class="playlist-name-text">${p.name}</span>
                </h1>
                <p class="view-subtitle">${playlistSongs.length} track${playlistSongs.length !== 1 ? 's' : ''} in playlist</p>
                
                <div style="display:flex; gap:10px; margin-top: 16px;">
                    <button class="btn-secondary btn-rename-playlist" style="font-size:12px; padding:6px 12px; border-radius: var(--radius-sm); gap:6px;">
                        ${SVGS.edit} Rename
                    </button>
                    <button class="btn-secondary btn-delete-playlist" style="font-size:12px; padding:6px 12px; border-radius: var(--radius-sm); color:#ff3b30; border-color: rgba(255,59,48,0.2); gap:6px;">
                        ${SVGS.trash} Delete
                    </button>
                </div>
            </div>
        </div>
    `;

    if (playlistSongs.length === 0) {
        html += `
            <div class="empty-state-wrapper">
                <div class="empty-state-icon">🎵</div>
                <div class="empty-state-title">This playlist is empty.</div>
                <div class="empty-state-subtitle">Add songs to this playlist from the track options (three-dot menu).</div>
            </div>
        `;
        container.innerHTML = html;
        bindPlaylistAdminControls(container, p);
        return;
    }

    html += `
        <div style="display:flex; gap:16px; align-items:center; margin-bottom: 24px;">
            <button class="btn-primary btn-play-playlist" style="gap:8px;">
                ${SVGS.play} Play Playlist
            </button>
            <button class="btn-secondary btn-shuffle-playlist" style="gap:8px;">
                ${SVGS.shuffle} Shuffle
            </button>
        </div>

        ${renderTrackTable(playlistSongs)}
    `;

    container.innerHTML = html;

    // EVENT LISTENERS
    bindPlaylistAdminControls(container, p);

    container.querySelector('.btn-play-playlist')?.addEventListener('click', () => {
        store.setQueue(playlistSongs, 0);
        player.playSong(playlistSongs[0].id);
    });

    container.querySelector('.btn-shuffle-playlist')?.addEventListener('click', () => {
        if (!player.shuffle) player.toggleShuffle();
        store.setQueue(playlistSongs, 0);
        const randIdx = Math.floor(Math.random() * playlistSongs.length);
        player.playSong(playlistSongs[randIdx].id);
    });

    bindTablePlayAndActions(container, playlistSongs, false, p.id);
}

function bindPlaylistAdminControls(container, playlist) {
    container.querySelector('.btn-rename-playlist').addEventListener('click', () => {
        const name = prompt('Rename Playlist:', playlist.name);
        if (name && name.trim()) {
            store.renamePlaylist(playlist.id, name.trim());
            store.setView('playlist', playlist.id);
        }
    });

    container.querySelector('.btn-delete-playlist').addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete playlist "${playlist.name}"?`)) {
            store.deletePlaylist(playlist.id);
            showToast('Playlist deleted');
        }
    });
}

// ----------------------------------------------------
// 9. ALBUMS & ARTISTS VIEWS
// ----------------------------------------------------
function renderAlbumsView(container) {
    const albums = store.getAlbums();

    let html = `
        <div class="view-title-row">
            <div>
                <h1 class="view-title">Albums</h1>
                <p class="view-subtitle">Explore track releases</p>
            </div>
        </div>
        <div class="tracks-grid">
            ${albums.map(a => `
                <div class="track-card album-grid-card" data-album-name="${a.name}">
                    <div class="card-artwork-wrapper">
                        <img src="${a.coverUrl}" class="card-artwork" alt="${a.name}">
                        <div class="card-play-overlay">
                            <button class="btn-card-play album-card-play-btn" data-album-name="${a.name}">
                                ${SVGS.play}
                            </button>
                        </div>
                    </div>
                    <div class="card-title">${a.name}</div>
                    <div class="card-subtitle">${a.artist} • ${a.songs.length} Song${a.songs.length !== 1 ? 's' : ''}</div>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.album-grid-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const albumName = card.getAttribute('data-album-name');
            const album = store.getAlbums().find(a => a.name === albumName);
            
            if (e.target.closest('.album-card-play-btn')) {
                e.stopPropagation();
                if (album && album.songs.length > 0) {
                    store.setQueue(album.songs, 0);
                    player.playSong(album.songs[0].id);
                }
                return;
            }
            store.setView('album', albumName);
        });
    });
}

function renderSingleAlbumView(container, albumName) {
    const albums = store.getAlbums();
    const album = albums.find(a => a.name === albumName);
    if (!album) {
        store.setView('albums');
        return;
    }

    let html = `
        <div style="display: flex; gap: 32px; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap;">
            <img src="${album.coverUrl}" style="width: 180px; height: 180px; border-radius: var(--radius-lg); object-fit: cover; box-shadow: var(--shadow-lg); flex-shrink:0;">
            <div style="flex:1;">
                <span class="featured-badge" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #fff;">Album</span>
                <h1 class="view-title" style="font-size: 40px; margin: 6px 0;">${album.name}</h1>
                <p class="view-subtitle">By ${album.artist} • ${album.songs.length} song${album.songs.length !== 1 ? 's' : ''}</p>
            </div>
        </div>

        <div style="display:flex; gap:16px; align-items:center; margin-bottom: 24px;">
            <button class="btn-primary btn-play-album" style="gap:8px;">
                ${SVGS.play} Play Album
            </button>
        </div>

        ${renderTrackTable(album.songs)}
    `;

    container.innerHTML = html;

    container.querySelector('.btn-play-album').addEventListener('click', () => {
        store.setQueue(album.songs, 0);
        player.playSong(album.songs[0].id);
    });

    bindTablePlayAndActions(container, album.songs);
}

function renderArtistsView(container) {
    const artists = store.getArtists();

    let html = `
        <div class="view-title-row">
            <div>
                <h1 class="view-title">Artists</h1>
                <p class="view-subtitle">Browse artists catalog</p>
            </div>
        </div>
        <div class="tracks-grid">
            ${artists.map(art => `
                <div class="track-card artist-grid-card" data-artist-name="${art.name}">
                    <div class="card-artwork-wrapper" style="border-radius: var(--radius-full);">
                        <img src="${art.coverUrl}" class="card-artwork" alt="${art.name}">
                        <div class="card-play-overlay">
                            <button class="btn-card-play artist-card-play-btn" data-artist-name="${art.name}">
                                ${SVGS.play}
                            </button>
                        </div>
                    </div>
                    <div class="card-title" style="text-align:center; font-weight:700;">${art.name}</div>
                    <div class="card-subtitle" style="text-align:center;">Artist • ${art.songs.length} Song${art.songs.length !== 1 ? 's' : ''}</div>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.artist-grid-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const artistName = card.getAttribute('data-artist-name');
            const artist = store.getArtists().find(art => art.name === artistName);
            
            if (e.target.closest('.artist-card-play-btn')) {
                e.stopPropagation();
                if (artist && artist.songs.length > 0) {
                    store.setQueue(artist.songs, 0);
                    player.playSong(artist.songs[0].id);
                }
                return;
            }
            store.setView('artist', artistName);
        });
    });
}

function renderSingleArtistView(container, artistName) {
    const artists = store.getArtists();
    const artist = artists.find(a => a.name === artistName);
    if (!artist) {
        store.setView('artists');
        return;
    }

    let html = `
        <div style="display: flex; gap: 32px; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap;">
            <img src="${artist.coverUrl}" style="width: 180px; height: 180px; border-radius: var(--radius-full); object-fit: cover; box-shadow: var(--shadow-lg); flex-shrink:0;">
            <div style="flex:1;">
                <span class="featured-badge" style="background: rgba(0, 245, 212, 0.1); border-color: rgba(0, 245, 212, 0.2); color: var(--accent-teal);">Verified Artist</span>
                <h1 class="view-title" style="font-size: 48px; margin: 6px 0;">${artist.name}</h1>
                <p class="view-subtitle">${artist.songs.length} total tracks listed</p>
            </div>
        </div>

        <div style="display:flex; gap:16px; align-items:center; margin-bottom: 24px;">
            <button class="btn-primary btn-play-artist" style="gap:8px;">
                ${SVGS.play} Play Artist
            </button>
        </div>

        <h2 class="tracks-section-header">Popular Tracks</h2>
        ${renderTrackTable(artist.songs)}
    `;

    container.innerHTML = html;

    container.querySelector('.btn-play-artist').addEventListener('click', () => {
        store.setQueue(artist.songs, 0);
        player.playSong(artist.songs[0].id);
    });

    bindTablePlayAndActions(container, artist.songs);
}

// ----------------------------------------------------
// UI SHARED COMPONENT BUILDERS
// ----------------------------------------------------

// Grid layout for cards
function renderTrackGrid(songs) {
    return `
        <div class="tracks-grid">
            ${songs.map(song => {
                const isLiked = store.isLiked(song.id);
                return `
                    <div class="track-card track-grid-card" data-song-id="${song.id}">
                        <div class="card-artwork-wrapper">
                            <img src="${song.coverUrl}" class="card-artwork" alt="${song.title}" loading="lazy">
                            <div class="card-play-overlay">
                                <button class="btn-card-play card-play-trigger" data-song-id="${song.id}">
                                    ${SVGS.play}
                                </button>
                            </div>
                            <button class="btn-card-like card-like-trigger ${isLiked ? 'liked' : ''}" data-song-id="${song.id}">
                                ${SVGS.heart}
                            </button>
                            <button class="btn-card-menu card-menu-trigger" data-song-id="${song.id}">
                                ${SVGS.menu}
                            </button>
                        </div>
                        <div class="card-title">${song.title}</div>
                        <div class="card-subtitle">${song.artist}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Tabular row layout
function renderTrackTable(songs, showAdminActions = false) {
    return `
        <div class="track-list-table">
            <div class="track-list-header">
                <div class="col-index">#</div>
                <div>Title</div>
                <div>Artist</div>
                <div>Album</div>
                <div>Duration</div>
                <div style="text-align:center;">Action</div>
            </div>
            ${songs.map((song, i) => {
                const isPlaying = player.isPlaying && player.getPlayingTrack()?.id === song.id;
                const isLiked = store.isLiked(song.id);
                return `
                    <div class="track-list-row ${isPlaying ? 'active' : ''}" data-song-id="${song.id}">
                        <div class="col-index">
                            ${isPlaying ? `
                                <div style="color:var(--accent-teal); font-weight:bold;">▶</div>
                            ` : i + 1}
                        </div>
                        <div class="col-meta">
                            <img src="${song.coverUrl}" class="list-artwork" alt="${song.title}">
                            <div class="col-title">${song.title}</div>
                        </div>
                        <div class="col-artist">${song.artist}</div>
                        <div class="col-album">${song.album || 'Single'}</div>
                        <div class="col-duration">${formatTime(song.duration)}</div>
                        <div class="col-actions">
                            <button class="btn-list-action btn-row-like-trigger ${isLiked ? 'liked' : ''}" data-song-id="${song.id}">
                                ${SVGS.heart}
                            </button>
                            <button class="btn-list-action btn-row-options-trigger" data-song-id="${song.id}">
                                ${SVGS.menu}
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderEmptyLibraryState() {
    return `
        <div class="empty-state-wrapper">
            <div class="empty-state-icon">${SVGS.music}</div>
            <div class="empty-state-title">Your music library is empty</div>
            <div class="empty-state-subtitle">Upload your favorite songs and start listening.</div>
            <button class="btn-primary btn-empty-state-upload" style="margin-top:8px;">Upload Music</button>
        </div>
    `;
}

// ----------------------------------------------------
// BIND COMMON CLICKS (Play, Like, Options)
// ----------------------------------------------------
function bindGridPlayAndActions(viewContainer) {
    // Play Click
    viewContainer.querySelectorAll('.card-play-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sid = btn.getAttribute('data-song-id');
            player.playSong(sid);
        });
    });

    // Like Click
    viewContainer.querySelectorAll('.card-like-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sid = btn.getAttribute('data-song-id');
            store.toggleLike(sid);
            // Dynamic visual toggle
            const isLiked = store.isLiked(sid);
            btn.classList.toggle('liked', isLiked);
            showToast(isLiked ? 'Added to Liked Songs' : 'Removed from Liked Songs');
        });
    });

    // Menu Click
    viewContainer.querySelectorAll('.card-menu-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sid = btn.getAttribute('data-song-id');
            const song = store.getSongById(sid);
            if (song) showSongContextMenu(song, e);
        });
    });

    // Card Row Click
    viewContainer.querySelectorAll('.track-grid-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return; // ignore buttons
            const sid = card.getAttribute('data-song-id');
            player.playSong(sid);
        });
    });

    // Empty upload click
    const emptyUpload = viewContainer.querySelector('.btn-empty-state-upload');
    if (emptyUpload) {
        emptyUpload.addEventListener('click', () => {
            const input = document.getElementById('sidebar-hidden-file-input');
            if (input) input.click();
        });
    }
}

function bindTablePlayAndActions(viewContainer, listSongs, showAdmin = false, playlistId = null) {
    // Play on row double click
    viewContainer.querySelectorAll('.track-list-row').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.closest('button')) return; // ignore buttons
            const sid = row.getAttribute('data-song-id');
            
            // Set context queue to this table's list
            const indexInList = listSongs.findIndex(s => s.id === sid);
            if (indexInList !== -1) {
                store.setQueue(listSongs, indexInList);
            }
            player.playSong(sid);
        });
    });

    // Row Like click
    viewContainer.querySelectorAll('.btn-row-like-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sid = btn.getAttribute('data-song-id');
            store.toggleLike(sid);
            
            const isLiked = store.isLiked(sid);
            btn.classList.toggle('liked', isLiked);
            showToast(isLiked ? 'Added to Liked Songs' : 'Removed from Liked Songs');
        });
    });

    // Row Options Menu Click
    viewContainer.querySelectorAll('.btn-row-options-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sid = btn.getAttribute('data-song-id');
            const song = store.getSongById(sid);
            if (song) showSongContextMenu(song, e, playlistId);
        });
    });
}

// ----------------------------------------------------
// 10. SONGS OPTIONS FLOATING CONTEXT MENU
// ----------------------------------------------------
function showSongContextMenu(song, event, originPlaylistId = null) {
    // 1. Remove old dropdowns
    const old = document.querySelector('.dropdown-menu');
    if (old) old.remove();

    // 2. Create Context Dropdown DOM
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu';
    
    // Position absolute near mouse click
    dropdown.style.position = 'fixed';
    dropdown.style.left = `${event.clientX}px`;
    dropdown.style.top = `${event.clientY}px`;

    const isDemo = song.id.startsWith('demo-');
    const isLiked = store.isLiked(song.id);

    let html = `
        <button class="dropdown-item option-play">
            ${SVGS.play} Play Song
        </button>
        <button class="dropdown-item option-play-next">
            ${SVGS.play} Play Next
        </button>
        <button class="dropdown-item option-queue">
            ${SVGS.queue} Add to Queue
        </button>
        <button class="dropdown-item option-like">
            ${SVGS.heart} ${isLiked ? 'Unlike Song' : 'Like Song'}
        </button>
        <button class="dropdown-item option-playlist">
            ${SVGS.folder} Add to Playlist
        </button>
        ${originPlaylistId ? `
            <button class="dropdown-item option-remove-playlist" style="color:#ff3b30;">
                ${SVGS.trash} Remove from Playlist
            </button>
        ` : ''}
        <button class="dropdown-item option-details">
            ${SVGS.menu} View Details
        </button>
        <button class="dropdown-item option-download">
            ${SVGS.download} Download permitted file
        </button>
    `;

    if (!isDemo) {
        html += `
            <div class="dropdown-divider"></div>
            <button class="dropdown-item option-edit">
                ${SVGS.edit} Edit Details
            </button>
            <button class="dropdown-item option-delete" style="color:#ff3b30;">
                ${SVGS.trash} Delete Song File
            </button>
        `;
    }

    dropdown.innerHTML = html;
    document.body.appendChild(dropdown);

    // Keep dropdown inside screen boundaries
    const box = dropdown.getBoundingClientRect();
    if (box.right > window.innerWidth) {
        dropdown.style.left = `${window.innerWidth - box.width - 10}px`;
    }
    if (box.bottom > window.innerHeight) {
        dropdown.style.top = `${window.innerHeight - box.height - 10}px`;
    }

    // DISPATCH OPTIONS ACTIONS
    dropdown.querySelector('.option-play').addEventListener('click', () => {
        player.playSong(song.id);
        dropdown.remove();
    });

    dropdown.querySelector('.option-play-next').addEventListener('click', () => {
        store.playNext(song);
        showToast(`Next up: ${song.title}`);
        dropdown.remove();
    });

    dropdown.querySelector('.option-queue').addEventListener('click', () => {
        store.addToQueue(song);
        showToast(`Added ${song.title} to Queue`);
        dropdown.remove();
    });

    dropdown.querySelector('.option-like').addEventListener('click', () => {
        store.toggleLike(song.id);
        showToast(store.isLiked(song.id) ? 'Added to Liked Songs' : 'Removed from Liked Songs');
        store.setView(store.currentView, store.currentViewParam); // re-render view
        dropdown.remove();
    });

    dropdown.querySelector('.option-playlist').addEventListener('click', () => {
        openPlaylistSelectorModal(song.id);
        dropdown.remove();
    });

    if (originPlaylistId) {
        dropdown.querySelector('.option-remove-playlist').addEventListener('click', () => {
            store.removeTrackFromPlaylist(originPlaylistId, song.id);
            showToast('Removed from Playlist');
            store.setView('playlist', originPlaylistId);
            dropdown.remove();
        });
    }

    dropdown.querySelector('.option-details').addEventListener('click', () => {
        openSongDetailsModal(song.id);
        dropdown.remove();
    });

    dropdown.querySelector('.option-download').addEventListener('click', () => {
        triggerTrackDownload(song);
        dropdown.remove();
    });

    if (!isDemo) {
        dropdown.querySelector('.option-edit').addEventListener('click', () => {
            openMetadataEditorModal(song.id, () => {
                store.setView(store.currentView, store.currentViewParam);
            });
            dropdown.remove();
        });

        dropdown.querySelector('.option-delete').addEventListener('click', async () => {
            if (confirm(`Permanently delete "${song.title}" file from Resonate storage? This cannot be undone.`)) {
                // Delete from IndexedDB and store
                const { deleteTrackBlob } = await import('../database.js');
                await deleteTrackBlob(song.id);
                store.deleteUploadedSong(song.id);
                showToast('Song deleted successfully');
                store.setView(store.currentView, store.currentViewParam);
            }
            dropdown.remove();
        });
    }

    // Dismiss context menu if clicked elsewhere
    const dismissMenu = (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', dismissMenu);
        }
    };
    // Defer binding click to avoid capturing the click triggering the menu
    setTimeout(() => {
        document.addEventListener('click', dismissMenu);
    }, 10);
}

// ----------------------------------------------------
// 11. AUDIO DOWNLOAD HANDLER
// ----------------------------------------------------
function triggerDownloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function triggerTrackDownload(song) {
    try {
        if (song.id.startsWith('demo-')) {
            store.markDownloaded(song.id, true);
            const fallback = document.createElement('a');
            fallback.href = song.audioUrl;
            fallback.target = '_blank';
            fallback.rel = 'noopener noreferrer';
            fallback.download = `${song.title} - ${song.artist}.mp3`;
            document.body.appendChild(fallback);
            fallback.click();
            document.body.removeChild(fallback);
            showToast('Download link opened. Use Save link as... in the browser tab.');
            return;
        }

        const blob = await getTrackBlob(song.id);
        if (!blob) throw new Error('Blob not in database');

        store.markDownloaded(song.id, true);
        triggerDownloadBlob(blob, song.fileName || `${song.title} - ${song.artist}.mp3`);
        showToast('Song downloaded successfully');
    } catch (err) {
        console.error('Download error:', err);
        if (song.id.startsWith('demo-')) {
            window.open(song.audioUrl, '_blank', 'noopener,noreferrer');
            store.markDownloaded(song.id, true);
            showToast('Open link started; save the file from the browser tab.');
        } else {
            showToast('Download failed. Local file storage unreachable.');
        }
    }
}

// ----------------------------------------------------
// 12. DRAG-DROP UPLOAD CONTROLS
// ----------------------------------------------------
function initUploadDropzone(container) {
    const zone = container.querySelector('#upload-dropzone-panel');
    if (!zone) return;

    const fileInput = container.querySelector('#zone-hidden-file-input');

    zone.addEventListener('click', () => fileInput.click());

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleUploadFiles(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleUploadFiles(fileInput.files);
        }
    });
}

/**
 * Handle processing multiple files for uploading
 */
export async function handleUploadFiles(files) {
    showToast(`Uploading ${files.length} file${files.length !== 1 ? 's' : ''}...`);
    
    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Verify Audio formats
        const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/m4a', 'audio/x-m4a'];
        if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
            showToast(`Unsupported format: ${file.name}`);
            continue;
        }

        // 2. Set Up identifiers
        const id = 'uploaded-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        
        try {
            // 3. Save raw audio Blob into IndexedDB
            await saveTrackBlob(id, file);

            // 4. Parse Metadata
            let title = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            let artist = 'Unknown Artist';
            let album = 'Single';
            let genre = 'Uploaded';
            let coverUrl = '';
            
            // Try ID3v2 metadata scan
            const meta = await parseID3Tags(file);
            if (meta) {
                if (meta.title) title = meta.title;
                if (meta.artist) artist = meta.artist;
                if (meta.album) album = meta.album;
                if (meta.genre) genre = meta.genre;
                if (meta.coverUrl) coverUrl = meta.coverUrl;
            }

            // Fallback unique dynamic CSS gradient background cover if no embedded cover
            if (!coverUrl) {
                coverUrl = generateGradientAvatar(title + artist);
            }

            // 5. Gather Audio Duration natively using a clean background audio preloader
            const duration = await getAudioDurationNatively(file);

            // 6. Build track object
            const track = {
                id,
                title,
                artist,
                album,
                genre,
                duration,
                coverUrl,
                fileName: file.name,
                uploadedAt: Date.now()
            };

            // 7. Push to global store
            store.addUploadedSong(track);
            successCount++;
        } catch (uploadErr) {
            console.error('File import failure:', uploadErr);
        }
    }

    if (successCount > 0) {
        showToast(`Successfully uploaded ${successCount} track${successCount !== 1 ? 's' : ''}`);
        // Re-render current page
        store.setView(store.currentView, store.currentViewParam);
    }
}

// Background utility to capture audio duration natively
function getAudioDurationNatively(file) {
    return new Promise((resolve) => {
        const audio = document.createElement('audio');
        audio.src = URL.createObjectURL(file);
        audio.addEventListener('loadedmetadata', () => {
            resolve(Math.round(audio.duration) || 180); // Default to 3 minutes fallback
            URL.revokeObjectURL(audio.src);
        });
        audio.addEventListener('error', () => {
            resolve(180); // Fallback
            URL.revokeObjectURL(audio.src);
        });
    });
}

// Generate premium unique matching css gradients for custom uploads without artworks
function generateGradientAvatar(seedStr) {
    // Hash string to map to stable gradient angles and HSL parameters
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const angle = Math.abs(hash % 360);
    const h1 = Math.abs(hash % 360);
    const h2 = (h1 + 60) % 360;
    
    // Return a square svg data uri displaying the title's initial in a beautiful layout
    const initial = seedStr.charAt(0).toUpperCase();
    const svgStr = `
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
            <defs>
                <linearGradient id="g_${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="hsl(${h1}, 70%, 25%)" />
                    <stop offset="100%" stop-color="hsl(${h2}, 85%, 45%)" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g_${hash})" />
            <text x="50%" y="55%" font-family="Outfit, sans-serif" font-weight="800" font-size="110" fill="#ffffff" dominant-baseline="middle" text-anchor="middle" opacity="0.95">${initial}</text>
        </svg>
    `.trim().replace(/#/g, '%23');
    
    return `data:image/svg+xml;utf8,${svgStr}`;
}

// ----------------------------------------------------
// DATES FORMATTING HELPERS
// ----------------------------------------------------
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function formatRelativeTime(timestamp) {
    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return new Date(timestamp).toLocaleDateString();
}
