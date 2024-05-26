import net from 'net';
import { Buffer } from 'buffer';
import * as tracker from './tracker.js';

export default function (torrent) {
  tracker.getPeers(torrent, peers => {
    peers.forEach(download);
  });
};

function download(peer) {
  const socket = net.Socket();
  socket.on('error', console.log);
  socket.connect(peer.port, peer.ip, () => {
    // socket.write(...) write a message here
  });
  socket.on('data', data => {
    // handle response here
  });
}