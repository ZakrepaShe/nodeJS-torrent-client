import { Buffer } from 'buffer';
import crypto from 'crypto';

let id = null;

export const genId = () => {
  if (!id) {
    id = crypto.randomBytes(20);
    Buffer.from('-SZ0001-').copy(id, 0);
  }
  return id;
};

export function bigIntToBuffer(bigint, size) {
  // Ensure the bigint is positive for Buffer allocation
  if (bigint < 0) throw new RangeError('BigInt must be non-negative');

  // Convert the BigInt to a hex string
  let hex = bigint.toString(16);

  // Ensure the hex string has an even number of characters
  if (hex.length % 2) hex = '0' + hex;

  // Convert the hex string to a Buffer
  let buffer = Buffer.from(hex, 'hex');

  // Pad the buffer with leading zeros to the desired size
  if (buffer.length < size) {
    const padding = Buffer.alloc(size - buffer.length);
    buffer = Buffer.concat([padding, buffer]);
  } else if (buffer.length > size) {
    throw new RangeError('BigInt is too large for the specified size');
  }

  return buffer;
}

export const parseUrl = str => {
  const url = new URL(str.replace(/^udp:/, 'http:'))

  if (str.match(/^udp:/)) {
    Object.defineProperties(url, {
      href: { value: url.href.replace(/^http/, 'udp') },
      protocol: { value: url.protocol.replace(/^http/, 'udp') },
      origin: { value: url.origin.replace(/^http/, 'udp') }
    })
  }

  return url
}

export const unit8ArrayToString = (unit8Array) => Buffer.from(unit8Array.buffer).toString()
