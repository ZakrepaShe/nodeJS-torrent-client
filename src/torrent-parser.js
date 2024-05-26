import fs from 'fs';
import bencode from 'bencode';
import crypto from 'crypto';
import { bigIntToBuffer } from './util.js';


export const open = (filepath) => {
  return bencode.decode(fs.readFileSync(filepath));
};

export const size = torrent => {
  const size = torrent.info.files ?
    torrent.info.files.map(file => file.length).reduce((a, b) => a + b) :
    torrent.info.length;

  return bigIntToBuffer(BigInt(size), 8);
};

export const infoHash = torrent => {
  const info = bencode.encode(torrent.info);
  return crypto.createHash('sha1').update(info).digest();
};


