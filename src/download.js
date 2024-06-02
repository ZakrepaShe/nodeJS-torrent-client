import net from 'net';
import { Buffer } from 'buffer';
import * as message from './message.js';
import Pieces from './Pieces.js';
import * as tracker from './tracker.js';

export default function (torrent) {
  const pieces = new Pieces(torrent.info.pieces.length / 20);
  console.log(torrent.info.pieces.length / 20);
  tracker.getPeers(torrent, peers => {
    peers.forEach(peer => download(peer, torrent, pieces));
  });
};

function download(peer, torrent, pieces) {
  const socket = net.Socket();
  socket.on('error', console.log);
  socket.connect(peer.port, peer.ip, () => {
    socket.write(message.buildHandshake(torrent));
  });

  const queue = { choked: true, queue: [] };

  onWholeMsg(socket, msg => msgHandler(msg, socket, pieces, queue));
}

function msgHandler(msg, socket, pieces, queue) {
  if (isHandshake(msg)) {
    socket.write(message.buildInterested());
  } else {
    const m = message.parse(msg);

    // we are here now 4.10.2 Pieces vs. blocks
    if (m.id === 0) chokeHandler(socket);
    if (m.id === 1) unchokeHandler(socket, pieces, queue);
    if (m.id === 4) haveHandler(m.payload);
    if (m.id === 5) bitfieldHandler(m.payload);
    if (m.id === 7) pieceHandler(m.payload);
  }
}

function chokeHandler(socket) {
  socket.end();
}

function unchokeHandler(socket, pieces, queue) {
  queue.choked = false;
  requestPiece(socket, pieces, queue);
}

function haveHandler(payload, socket, pieces, queue) {
  const pieceIndex = payload.readUInt32BE(0);
  queue.push(pieceIndex);
  if (queue.length === 1) {
    requestPiece(socket, pieces, queue);
  }
}

function bitfieldHandler(payload) {  }

function pieceHandler(payload, socket, requested, queue) {
  queue.shift();
  requestPiece(socket, requested, queue);
}

function requestPiece(socket, pieces, queue) {
  if (queue.choked) return null;

  while (queue.queue.length) {
    const pieceIndex = queue.queue.shift();
    if (pieces.needed(pieceIndex)) {
      // need to fix this
      socket.write(message.buildRequest(pieceIndex));
      pieces.addRequested(pieceIndex);
      break;
    }
  }
}

function isHandshake(msg) {
  return (msg.length === msg.readUInt8(0) + 49) &&
    msg.toString('utf8', 1, 20) === 'BitTorrent protocol';
}

function onWholeMsg(socket, callback) {
  let savedBuf = Buffer.alloc(0);
  let handshake = true;

  socket.on('data', recvBuf => {
    // msgLen calculates the length of a whole message
    const msgLen = () => handshake ? savedBuf.readUInt8(0) + 49 : savedBuf.readInt32BE(0) + 4;
    savedBuf = Buffer.concat([savedBuf, recvBuf]);

    while (savedBuf.length >= 4 && savedBuf.length >= msgLen()) {
      callback(savedBuf.slice(0, msgLen()));
      savedBuf = savedBuf.slice(msgLen());
      handshake = false;
    }
  });
}
