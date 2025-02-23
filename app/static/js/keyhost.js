import {convertToHex} from './utils/convertions.js';

async function generateAESGCMKey() {
    const key = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
}

async function exportKey(key) {
    const rawKey = await window.crypto.subtle.exportKey("raw", key);
    return new Uint8Array(rawKey);
}

async function createDecryptionKey() {
    try {
        const rawKey = await generateAESGCMKey();
        const exportedKey = await exportKey(rawKey);
        const hexKey = convertToHex(exportedKey);
        
        const response = await fetch('/api/set_decryption_key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: hexKey }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        console.log('Decryption key successfully sent to the server.');
    } catch (error) {
        console.error('Error creating decryption key:', error);
    }
}


async function getdDecryptionKey() {
    try {
        const response = await fetch('/api/get_decryption_key');
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        const hexKey = data.key;
        const key = hexToUint8Array(hexKey);

        return key;
    } catch (error) {
        console.error('Error getting decryption key:', error);
    }
}
createDecryptionKey();
