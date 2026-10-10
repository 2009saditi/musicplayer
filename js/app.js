/* RESONATE - Application Orchestrator */
import { store } from './store.js';
import { player } from './player.js';
import { renderSidebar } from './components/sidebar.js';
import { renderBottomPlayer } from './components/bottomPlayer.js';
import { renderActiveView, handleUploadFiles } from './components/views.js';
import { showToast } from './components/toast.js';

// Render Top Header Area
export function renderHeader() {
    const header = document.getElementById('header-container');
    if (!header) return;

    header.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px;">
            <!-- Mobile Navigation Drawer Toggle -->
            <button id="btn-mobile-toggle" class="btn-mobile-toggle" title="Open Sidebar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
            
            <!-- Navigation Controls -->
            <div style="display: flex; gap: 8px;">
                <button class="btn-secondary btn-header-back" title="Go Home" style="width: 36px; height: 36px; padding:0; border-radius: var(--radius-full); display: flex;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
            </div>
        </div>

        <div class="header-nav">
            <div class="search-input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="global-search-input" class="search-bar" placeholder="Search songs, artists, albums...">
            </div>
        </div>

        <div class="header-actions">
            <div class="stats-badge font-mono" style="font-size:11px;">
                Streamify <span>Premium</span>
            </div>
        </div>
    `;

    // Connect mobile menu toggle
    const toggleBtn = header.querySelector('#btn-mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('mobile-visible');
        });
        
        // Clicking outside closes the mobile sidebar drawer
        document.body.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-visible');
            }
        });
    }

    // Connect header back home
    const backBtn = header.querySelector('.btn-header-back');
    if (backBtn) {
        backBtn.style.visibility = store.currentView === 'home' ? 'hidden' : 'visible';
        backBtn.addEventListener('click', () => {
            const input = document.getElementById('global-search-input');
            if (input) input.value = '';
            store.setView('home');
        });
    }

    // Global Search Input change actions
    const searchInput = header.querySelector('#global-search-input');
    if (searchInput) {
        // Sync search input with active queries if returning to search
        if (store.currentView === 'search') {
            // Maintain focus and cursor
        }

        searchInput.addEventListener('input', () => {
            const query = searchInput.value;
            if (query.trim()) {
                if (store.currentView !== 'search') {
                    store.setView('search');
                } else {
                    renderActiveView(); // re-render search with query
                }
            } else {
                // If cleared
                renderActiveView();
            }
        });

        // Trigger history records on pressing Enter
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const term = searchInput.value.trim();
                if (term) {
                    store.addSearchTerm(term);
                    store.setView('search');
                }
            }
        });
    }
}

// Global initialization
let appInitialized = false;
function initApp() {
    if (appInitialized) return;
    appInitialized = true;

    // 1. Initial renders
    renderHeader();
    renderSidebar();
    renderBottomPlayer();
    renderActiveView();

    // 2. Subscribe active view updates to state store mutations
    store.subscribe((s) => {
        renderActiveView();
        
        // Keep header back button visibility sync'd
        const backBtn = document.querySelector('.btn-header-back');
        if (backBtn) {
            backBtn.style.visibility = s.currentView === 'home' ? 'hidden' : 'visible';
        }

        // Keep search input cleared if navigates away from search view
        if (s.currentView !== 'search') {
            const input = document.getElementById('global-search-input');
            if (input && input.value !== '') input.value = '';
        }
    });

    // 3. Connect sidebar hidden upload input listener
    const fileInput = document.getElementById('sidebar-hidden-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                handleUploadFiles(fileInput.files);
            }
        });
    }

    // 4. Set up central audio error handlers for notification
    player.subscribe((p, event) => {
        if (event.type === 'error') {
            showToast(`Playback Error: ${event.error}`);
        }
    });

    // 5. Accessible Keyboard Controls
    document.addEventListener('keydown', (e) => {
        // Only bind if user is not typing in input fields
        const activeTag = document.activeElement.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
            return;
        }

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                player.togglePlay();
                showToast(player.isPlaying ? 'Paused' : 'Playing');
                break;
            case 'ArrowRight':
                if (e.ctrlKey) {
                    e.preventDefault();
                    player.next();
                    showToast('Next Song');
                }
                break;
            case 'ArrowLeft':
                if (e.ctrlKey) {
                    e.preventDefault();
                    player.previous();
                    showToast('Previous Song');
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                player.setVolume(player.volume + 0.05);
                showToast(`Volume: ${Math.round(player.volume * 100)}%`);
                break;
            case 'ArrowDown':
                e.preventDefault();
                player.setVolume(player.volume - 0.05);
                showToast(`Volume: ${Math.round(player.volume * 100)}%`);
                break;
        }
    });

    console.log('RESONATE initialized successfully.');
}

// Start application
document.addEventListener('DOMContentLoaded', initApp);
// If page was already loaded (module hot swap)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initApp();
}
