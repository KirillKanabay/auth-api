import fs from 'fs/promises'
import path from 'path';

export async function ensureFileCreated(filePath: string){
    const dir = path.dirname(filePath);

    try {
        await fs.mkdir(dir, { recursive: true });
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, JSON.stringify([]));
    }
}