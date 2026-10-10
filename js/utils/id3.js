/* RESONATE - Pure Vanilla JS ID3v2 Metadata Parser */

/**
 * Parses ID3v2 tags from an audio File object
 * @param {File} file - The file to parse
 * @returns {Promise<Object|null>} The parsed metadata (title, artist, album, genre, coverUrl) or null
 */
export async function parseID3Tags(file) {
    // Read the first 128 KB of the file (ID3 header is at the beginning)
    const scanSize = 128 * 1024;
    const slice = file.slice(0, scanSize);
    
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const arrayBuffer = e.target.result;
                const view = new DataView(arrayBuffer);
                const bytes = new Uint8Array(arrayBuffer);
                
                // 1. Check for ID3 Header ("ID3" at index 0, 1, 2)
                if (bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) {
                    resolve(null);
                    return;
                }
                
                const majorVersion = bytes[3];
                if (majorVersion !== 3 && majorVersion !== 4) {
                    // Only support popular v2.3 and v2.4
                    resolve(null);
                    return;
                }
                
                // Header length = 10 bytes
                // The size is a synchsafe integer (7 bits per byte, high bit is 0)
                const tagSize = ((bytes[6] & 0x7F) << 21) |
                                ((bytes[7] & 0x7F) << 14) |
                                ((bytes[8] & 0x7F) << 7)  |
                                (bytes[9] & 0x7F);
                
                let offset = 10;
                const metadata = {};
                const limit = Math.min(tagSize + 10, bytes.length);
                
                const decoderISO = new TextDecoder('iso-8859-1');
                const decoderUTF8 = new TextDecoder('utf-8');
                const decoderUTF16 = new TextDecoder('utf-16');
                
                function readString(startOffset, length, encoding) {
                    const strBytes = bytes.subarray(startOffset, startOffset + length);
                    
                    // Filter out trailing null bytes
                    let end = strBytes.length;
                    while (end > 0 && strBytes[end - 1] === 0) {
                        end--;
                    }
                    const activeBytes = strBytes.slice(0, end);
                    
                    if (encoding === 0) {
                        return decoderISO.decode(activeBytes).trim();
                    } else if (encoding === 1) {
                        // UTF-16, check BOM
                        let start = 0;
                        if (activeBytes[0] === 0xFF && activeBytes[1] === 0xFE) start = 2;
                        if (activeBytes[0] === 0xFE && activeBytes[1] === 0xFF) {
                            const decoderUTF16BE = new TextDecoder('utf-16be');
                            return decoderUTF16BE.decode(activeBytes.slice(2)).trim();
                        }
                        return decoderUTF16.decode(activeBytes.slice(start)).trim();
                    } else if (encoding === 2) {
                        const decoderUTF16BE = new TextDecoder('utf-16be');
                        return decoderUTF16BE.decode(activeBytes).trim();
                    } else if (encoding === 3) {
                        return decoderUTF8.decode(activeBytes).trim();
                    }
                    return decoderISO.decode(activeBytes).trim();
                }
                
                while (offset < limit - 10) {
                    // Frame ID (4-character string)
                    const frameID = String.fromCharCode(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]);
                    
                    // Empty or invalid frames signify end
                    if (frameID === '\x00\x00\x00\x00' || !/^[A-Z0-9]{4}$/.test(frameID)) {
                        break;
                    }
                    
                    let frameSize = 0;
                    if (majorVersion === 4) {
                        // v2.4 frames use synchsafe integers for size
                        frameSize = ((bytes[offset+4] & 0x7F) << 21) |
                                    ((bytes[offset+5] & 0x7F) << 14) |
                                    ((bytes[offset+6] & 0x7F) << 7)  |
                                    (bytes[offset+7] & 0x7F);
                    } else {
                        // v2.3 frames use standard 32-bit big-endian integer
                        frameSize = (bytes[offset+4] << 24) |
                                    (bytes[offset+5] << 16) |
                                    (bytes[offset+6] << 8)  |
                                    bytes[offset+7];
                    }
                    
                    const frameStart = offset + 10;
                    if (frameStart + frameSize > limit) {
                        break;
                    }
                    
                    if (frameSize > 1) {
                        const encoding = bytes[frameStart];
                        
                        if (frameID === 'TIT2') {
                            metadata.title = readString(frameStart + 1, frameSize - 1, encoding);
                        } else if (frameID === 'TPE1') {
                            metadata.artist = readString(frameStart + 1, frameSize - 1, encoding);
                        } else if (frameID === 'TALB') {
                            metadata.album = readString(frameStart + 1, frameSize - 1, encoding);
                        } else if (frameID === 'TCON') {
                            metadata.genre = readString(frameStart + 1, frameSize - 1, encoding);
                        } else if (frameID === 'APIC') {
                            try {
                                // APIC Structure:
                                // [Encoding] (1B)
                                // [MIME Type] (Null-terminated ASCII string)
                                // [Picture Type] (1B, e.g. 0x03 is Front Cover)
                                // [Description] (Null-terminated string based on encoding)
                                // [Picture Binary Data]
                                
                                let cur = frameStart + 1;
                                
                                // Read MIME Type (ASCII null-terminated)
                                let mime = '';
                                while (cur < frameStart + frameSize && bytes[cur] !== 0) {
                                    mime += String.fromCharCode(bytes[cur]);
                                    cur++;
                                }
                                cur++; // Skip null byte
                                
                                const pictureType = bytes[cur];
                                cur++; // Skip picture type
                                
                                // Skip Description string (null-terminated according to encoding)
                                if (encoding === 1 || encoding === 2) {
                                    // UTF-16 null-termination is 2 zero bytes (aligned)
                                    while (cur < frameStart + frameSize - 1 && !(bytes[cur] === 0 && bytes[cur+1] === 0)) {
                                        cur++;
                                    }
                                    cur += 2; // Skip 2 null bytes
                                } else {
                                    // Single byte null termination
                                    while (cur < frameStart + frameSize && bytes[cur] !== 0) {
                                        cur++;
                                    }
                                    cur++; // Skip null byte
                                }
                                
                                const dataLength = (frameStart + frameSize) - cur;
                                if (dataLength > 0 && cur < frameStart + frameSize) {
                                    const imgBytes = bytes.subarray(cur, cur + dataLength);
                                    // Create a copy of the slice to avoid GC issues when arraybuffer changes
                                    const imgBlob = new Blob([new Uint8Array(imgBytes)], { type: mime || 'image/jpeg' });
                                    metadata.coverUrl = URL.createObjectURL(imgBlob);
                                    
                                    // Store raw image data details to recreate it on page reload if needed
                                    metadata._rawCover = {
                                        type: imgBlob.type,
                                        bytes: Array.from(new Uint8Array(imgBytes)) // Small enough for single files, but wait, this might exceed localStorage if large
                                    };
                                    // Actually, rather than saving raw cover in local storage (too huge!), we will just save the track info,
                                    // and we can read the file back from IndexedDB on page load to extract the cover again!
                                    // That is a much cleaner and memory-efficient architecture.
                                }
                            } catch (apicErr) {
                                console.error('APIC frame parse error:', apicErr);
                            }
                        }
                    }
                    
                    offset += 10 + frameSize;
                }
                
                resolve(metadata);
            } catch (err) {
                console.error('ID3 Parser Error:', err);
                resolve(null);
            }
        };
        reader.onerror = () => resolve(null);
        reader.readAsArrayBuffer(slice);
    });
}
