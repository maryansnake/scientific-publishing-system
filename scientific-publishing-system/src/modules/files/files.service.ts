import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { getFileUrl } from './files-config';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
const statAsync = promisify(fs.stat);
const readFileAsync = promisify(fs.readFile);

@Injectable()
export class FilesService {
  async getFileInfo(filename: string) {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    try {
      const stats = await statAsync(filePath);
      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        url: getFileUrl(filename),
      };
    } catch (error) {
      throw new NotFoundException(`File ${filename} not found`);
    }
  }

  async getFileBuffer(filename: string): Promise<Buffer> {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    try {
      return await readFileAsync(filePath);
    } catch (error) {
      throw new NotFoundException(`File ${filename} not found`);
    }
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    try {
      await unlinkAsync(filePath);
    } catch (error) {
      throw new NotFoundException(`File ${filename} not found or could not be deleted`);
    }
  }
}