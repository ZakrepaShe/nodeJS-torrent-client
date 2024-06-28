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
