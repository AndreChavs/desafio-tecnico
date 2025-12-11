import * as fs from 'fs';

export function ensureUploadFolder() {
  const dir = './uploads';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}