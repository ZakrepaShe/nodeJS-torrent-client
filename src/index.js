import download from './download.js';
import { open } from './torrent-parser.js';

const torrent = open('The.Farmer.Was.Replaced.Build.13556869.rar.torrent');

download(torrent, torrent.info.name);
