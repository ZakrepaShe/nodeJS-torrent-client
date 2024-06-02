import download from './download.js';
import { getPeers } from './tracker.js';
import * as torrentParser from './torrent-parser.js';

// https://allenkim67.github.io/programming/2016/05/04/how-to-make-your-own-bittorrent-client.html
// 4.10.2 Pieces vs. blocks
const torrent = torrentParser.open('The.Farmer.Was.Replaced.Build.13556869.rar.torrent');
// const torrent = torrentParser.open('1.torrent');

// console.log('torrent: ', torrent);
// getPeers(torrent, peers => {
//   // console.log('list of peers: ', peers);
//   // [
//   //   { ip: '185.96.31.127', port: 6681 },
//   //   { ip: '146.120.15.232', port: 44641 },
//   //   { ip: '95.99.179.228', port: 6881 },
//   //   { ip: '93.125.107.24', port: 6881 },
//   //   { ip: '91.196.55.250', port: 45069 }
//   // ]
//
// })

download(torrent);
