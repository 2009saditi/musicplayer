/* RESONATE - Central Audio Controller */
import { store } from './store.js';
import { getTrackBlob } from './database.js';

class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.isLoading = false;
        this.currentTrackId = null;
        this.currentBlobUrl = null;
        this.pendingRequestId = 0;
        this.playRequestId = 0;
        
        // Playback Preferences
        this.shuffle = localStorage.getItem('resonate_shuffle') === 'true';
        this.repeat = localStorage.getItem('resonate_repeat') || 'none'; // 'none' | 'track' | 'queue'
        
        // Volume state (default 80%)
        const savedVolume = localStorage.getItem('resonate_volume');
        this.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.8;
        this.audio.volume = this.volume;
        
        // Listeners for UI state syncing
        this.listeners = [];
        
        // Shuffle play history (to avoid repeating tracks in shuffle)
        this.shuffleHistory = [];

        this.initAudioListeners();
    }

    initAudioListeners() {
        this.audio.addEventListener('loadstart', () => {
            this.isLoading = true;
            this.notify({ type: 'loading' });
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.isLoading = false;
            this.notify({ type: 'loadedmetadata', duration: this.audio.duration });
        });

        this.audio.addEventListener('canplay', () => {
            this.isLoading = false;
            this.notify({ type: 'canplay' });
        });

        this.audio.addEventListener('waiting', () => {
            this.isLoading = true;
            this.notify({ type: 'waiting' });
        });

        this.audio.addEventListener('stalled', () => {
            this.isLoading = true;
            this.notify({ type: 'stalled' });
        });

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.isLoading = false;
            this.notify({ type: 'playing' });
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.notify({ type: 'pause' });
        });

        this.audio.addEventListener('timeupdate', () => {
            this.notify({ type: 'timeupdate', currentTime: this.audio.currentTime });
        });

        this.audio.addEventListener('durationchange', () => {
            this.notify({ type: 'durationchange', duration: this.audio.duration });
        });

        this.audio.addEventListener('ended', () => {
            this.handleSongEnded();
        });

        this.audio.addEventListener('error', (e) => {
            const message = e?.error?.message || 'Failed to play audio stream.';
            if (message.includes('interrupted') || message.includes('AbortError')) {
                return;
            }
            console.error('Audio playback error:', e);
            this.notify({ type: 'error', error: 'Failed to play audio stream.' });
        });
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify(data = {}) {
        this.listeners.forEach(callback => callback(this, data));
    }

    // ----------------------------------------------------
    // PLAYBACK INTERACTIONS
    // ----------------------------------------------------
    async playSong(trackId) {
        const song = store.getSongById(trackId);
        if (!song) return;

        const requestId = ++this.playRequestId;
        this.pendingRequestId = requestId;
        this.currentTrackId = song.id;
        store.setCurrentTrack(song.id);

        try {
            this.isLoading = true;
            this.notify({ type: 'loading' });

            // Reset source and progress cleanly before loading the next song.
            if (this.currentBlobUrl) {
                URL.revokeObjectURL(this.currentBlobUrl);
                this.currentBlobUrl = null;
            }

            this.audio.pause();
            this.audio.src = '';
            this.audio.removeAttribute('src');
            this.audio.load();
            this.audio.currentTime = 0;

            if (song.id.startsWith('demo-')) {
                this.audio.src = song.audioUrl;
            } else {
                const blob = await getTrackBlob(song.id);
                if (requestId !== this.playRequestId) return;
                if (!blob) {
                    throw new Error('Local audio file not found in database.');
                }
                this.currentBlobUrl = URL.createObjectURL(blob);
                this.audio.src = this.currentBlobUrl;
            }

            if (requestId !== this.playRequestId) return;

            this.audio.load();
            this.audio.currentTime = 0;
            await this.audio.play();
            if (requestId !== this.playRequestId) return;

            store.addRecentlyPlayed(song.id);

            const qIndex = store.queue.indexOf(song.id);
            if (qIndex !== -1) {
                store.queueIndex = qIndex;
                store.save();
            } else {
                store.setQueue([song], 0);
            }

            this.notify({ type: 'trackchange', song });
        } catch (err) {
            if (requestId !== this.playRequestId) return;
            if (err && err.name !== 'AbortError') {
                console.error('Playback trigger error:', err);
                this.notify({ type: 'error', error: err.message || 'Failed to play audio stream.' });
            }
        }
    }

    togglePlay() {
        if (this.isLoading) {
            this.playRequestId += 1;
            this.pendingRequestId = this.playRequestId;
            this.audio.pause();
            this.isLoading = false;
            this.isPlaying = false;
            this.notify({ type: 'pause' });
            return;
        }

        if (!this.audio.src) {
            const songId = store.getCurrentTrack()?.id || store.queue[store.queueIndex] || 'demo-1';
            this.playSong(songId);
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
        } else {
            const requestId = ++this.playRequestId;
            this.pendingRequestId = requestId;
            this.audio.play().catch(err => {
                if (requestId !== this.playRequestId) return;
                if (err && err.name === 'AbortError') return;
                console.error('Play resume error:', err);
                this.notify({ type: 'error', error: 'Failed to resume playback.' });
            });
        }
    }

    next() {
        if (store.queue.length === 0) return;

        if (this.repeat === 'track') {
            // Repeat current track
            this.seek(0);
            this.audio.play().catch(() => {});
            return;
        }

        let nextIndex = store.queueIndex + 1;

        if (this.shuffle) {
            // Select random track index
            nextIndex = this.getRandomShuffleIndex();
        } else {
            // Regular sequence
            if (nextIndex >= store.queue.length) {
                if (this.repeat === 'queue') {
                    nextIndex = 0; // loop back
                } else {
                    return; // stop playback at end of queue
                }
            }
        }

        const nextSongId = store.queue[nextIndex];
        if (nextSongId) {
            store.queueIndex = nextIndex;
            store.save();
            this.playSong(nextSongId);
        }
    }

    previous() {
        if (store.queue.length === 0) return;

        // If played more than 3 seconds, restart current track
        if (this.audio.currentTime > 3) {
            this.seek(0);
            return;
        }

        let prevIndex = store.queueIndex - 1;

        if (this.shuffle) {
            // Pop from shuffle history if available
            if (this.shuffleHistory.length > 1) {
                this.shuffleHistory.pop(); // remove current
                prevIndex = this.shuffleHistory.pop(); // get previous
            } else {
                prevIndex = this.getRandomShuffleIndex();
            }
        } else {
            if (prevIndex < 0) {
                if (this.repeat === 'queue') {
                    prevIndex = store.queue.length - 1;
                } else {
                    prevIndex = 0; // restart first song
                }
            }
        }

        const prevSongId = store.queue[prevIndex];
        if (prevSongId) {
            store.queueIndex = prevIndex;
            store.save();
            this.playSong(prevSongId);
        }
    }

    seek(seconds) {
        if (this.audio.src) {
            this.audio.currentTime = seconds;
        }
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        this.audio.volume = this.volume;
        localStorage.setItem('resonate_volume', this.volume.toString());
        this.notify();
    }

    toggleShuffle() {
        this.shuffle = !this.shuffle;
        localStorage.setItem('resonate_shuffle', this.shuffle.toString());
        this.shuffleHistory = []; // Reset history on toggle
        this.notify();
    }

    toggleRepeat() {
        const modes = ['none', 'queue', 'track'];
        const nextIdx = (modes.indexOf(this.repeat) + 1) % modes.length;
        this.repeat = modes[nextIdx];
        localStorage.setItem('resonate_repeat', this.repeat);
        this.notify();
    }

    // ----------------------------------------------------
    // HELPERS
    // ----------------------------------------------------
    handleSongEnded() {
        if (this.repeat === 'track') {
            this.seek(0);
            this.audio.play().catch(() => {});
        } else {
            this.next();
        }
    }

    getRandomShuffleIndex() {
        const len = store.queue.length;
        if (len <= 1) return 0;
        
        // Track shuffle history to prevent quick repeats
        if (this.shuffleHistory.length >= len) {
            this.shuffleHistory = [];
        }
        
        let randIdx;
        let attempts = 0;
        do {
            randIdx = Math.floor(Math.random() * len);
            attempts++;
        } while (
            (this.shuffleHistory.includes(randIdx) || randIdx === store.queueIndex) && 
            attempts < 100
        );

        this.shuffleHistory.push(randIdx);
        return randIdx;
    }

    getPlayingTrack() {
        const songId = this.currentTrackId || store.queue[store.queueIndex] || store.getCurrentTrack()?.id;
        return songId ? store.getSongById(songId) : null;
    }

    getCurrentTime() {
        return this.audio.currentTime;
    }

    getDuration() {
        // Fallback to pre-loaded duration if audio metadata is not loaded yet
        if (!isNaN(this.audio.duration) && this.audio.duration > 0) {
            return this.audio.duration;
        }
        const activeTrack = this.getPlayingTrack();
        return activeTrack ? activeTrack.duration : 0;
    }
}

export const player = new AudioPlayer();
export default player;
