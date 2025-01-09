import archiver from 'archiver';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create output stream
const output = createWriteStream('prettylinks-core.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Listen for errors
archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the output file
archive.pipe(output);

// Add core files to the archive
archive.directory('core-files/', false);

// Finalize the archive
archive.finalize();