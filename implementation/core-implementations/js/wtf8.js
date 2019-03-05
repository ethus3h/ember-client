// Based on https://web.archive.org/web/20190305073920/https://github.com/mathiasbynens/wtf-8/blob/58c6b976c6678144d180b2307bee5615457e2cc7/wtf-8.js
// This code for wtf8 is included under the following license (from https://web.archive.org/web/20190305074047/https://github.com/mathiasbynens/wtf-8/blob/58c6b976c6678144d180b2307bee5615457e2cc7/LICENSE-MIT.txt):
/*
Copyright Mathias Bynens <https://mathiasbynens.be/>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Encoding
function intArrayPackWtf8(integerValue) {
    let createByte = function(integerValue, shift) {
        return String.fromCharCode(((integerValue >> shift) & 0x3F) | 0x80);
    }

    if ((integerValue & 0xFFFFFF80) == 0) { // 1-byte sequence
        return String.fromCharCode(integerValue);
    }
    let symbol = '';
    if ((integerValue & 0xFFFFF800) == 0) { // 2-byte sequence
        symbol = String.fromCharCode(((integerValue >> 6) & 0x1F) | 0xC0);
    }
    else if ((integerValue & 0xFFFF0000) == 0) { // 3-byte sequence
        symbol = String.fromCharCode(((integerValue >> 12) & 0x0F) | 0xE0);
        symbol += createByte(integerValue, 6);
    }
    else if ((integerValue & 0xFFE00000) == 0) { // 4-byte sequence
        symbol = String.fromCharCode(((integerValue >> 18) & 0x07) | 0xF0);
        symbol += createByte(integerValue, 12);
        symbol += createByte(integerValue, 6);
    }
    symbol += String.fromCharCode((integerValue & 0x3F) | 0x80);
    let res = [];
    let len = symbol.length;
    let i = 0;
    while (i<len) {
        res.push(symbol.charCodeAt(i));
        i = i+1;
    }
    return res;
}

//Decoding
function intUnpackWtf8(byteArrayInput) {
    let byteIndex = 0;
    let byteCount = byteArrayInput.length;
    let readContinuationByte = function() {
        if (byteIndex >= byteCount) {
            throw Error('Invalid byte index');
        }

        let continuationByte = byteArrayInput[byteIndex] & 0xFF;
        byteIndex++;

        if ((continuationByte & 0xC0) == 0x80) {
            return continuationByte & 0x3F;
        }

        // If we end up here, it’s not a continuation byte.
        throw Error('Invalid continuation byte');
    }

    let byte1;
    let byte2;
    let byte3;
    let byte4;
    let integerValue;

    if (byteIndex > byteCount) {
        throw Error('Invalid byte index');
    }

    if (byteIndex == byteCount) {
        return false;
    }

    // Read the first byte.
    byte1 = byteArrayInput[byteIndex] & 0xFF;
    byteIndex++;

    // 1-byte sequence (no continuation bytes)
    if ((byte1 & 0x80) == 0) {
        return byte1;
    }

    // 2-byte sequence
    if ((byte1 & 0xE0) == 0xC0) {
        let byte2 = readContinuationByte();
        integerValue = ((byte1 & 0x1F) << 6) | byte2;
        if (integerValue >= 0x80) {
            return integerValue;
        } else {
            throw Error('Invalid continuation byte');
        }
    }

    // 3-byte sequence (may include unpaired surrogates)
    if ((byte1 & 0xF0) == 0xE0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        integerValue = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
        if (integerValue >= 0x0800) {
            return integerValue;
        } else {
            throw Error('Invalid continuation byte');
        }
    }

    // 4-byte sequence
    if ((byte1 & 0xF8) == 0xF0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        byte4 = readContinuationByte();
        integerValue = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
            (byte3 << 0x06) | byte4;
        if (integerValue >= 0x010000 && integerValue <= 0x10FFFF) {
            return integerValue;
        }
    }

    throw Error('Invalid WTF-8 detected');
}
