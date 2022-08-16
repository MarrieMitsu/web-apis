function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str));
}

function UnicodeDecodeB64(str) {
    return decodeURIComponent(atob(str));
}

const encodeInputEl = document.getElementById('encode-input');
const encodeOutputEl = document.getElementById('encode-output');

encodeInputEl.addEventListener('input', (e) => {
    const encoded = b64EncodeUnicode(e.target.value);
    encodeOutputEl.textContent = `Output: ${encoded}`;
});

const decodeInputEl = document.getElementById('decode-input');
const decodeOutputEl = document.getElementById('decode-output');

decodeInputEl.addEventListener('input', (e) => {
    try {
        const decoded = UnicodeDecodeB64(e.target.value);
        decodeOutputEl.textContent = `Output: ${decoded}`;
    } catch (error) {
        return true;
    }
});