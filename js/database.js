/* RESONATE - IndexedDB Storage Helper for Audio Blobs */

const DB_NAME = 'ResonateDB';
const DB_VERSION = 1;
const STORE_NAME = 'tracks';

let dbInstance = null;

function getDB() {
    if (dbInstance) return Promise.resolve(dbInstance);

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = (event) => {
            dbInstance = event.target.result;
            resolve(dbInstance);
        };

        request.onerror = (event) => {
            console.error('IndexedDB open error:', event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Save audio file Blob to IndexedDB
 * @param {string} id - The track identifier (e.g. 'uploaded-171829283')
 * @param {Blob} blob - The raw audio file Blob
 */
export async function saveTrackBlob(id, blob) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(blob, id);

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);
    });
}

/**
 * Retrieve audio file Blob from IndexedDB
 * @param {string} id - The track identifier
 * @returns {Promise<Blob|null>} The audio file Blob or null if not found
 */
export async function getTrackBlob(id) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = (event) => resolve(event.target.result || null);
        request.onerror = (event) => reject(event.target.error);
    });
}

/**
 * Delete audio file Blob from IndexedDB
 * @param {string} id - The track identifier
 */
export async function deleteTrackBlob(id) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);
    });
}

/**
 * Clear all binary audio blobs from IndexedDB
 */
export async function clearAllBlobs() {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve(true);
        request.onerror = (event) => reject(event.target.error);
    });
}
