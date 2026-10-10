/* RESONATE - Global Application State Store */

// 20 Initial Demo Songs with unique metadata and Unsplash artwork
const DEMO_SONGS = [
    {
        id: 'demo-1',
        title: 'Midnight Signal',
        artist: 'The Nocturnes',
        album: 'Starlight Echoes',
        genre: 'Electronic',
        duration: 373,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-2',
        title: 'Paper Planes',
        artist: 'Kite Season',
        album: 'Wind & Water',
        genre: 'Indie',
        duration: 367,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-3',
        title: 'Neon Harbor',
        artist: 'Violet Static',
        album: 'Cyber City Vibe',
        genre: 'Night',
        duration: 380,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-4',
        title: 'Slow Tide',
        artist: 'Marlow Bay',
        album: 'Ocean Blue',
        genre: 'Chill',
        duration: 392,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-5',
        title: 'Copper Sky',
        artist: 'Ada & the Owls',
        album: 'Autumn Trees',
        genre: 'Indie',
        duration: 415,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-6',
        title: 'Little Machines',
        artist: 'Foxglove',
        album: 'Microchips',
        genre: 'Electronic',
        duration: 299,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-7',
        title: 'Ethereal Drift',
        artist: 'Lunar Phase',
        album: 'Orbit Trax',
        genre: 'Chill',
        duration: 428,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-8',
        title: 'Golden Echo',
        artist: 'Amber Sol',
        album: 'Sunshine Meadows',
        genre: 'Indie',
        duration: 338,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-9',
        title: 'Pulse Transit',
        artist: 'Vector Nine',
        album: 'Grid Runner',
        genre: 'Electronic',
        duration: 422,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-10',
        title: 'Velvet Dusk',
        artist: 'Stella Noir',
        album: 'Late Hours',
        genre: 'Night',
        duration: 348,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-11',
        title: 'Static Wave',
        artist: 'Noise Theory',
        album: 'Analogue Signals',
        genre: 'Electronic',
        duration: 362,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1453090927415-5f45085b65c0?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-12',
        title: 'Lost Highway',
        artist: 'Rodeo Drive',
        album: 'Dust Storms',
        genre: 'Indie',
        duration: 354,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1513829096990-4b228e120d5a?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-13',
        title: 'Pixel Horizon',
        artist: 'Glitch Kid',
        album: 'Bitrate Journey',
        genre: 'Electronic',
        duration: 404,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-14',
        title: 'Sinking Sand',
        artist: 'Coastal Tide',
        album: 'Coastline Erosion',
        genre: 'Chill',
        duration: 312,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-15',
        title: 'Cyber Stream',
        artist: 'Vector Prime',
        album: 'System Shell V2',
        genre: 'Electronic',
        duration: 273,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-16',
        title: 'Desert Rose',
        artist: 'Nomad Crew',
        album: 'Red Dunes',
        genre: 'Indie',
        duration: 378,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-17',
        title: 'Night Ride',
        artist: 'Retro Drive',
        album: 'Neon Horizon',
        genre: 'Night',
        duration: 330,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-18',
        title: 'Deep Chill',
        artist: 'Ocean Breeze',
        album: 'Salty Water',
        genre: 'Chill',
        duration: 285,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-19',
        title: 'Electric Rain',
        artist: 'Stormy Weather',
        album: 'Lightning Rod',
        genre: 'Electronic',
        duration: 315,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=300&h=300&q=80'
    },
    {
        id: 'demo-20',
        title: 'Indie Sky',
        artist: 'Cloud Nine',
        album: 'Blue Atmospheres',
        genre: 'Indie',
        duration: 365,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1510759402777-a83fcdd56cf1?auto=format&fit=crop&w=300&h=300&q=80'
    }
];

class StateStore {
    constructor() {
        this.listeners = [];
        this.init();
    }

    init() {
        // Load custom uploaded songs list
        this.uploadedSongs = JSON.parse(localStorage.getItem('resonate_uploaded_songs')) || [];
        
        // Load Liked Track IDs
        this.likedSongs = new Set(JSON.parse(localStorage.getItem('resonate_liked_songs')) || []);
        
        // Load Recently Played tracks: [{ id, timestamp }]
        this.recentlyPlayed = JSON.parse(localStorage.getItem('resonate_recently_played')) || [];
        
        // Load Playlists: [{ id, name, coverUrl, trackIds: [] }]
        this.playlists = JSON.parse(localStorage.getItem('resonate_playlists')) || [];
        
        // Load Downloaded Track IDs
        this.downloads = new Set(JSON.parse(localStorage.getItem('resonate_downloads')) || []);

        // Current active track for Featured and player sync
        this.currentTrackId = localStorage.getItem('resonate_current_track') || null;
        
        // Active play queue track IDs or objects
        this.queue = JSON.parse(localStorage.getItem('resonate_queue')) || [];
        this.queueIndex = parseInt(localStorage.getItem('resonate_queue_index')) || 0;
        
        // Recent searches list
        this.searchHistory = JSON.parse(localStorage.getItem('resonate_search_history')) || [];
        
        // Routing Navigation state
        this.currentView = 'home';
        this.currentViewParam = null; // Used for specific playlist IDs, albums, artists
        
        // Current selected/clicked genre filter in Home
        this.activeGenre = 'All';
    }

    // Save states to LocalStorage
    save() {
        localStorage.setItem('resonate_uploaded_songs', JSON.stringify(this.uploadedSongs));
        localStorage.setItem('resonate_liked_songs', JSON.stringify(Array.from(this.likedSongs)));
        localStorage.setItem('resonate_recently_played', JSON.stringify(this.recentlyPlayed));
        localStorage.setItem('resonate_playlists', JSON.stringify(this.playlists));
        localStorage.setItem('resonate_downloads', JSON.stringify(Array.from(this.downloads)));
        localStorage.setItem('resonate_current_track', this.currentTrackId || '');
        localStorage.setItem('resonate_queue', JSON.stringify(this.queue));
        localStorage.setItem('resonate_queue_index', this.queueIndex.toString());
        localStorage.setItem('resonate_search_history', JSON.stringify(this.searchHistory));
    }

    // Subscribe to state change notifications
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify() {
        this.save();
        this.listeners.forEach(callback => callback(this));
    }

    // ----------------------------------------------------
    // GETTERS
    // ----------------------------------------------------
    getAllSongs() {
        return [...DEMO_SONGS, ...this.uploadedSongs];
    }

    getSongById(id) {
        return this.getAllSongs().find(s => s.id === id);
    }

    getLikedSongs() {
        return this.getAllSongs().filter(s => this.likedSongs.has(s.id));
    }

    getUploadedSongs() {
        return this.uploadedSongs;
    }

    getRecentlyPlayed() {
        // Return fully resolved song objects, sorted by timestamp desc
        return this.recentlyPlayed
            .map(item => {
                const song = this.getSongById(item.id);
                return song ? { ...song, playedAt: item.timestamp } : null;
            })
            .filter(Boolean);
    }

    getDownloadedSongs() {
        return this.getAllSongs().filter(s => this.downloads.has(s.id));
    }

    getCurrentTrack() {
        if (this.currentTrackId) {
            return this.getSongById(this.currentTrackId) || this.getAllSongs()[0] || null;
        }
        if (this.queue.length > 0) {
            return this.getSongById(this.queue[this.queueIndex]) || this.getAllSongs()[0] || null;
        }
        return this.getAllSongs()[0] || null;
    }

    getPlaylists() {
        return this.playlists;
    }

    getPlaylistById(id) {
        return this.playlists.find(p => p.id === id);
    }

    getAlbums() {
        const albums = {};
        this.getAllSongs().forEach(song => {
            const albumName = song.album || 'Unknown Album';
            if (!albums[albumName]) {
                albums[albumName] = {
                    name: albumName,
                    artist: song.artist,
                    coverUrl: song.coverUrl,
                    songs: []
                };
            }
            albums[albumName].songs.push(song);
        });
        return Object.values(albums);
    }

    getArtists() {
        const artists = {};
        this.getAllSongs().forEach(song => {
            const artistName = song.artist || 'Unknown Artist';
            if (!artists[artistName]) {
                artists[artistName] = {
                    name: artistName,
                    coverUrl: song.coverUrl, // uses the cover of their first song as artist picture
                    songs: []
                };
            }
            artists[artistName].songs.push(song);
        });
        return Object.values(artists);
    }

    // ----------------------------------------------------
    // MUTATIONS
    // ----------------------------------------------------
    setView(view, param = null) {
        this.currentView = view;
        this.currentViewParam = param;
        this.notify();
    }

    setCurrentTrack(id) {
        if (!id) return;
        const song = this.getSongById(id);
        if (!song) return;
        this.currentTrackId = id;
        this.notify();
    }

    toggleLike(id) {
        if (this.likedSongs.has(id)) {
            this.likedSongs.delete(id);
        } else {
            this.likedSongs.add(id);
        }
        this.notify();
    }

    isLiked(id) {
        return this.likedSongs.has(id);
    }

    // History
    addRecentlyPlayed(id) {
        // Avoid duplicate rapid records, move to top
        this.recentlyPlayed = this.recentlyPlayed.filter(item => item.id !== id);
        this.recentlyPlayed.unshift({ id, timestamp: Date.now() });
        // Keep max 50 items
        if (this.recentlyPlayed.length > 50) {
            this.recentlyPlayed.pop();
        }
        this.notify();
    }

    clearHistory() {
        this.recentlyPlayed = [];
        this.notify();
    }

    // Play Queue Management
    setQueue(tracksList, activeIndex = 0) {
        this.queue = tracksList.map(t => t.id);
        this.queueIndex = activeIndex;
        this.notify();
    }

    addToQueue(track) {
        if (!this.queue.includes(track.id)) {
            this.queue.push(track.id);
            this.notify();
        }
    }

    playNext(track) {
        // Remove duplicate if exists
        this.queue = this.queue.filter(id => id !== track.id);
        // Insert after index
        const insertPos = this.queue.length === 0 ? 0 : this.queueIndex + 1;
        this.queue.splice(insertPos, 0, track.id);
        this.notify();
    }

    removeFromQueue(index) {
        if (index === this.queueIndex) {
            // Can't easily remove playing track without advancing, but let's allow it
        }
        this.queue.splice(index, 1);
        if (index < this.queueIndex && this.queueIndex > 0) {
            this.queueIndex--;
        }
        this.notify();
    }

    reorderQueue(fromIndex, toIndex) {
        if (fromIndex < 0 || fromIndex >= this.queue.length || toIndex < 0 || toIndex >= this.queue.length) return;
        const item = this.queue.splice(fromIndex, 1)[0];
        this.queue.splice(toIndex, 0, item);
        
        // Update queueIndex if it was moved
        if (this.queueIndex === fromIndex) {
            this.queueIndex = toIndex;
        } else if (fromIndex < this.queueIndex && toIndex >= this.queueIndex) {
            this.queueIndex--;
        } else if (fromIndex > this.queueIndex && toIndex <= this.queueIndex) {
            this.queueIndex++;
        }
        this.notify();
    }

    clearQueue() {
        const currentlyPlayingId = this.queue[this.queueIndex];
        if (currentlyPlayingId) {
            this.queue = [currentlyPlayingId];
            this.queueIndex = 0;
        } else {
            this.queue = [];
            this.queueIndex = 0;
        }
        this.notify();
    }

    // Playlists
    createPlaylist(name) {
        const id = 'playlist-' + Date.now();
        const playlist = {
            id,
            name,
            coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80',
            trackIds: []
        };
        this.playlists.push(playlist);
        this.notify();
        return playlist;
    }

    renamePlaylist(id, name) {
        const playlist = this.getPlaylistById(id);
        if (playlist) {
            playlist.name = name;
            this.notify();
        }
    }

    deletePlaylist(id) {
        this.playlists = this.playlists.filter(p => p.id !== id);
        if (this.currentView === 'playlist' && this.currentViewParam === id) {
            this.setView('home');
        }
        this.notify();
    }

    addTrackToPlaylist(playlistId, trackId) {
        const playlist = this.getPlaylistById(playlistId);
        if (playlist && !playlist.trackIds.includes(trackId)) {
            playlist.trackIds.push(trackId);
            // Update playlist cover with the added song's cover
            const song = this.getSongById(trackId);
            if (song && song.coverUrl) {
                playlist.coverUrl = song.coverUrl;
            }
            this.notify();
        }
    }

    removeTrackFromPlaylist(playlistId, trackId) {
        const playlist = this.getPlaylistById(playlistId);
        if (playlist) {
            playlist.trackIds = playlist.trackIds.filter(id => id !== trackId);
            // Update cover if needed
            if (playlist.trackIds.length > 0) {
                const firstSong = this.getSongById(playlist.trackIds[0]);
                if (firstSong) playlist.coverUrl = firstSong.coverUrl;
            } else {
                playlist.coverUrl = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80';
            }
            this.notify();
        }
    }

    // Uploaded Tracks Metadata
    addUploadedSong(song) {
        this.uploadedSongs.push(song);
        this.notify();
    }

    deleteUploadedSong(id) {
        this.uploadedSongs = this.uploadedSongs.filter(s => s.id !== id);
        this.likedSongs.delete(id);
        this.downloads.delete(id);
        this.queue = this.queue.filter(qid => qid !== id);
        
        // Remove from playlists
        this.playlists.forEach(playlist => {
            playlist.trackIds = playlist.trackIds.filter(tid => tid !== id);
        });
        
        this.notify();
    }

    updateUploadedMetadata(id, updatedMeta) {
        const songIndex = this.uploadedSongs.findIndex(s => s.id === id);
        if (songIndex !== -1) {
            this.uploadedSongs[songIndex] = {
                ...this.uploadedSongs[songIndex],
                ...updatedMeta
            };
            this.notify();
        }
    }

    // Downloads
    markDownloaded(id, isDownloaded) {
        if (isDownloaded) {
            this.downloads.add(id);
        } else {
            this.downloads.delete(id);
        }
        this.notify();
    }

    isDownloaded(id) {
        return this.downloads.has(id);
    }

    // Search History
    addSearchTerm(term) {
        term = term.trim();
        if (!term) return;
        this.searchHistory = this.searchHistory.filter(t => t.toLowerCase() !== term.toLowerCase());
        this.searchHistory.unshift(term);
        if (this.searchHistory.length > 10) this.searchHistory.pop();
        this.notify();
    }

    clearSearchHistory() {
        this.searchHistory = [];
        this.notify();
    }
}

export const store = new StateStore();
export { DEMO_SONGS };
