"use strict"

// 6-bit unsigned integer to base-64
function uint6ToB64(nUint6) {
    if (nUint6 < 26) {
        return nUint6 + 65;
    } else if (nUint6 < 52) {
        return nUint6 + 71;
    } else if (nUint6 < 62) {
        return nUint6 - 4;
    } else if (nUint6 === 62) {
        return 43;
    } else if (nUint6 === 63) {
        return 47;
    } else {
        return 65;
    }
}

// base-64 to 6-bit unsigned integer
function b64ToUint6(nChr) {
    if (nChr > 64 && nChr < 91) {
        return nChr - 65;
    } else if (nChr > 96 && nChr < 123) {
        return nChr - 71;
    } else if (nChr > 47 && nChr < 58) {
        return nChr + 4;
    } else if (nChr === 34) {
        return 62;
    } else if (nChr === 47) {
        return 63;
    } else {
        return 0;
    }
}

// base-64 array encoding
function base64EncArr(aBytes) {
    let nMod3 = 2;
    let sB64Enc ="";

    const nLen = aBytes.length;
    let nUint24 = 0;
    for (let nIdx = 0; nIdx < nLen; nIdx++) {
        nMod3 = nIdx % 3;
        if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) {
            sB64Enc += "\r\n";
        }

        nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
        if (nMod3 === 2 || aBytes.length - nIdx === 1) {
            sB64Enc += String.fromCodePoint(
                uint6ToB64(nUint24 >>> 18 & 63),
                uint6ToB64(nUint24 >>> 12 & 63),
                uint6ToB64(nUint24 >>> 6 & 63),
                uint6ToB64(nUint24 & 63),
            );
            nUint24 = 0;
        }
    }

    const pad = (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');

    return sB64Enc.substring(0, sB64Enc.length - 2 + nMod3) + pad;

}

// base-64 decoding to array
function base64DecToArr(sBase64, nBlocksSize) {
    const sB64Enc = sBase64.replace(/[^A-Za-z0-9+/]/g, "");
    const nInLen = sB64Enc.length;
    const nOutLen = nBlocksSize 
        ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize
        : nInLen * 3 + 1 >> 2;
    const taBytes = new Uint8Array(nOutLen);

    let nMod3;
    let nMod4;
    let nUint24 = 0;
    let nOutIdx = 0;
    for (let nInIdx = 0; nInIdx < nInLen; nInIdx++) {
        nMod4 = nInIdx & 3;
        nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 6 * (3 - nMod4);

        if (nMod4 === 3 || nInLen - nInIdx === 1) {
            nMod3 = 0;
            while (nMod3 < 3 && nOutIdx < nOutLen) {
                taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                nMod3++;
                nOutIdx++;
            }
            nUint24 = 0;
        }
    }

    return taBytes;
}

// JS string to UTF-8 array
function strToUTF8Arr(sDOMStr) {
    sDOMStr = new String(sDOMStr);
    let aBytes;
    let nChr;
    const nStrLen = sDOMStr.length;
    let nArrLen = 0;

    // Mapping
    for (let nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
        nChr = sDOMStr.codePointAt(nMapIdx);

        if (nChr > 65536) {
            continue;
        }

        if (nChr < 0x80) {
            // 0x80 = 128
            nArrLen += 1;
        } else if (nChr < 0x800) {
            // 0x800 = 2048
            nArrLen += 2;
        } else if (nChr < 0x10000) {
            // 0x10000 = 65536
            nArrLen += 3;
        } else if (nChr < 0x200000) {
            // 0x200000 = 2097152
            nArrLen += 4;
        } else if (nChr < 0x4000000) {
            // 0x4000000 = 67108864
            nArrLen += 5;
        } else {
            nArrLen += 6;
        }

    }

    aBytes = new Uint8Array(nArrLen);

    // Transcription
    let nIdx = 0;
    let nChrIdx = 0;
    while (nIdx < nArrLen) {
        nChr = sDOMStr.codePointAt(nChrIdx);
        if (nChr < 0x80) {
            // one byte
            aBytes[nIdx++] = nChr;
        } else if (nChr < 0x800) {
            // two bytes
            aBytes[nIdx++] = 192 + (nChr >>> 6);
            aBytes[nIdx++] = 128 + (nChr & 63);
        } else if (nChr < 0x10000) {
            // three bytes
            aBytes[nIdx++] = 224 + (nChr >>> 12);
            aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
        } else if (nChr < 0x200000) {
            // four bytes
            aBytes[nIdx++] = 224 + (nChr >>> 18);
            aBytes[nIdx++] = 224 + (nChr >>> 12 & 63);
            aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
            nChrIdx++;
        } else if (nChr < 0x4000000) {
            // five bytes
            aBytes[nIdx++] = 224 + (nChr >>> 24);
            aBytes[nIdx++] = 224 + (nChr >>> 18 & 63);
            aBytes[nIdx++] = 224 + (nChr >>> 12 & 63);
            aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
            nChrIdx++;
        } else {
            // six bytes
            aBytes[nIdx++] = 224 + (nChr >>> 30);
            aBytes[nIdx++] = 224 + (nChr >>> 24 & 63);
            aBytes[nIdx++] = 224 + (nChr >>> 18 & 63);
            aBytes[nIdx++] = 224 + (nChr >>> 12 & 63);
            aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
            nChrIdx++;
        }
        nChrIdx++;
    }

    return aBytes;
}

// UTF-8 array to JS string
function UTF8ArrToStr(aBytes) {
    let sView = "";
    let nPart;
    const nLen = aBytes.length;

    for (let nIdx = 0; nIdx < nLen; nIdx++) {
        nPart = aBytes[nIdx];
        
        if (nPart > 251 && nPart < 254 && nIdx + 5 < nLen) {
            // six bytes
            // (nPart - 252 << 30) may be not so safe in ECMAScript! So…:
            sView += String.fromCodePoint((nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128);
        } else if (nPart > 247 && nPart < 252 && nIdx + 4 < nLen) {
            // five bytes
            sView += String.fromCodePoint((nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128);
        } else if (nPart > 239 && nPart < 248 && nIdx + 3 < nLen) {
            // four bytes
            sView += String.fromCodePoint((nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128);
        } else if (nPart > 223 && nPart < 240 && nIdx + 2 < nLen) {
            // three bytes
            sView += String.fromCodePoint((nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128);
        } else if (nPart > 191 && nPart < 224 && nIdx + 1 < nLen) {
            // two bytes
            sView += String.fromCodePoint((nPart - 192 << 6) + aBytes[++nIdx] - 128);
        } else {
            // nPart < 127 ? one byte
            sView += String.fromCodePoint(nPart);
        }
    }

    return sView;
}

// run
const encodeInputEl = document.getElementById('encode-input');
const encodeOutputEl = document.getElementById('encode-output');

encodeInputEl.addEventListener('input', (e) => {
    const encoded = base64EncArr(strToUTF8Arr(e.target.value));
    encodeOutputEl.textContent = `Output: ${encoded}`;
});

const decodeInputEl = document.getElementById('decode-input');
const decodeOutputEl = document.getElementById('decode-output');

decodeInputEl.addEventListener('input', (e) => {
    try {
        const decoded = UTF8ArrToStr(base64DecToArr(e.target.value));
        decodeOutputEl.textContent = `Output: ${decoded}`;
    } catch (error) {
        return true;
    }
});