/* RESONATE - Overlay Modals Component Manager */
import { store } from '../store.js';
import { player } from '../player.js';
import { showToast } from './toast.js';

const modalContainer = document.getElementById('modal-container');

function showModal(contentHtml, bindEventsCallback) {
    if (!modalContainer) return;
    
    modalContainer.innerHTML = contentHtml;
    modalContainer.classList.remove('hidden');
    
    // Bind close action
    const closeBtn = modalContainer.querySelector('.btn-modal-close');
    const cancelBtn = modalContainer.querySelector('.btn-modal-cancel');
    const overlay = modalContainer;
    
    const closeModal = () => {
        modalContainer.classList.add('hidden');
        modalContainer.innerHTML = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Close modal if clicked outside dialog
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    if (bindEventsCallback) {
        bindEventsCallback(closeModal);
    }
}

/**
 * Open Song Details Modal
 * @param {string} trackId - The target track identifier
 */
export function openSongDetailsModal(trackId) {
    const song = store.getSongById(trackId);
    if (!song) return;

    const formattedDuration = formatTime(song.duration);
    const fileSource = song.id.startsWith('demo-') ? 'SoundHelix Streaming Server' : 'Local IndexedDB Audio Block';
    const fileFormat = song.id.startsWith('demo-') ? 'MPEG-Audio (MP3)' : (song.fileName ? song.fileName.split('.').pop().toUpperCase() : 'WAV/MP3');
    
    const content = `
        <div class="modal-dialog" style="max-width: 480px;">
            <div class="modal-header">
                <h3 class="modal-title">Song Details</h3>
                <button class="btn-modal-close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="modal-body" style="display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center;">
                <img src="${song.coverUrl}" alt="${song.title}" style="width: 200px; height: 200px; border-radius: var(--radius-md); object-fit: cover; box-shadow: var(--shadow-lg);">
                <div>
                    <h2 style="font-size: 20px; font-weight: 800;">${song.title}</h2>
                    <p style="color: var(--text-secondary); margin-top: 4px; font-weight: 500;">${song.artist}</p>
                </div>
                
                <div style="width: 100%; text-align: left; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; font-size: 13px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px;">
                    <div><span style="color: var(--text-primary); font-weight: 600;">Album:</span> ${song.album || 'Single'}</div>
                    <div><span style="color: var(--text-primary); font-weight: 600;">Genre:</span> ${song.genre || 'Unknown'}</div>
                    <div><span style="color: var(--text-primary); font-weight: 600;">Duration:</span> ${formattedDuration}</div>
                    <div><span style="color: var(--text-primary); font-weight: 600;">File Type:</span> ${fileFormat}</div>
                    <div><span style="color: var(--text-primary); font-weight: 600;">Audio Source:</span> ${fileSource}</div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%;">
                    <button class="btn-primary btn-play-song-detail" style="width: 100%; gap: 8px;">
                        <svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><path d="M8 5v14l11-7z"></path></svg>Play
                    </button>
                    <button class="btn-secondary btn-like-song-detail" style="width: 100%; gap: 8px; color: ${store.isLiked(song.id) ? 'var(--accent-teal)' : 'inherit'}">
                        <svg viewBox="0 0 24 24" fill="${store.isLiked(song.id) ? 'var(--accent-teal)' : 'none'}" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        <span>${store.isLiked(song.id) ? 'Liked' : 'Like'}</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    showModal(content, (closeModal) => {
        const dialog = modalContainer.querySelector('.modal-dialog');
        
        dialog.querySelector('.btn-play-song-detail').addEventListener('click', () => {
            player.playSong(song.id);
            closeModal();
        });

        dialog.querySelector('.btn-like-song-detail').addEventListener('click', () => {
            store.toggleLike(song.id);
            const isLikedNow = store.isLiked(song.id);
            const heart = dialog.querySelector('.btn-like-song-detail svg');
            const text = dialog.querySelector('.btn-like-song-detail span');
            
            if (isLikedNow) {
                heart.setAttribute('fill', 'var(--accent-teal)');
                heart.style.stroke = 'var(--accent-teal)';
                text.innerText = 'Liked';
                dialog.querySelector('.btn-like-song-detail').style.color = 'var(--accent-teal)';
                showToast(`Liked ${song.title}`);
            } else {
                heart.setAttribute('fill', 'none');
                heart.style.stroke = 'currentColor';
                text.innerText = 'Like';
                dialog.querySelector('.btn-like-song-detail').style.color = 'inherit';
                showToast(`Removed ${song.title} from Likes`);
            }
        });
    });
}

/**
 * Open Metadata Editor Modal for Uploaded Songs
 * @param {string} trackId - The target uploaded track identifier
 * @param {Function} onSave - Callback to execute after saving
 */
export function openMetadataEditorModal(trackId, onSave) {
    const song = store.getSongById(trackId);
    if (!song) return;

    const content = `
        <div class="modal-dialog">
            <div class="modal-header">
                <h3 class="modal-title">Edit Song Metadata</h3>
                <button class="btn-modal-close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="edit-metadata-form">
                    <div class="form-group">
                        <label class="form-label" for="edit-title">Title</label>
                        <input type="text" id="edit-title" class="form-input" value="${song.title}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="edit-artist">Artist</label>
                        <input type="text" id="edit-artist" class="form-input" value="${song.artist}">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="edit-album">Album</label>
                        <input type="text" id="edit-album" class="form-input" value="${song.album}">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="edit-genre">Genre</label>
                        <input type="text" id="edit-genre" class="form-input" value="${song.genre}">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary btn-modal-cancel">Cancel</button>
                <button type="submit" form="edit-metadata-form" class="btn-primary">Save Changes</button>
            </div>
        </div>
    `;

    showModal(content, (closeModal) => {
        const form = modalContainer.querySelector('#edit-metadata-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedMeta = {
                title: form.querySelector('#edit-title').value.trim() || 'Unknown Title',
                artist: form.querySelector('#edit-artist').value.trim() || 'Unknown Artist',
                album: form.querySelector('#edit-album').value.trim() || 'Single',
                genre: form.querySelector('#edit-genre').value.trim() || 'Custom'
            };
            
            store.updateUploadedMetadata(song.id, updatedMeta);
            showToast('Metadata updated successfully');
            closeModal();
            if (onSave) onSave();
        });
    });
}

/**
 * Open Playlist Selector Modal to add a song to a playlist
 * @param {string} trackId - The track to add
 */
export function openPlaylistSelectorModal(trackId) {
    const song = store.getSongById(trackId);
    if (!song) return;

    function renderPlaylistsList() {
        const playlists = store.getPlaylists();
        if (playlists.length === 0) {
            return `
                <div style="text-align: center; padding: 20px 0; color: var(--text-secondary);">
                    <p style="font-size: 14px; margin-bottom: 12px;">You haven't created any playlists yet.</p>
                </div>
            `;
        }
        
        return playlists.map(playlist => {
            const songCount = playlist.trackIds.length;
            const alreadyContains = playlist.trackIds.includes(trackId);
            return `
                <button class="playlist-select-row" data-playlist-id="${playlist.id}" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 12px; border-radius: var(--radius-md); margin-bottom: 6px; cursor: pointer; text-align: left; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='none'">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${playlist.coverUrl}" style="width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover;">
                        <div>
                            <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">${playlist.name}</div>
                            <div style="font-size: 12px; color: var(--text-secondary);">${songCount} song${songCount !== 1 ? 's' : ''}</div>
                        </div>
                    </div>
                    ${alreadyContains ? `
                        <span style="font-size: 11px; font-weight: 700; color: var(--accent-teal); text-transform: uppercase;">Added</span>
                    ` : `
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.5" style="width:16px;height:16px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    `}
                </button>
            `;
        }).join('');
    }

    const content = `
        <div class="modal-dialog" style="max-width: 420px;">
            <div class="modal-header">
                <h3 class="modal-title">Add to Playlist</h3>
                <button class="btn-modal-close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="modal-body" style="max-height: 300px; overflow-y: auto; padding: 16px;">
                <div class="playlists-list-container">${renderPlaylistsList()}</div>
            </div>
            <div class="modal-footer" style="flex-direction: column; align-items: stretch; gap: 12px;">
                <div style="display: flex; gap: 8px;">
                    <input type="text" id="new-playlist-name" class="form-input" placeholder="New Playlist Name" style="padding: 10px 14px; font-size: 13px;">
                    <button class="btn-primary btn-create-playlist-submit" style="white-space: nowrap; font-size: 13px; padding: 10px 16px;">+ Create</button>
                </div>
            </div>
        </div>
    `;

    showModal(content, (closeModal) => {
        const dialog = modalContainer.querySelector('.modal-dialog');
        const listContainer = dialog.querySelector('.playlists-list-container');
        
        // Handle adding song to playlist
        function bindPlaylistRows() {
            const rows = listContainer.querySelectorAll('.playlist-select-row');
            rows.forEach(row => {
                row.addEventListener('click', () => {
                    const pid = row.getAttribute('data-playlist-id');
                    const playlist = store.getPlaylistById(pid);
                    if (playlist) {
                        if (playlist.trackIds.includes(trackId)) {
                            // Already added
                            showToast(`Song already in ${playlist.name}`);
                            return;
                        }
                        store.addTrackToPlaylist(pid, trackId);
                        showToast(`Added to ${playlist.name}`);
                        closeModal();
                    }
                });
            });
        }
        bindPlaylistRows();

        // Handle creating a playlist and adding
        const createBtn = dialog.querySelector('.btn-create-playlist-submit');
        const input = dialog.querySelector('#new-playlist-name');
        
        createBtn.addEventListener('click', () => {
            const name = input.value.trim();
            if (!name) {
                showToast('Please enter a playlist name');
                return;
            }
            const playlist = store.createPlaylist(name);
            store.addTrackToPlaylist(playlist.id, trackId);
            showToast(`Created playlist and added song`);
            closeModal();
        });
    });
}

// ----------------------------------------------------
// UI HELPERS
// ----------------------------------------------------
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}
