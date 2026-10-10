/* RESONATE - Sidebar Component */
import { store } from '../store.js';

// SVG Icons helper definitions
const ICONS = {
    home: `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    heart: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    recent: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    queue: `<svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
    upload: `<svg viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>`,
    folder: `<svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
    music: `<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
    album: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>`,
    artist: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    download: `<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    plus: `<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    brandLogo: `<svg viewBox="0 0 24 24" aria-label="Streamify logo"><circle cx="12" cy="12" r="11" fill="currentColor"></circle><path d="M17.9 15.4c-.4.6-1.1.8-1.7.4-2.1-1.3-4.8-1.6-8-1-.7.1-1.3-.3-1.4-1-.1-.7.3-1.3 1-1.4 3.7-.7 6.8-.2 9.4 1.6.6.4.8 1.2.4 1.8zm2-3.1c-.5.8-1.4 1.1-2.2.6-2.8-1.7-6.7-2.1-10.4-1.2-.8.2-1.6-.2-1.8-1-.2-.8.2-1.6 1-1.8 4.4-1.2 8.9-.5 12.1 2 .7.5 1 1.5.3 2.4zm.3-3.4C16.1 7.2 10.5 6.7 6.4 7.8c-.9.2-1.9-.3-2.1-1.2-.2-.9.3-1.9 1.2-2.1 5.3-1.3 12.2-.7 16.4 2.8.8.7 1 1.9.3 2.7-.7.8-1.9 1-2.7.3z" fill="#0f0f11"></path></svg>`
};

export function renderSidebar() {
    const sidebarEl = document.getElementById('sidebar');
    if (!sidebarEl) return;

    const current = store.currentView;
    const currentParam = store.currentViewParam;

    // Helper function to check if active
    const activeClass = (viewName, param = null) => {
        if (param !== null) {
            return (current === viewName && currentParam === param) ? 'active' : '';
        }
        return (current === viewName) ? 'active' : '';
    };

    // Render HTML structure
    let html = `
        <div class="sidebar-logo">
            ${ICONS.brandLogo}
            <span>Streamify</span>
        </div>

        <div class="sidebar-action-container">
            <button class="btn-upload-primary btn-upload-trigger">
                ${ICONS.upload}
                <span>Upload Music</span>
            </button>
            <input type="file" id="sidebar-hidden-file-input" multiple accept="audio/mp3,audio/wav,audio/ogg,audio/m4a" style="display: none;">
        </div>

        <!-- MAIN VIEW ITEMS -->
        <ul class="sidebar-menu">
            <li>
                <a href="#" class="sidebar-link ${activeClass('home')}" data-view="home">
                    ${ICONS.home}
                    <span>Home</span>
                </a>
            </li>
            <li>
                <a href="#" class="sidebar-link ${activeClass('search')}" data-view="search">
                    ${ICONS.search}
                    <span>Search</span>
                </a>
            </li>
            <li>
                <a href="#" class="sidebar-link ${activeClass('liked-songs')}" data-view="liked-songs">
                    ${ICONS.heart}
                    <span>Liked Songs</span>
                </a>
            </li>
            <li>
                <a href="#" class="sidebar-link ${activeClass('recently-played')}" data-view="recently-played">
                    ${ICONS.recent}
                    <span>Recently Played</span>
                </a>
            </li>
            <li>
                <a href="#" class="sidebar-link ${activeClass('queue')}" data-view="queue">
                    ${ICONS.queue}
                    <span>Play Queue</span>
                </a>
            </li>
        </ul>

        <!-- YOUR LIBRARY -->
        <div class="sidebar-menu-title" style="display: flex; align-items: center; justify-content: space-between; padding-right: 20px;">
            <span>Your Library</span>
            <button class="btn-create-playlist-sidebar" title="Create Playlist" style="color: var(--text-secondary); width: 20px; height: 20px; border-radius: 4px;">
                ${ICONS.plus}
            </button>
        </div>
        <ul class="sidebar-menu">
            <li>
                <a href="#" class="sidebar-link ${activeClass('uploaded-songs')}" data-view="uploaded-songs">
                    ${ICONS.music}
                    <span>Uploaded Songs</span>
                </a>
            </li>
            <li>
                <a href="#" class="sidebar-link ${activeClass('albums')}" data-view="albums">
                    ${ICONS.album}
                    <span>Albums</span>
                </a>
            </li>
            <li>
                <a href="#" class="sidebar-link ${activeClass('artists')}" data-view="artists">
                    ${ICONS.artist}
                    <span>Artists</span>
                </a>
            </li>
            <li>
                <a href="#" class="sidebar-link ${activeClass('downloads')}" data-view="downloads">
                    ${ICONS.download}
                    <span>Downloads</span>
                </a>
            </li>
        </ul>

        <!-- PLAYLISTS LIST -->
        <div class="sidebar-menu-title">Playlists</div>
        <ul class="sidebar-menu" style="flex: 1; overflow-y: auto; margin-bottom: 0;">
    `;

    const playlists = store.getPlaylists();
    if (playlists.length === 0) {
        html += `
            <li style="padding: 10px 12px; font-size: 13px; color: var(--text-muted); font-style: italic;">
                No playlists yet
            </li>
        `;
    } else {
        playlists.forEach(p => {
            html += `
                <li>
                    <a href="#" class="sidebar-link ${activeClass('playlist', p.id)}" data-view="playlist" data-param="${p.id}">
                        ${ICONS.folder}
                        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</span>
                    </a>
                </li>
            `;
        });
    }

    html += `
        </ul>
        
        <!-- SESSION BUILD FOOTER info -->
        <div class="sidebar-footer" style="padding: 20px; border-top: 1px solid rgba(255, 255, 255, 0.02); font-size: 12px; color: var(--text-muted);">
            <div style="font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Session Build</div>
            <p style="line-height: 1.4;">A premium desktop player, powered by local HTML5 audio, IndexedDB blobs, and state persistence.</p>
        </div>
    `;

    sidebarEl.innerHTML = html;

    // BIND NAVIGATION EVENTS
    const links = sidebarEl.querySelectorAll('.sidebar-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            const param = link.getAttribute('data-param');
            store.setView(view, param);
            
            // On mobile, close sidebar on link selection
            sidebarEl.classList.remove('mobile-visible');
        });
    });

    // BIND UPLOAD BUTTON TRIGGER
    const fileInput = sidebarEl.querySelector('#sidebar-hidden-file-input');
    const uploadBtn = sidebarEl.querySelector('.btn-upload-trigger');
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => fileInput.click());
        // File input changes are handled globally inside app.js
    }

    // BIND PLAYLIST CREATION
    const createPlaylistBtn = sidebarEl.querySelector('.btn-create-playlist-sidebar');
    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = prompt('Enter a name for the new playlist:');
            if (name && name.trim()) {
                const playlist = store.createPlaylist(name.trim());
                store.setView('playlist', playlist.id);
            }
        });
    }
}

// Auto re-render sidebar when store updates (essential for playlists lists)
store.subscribe(() => {
    renderSidebar();
});
export default renderSidebar;
