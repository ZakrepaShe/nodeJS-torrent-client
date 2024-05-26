import download from './download.js';
import { getPeers } from './tracker.js';
import * as torrentParser from './torrent-parser.js';

//https://allenkim67.github.io/programming/2016/05/04/how-to-make-your-own-bittorrent-client.html
//4.2 TCP connect to peers
const torrent = torrentParser.open('The.Farmer.Was.Replaced.Build.13556869.rar.torrent');
// const torrent = torrentParser.open('1.torrent');

console.log('torrent: ', torrent);
getPeers(torrent, peers => {
  console.log('list of peers: ', peers);
})

// download(torrent);
