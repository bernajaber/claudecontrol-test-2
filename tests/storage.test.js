import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load, save } from '../src/storage.js';

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  rename: vi.fn()
}));

vi.mock('os', () => ({
  homedir: () => '/home/testuser'
}));

import { readFile, writeFile, rename } from 'fs/promises';

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('load()', () => {
    it('returns [] when file does not exist (ENOENT)', async () => {
      const error = new Error('ENOENT');
      error.code = 'ENOENT';
      readFile.mockRejectedValue(error);

      const result = await load();

      expect(result).toEqual([]);
      expect(readFile).toHaveBeenCalledWith('/home/testuser/.todo.json', 'utf8');
    });

    it('returns parsed array when file exists', async () => {
      const tasks = [{ id: 1, text: 'Test task', completed: false }];
      readFile.mockResolvedValue(JSON.stringify(tasks));

      const result = await load();

      expect(result).toEqual(tasks);
      expect(readFile).toHaveBeenCalledWith('/home/testuser/.todo.json', 'utf8');
    });

    it('returns [] when JSON is invalid', async () => {
      readFile.mockResolvedValue('invalid{json');

      const result = await load();

      expect(result).toEqual([]);
    });
  });

  describe('save()', () => {
    it('writes JSON to ~/.todo.json with correct formatting', async () => {
      const tasks = [{ id: 1, text: 'Test task', completed: false }];
      writeFile.mockResolvedValue();
      rename.mockResolvedValue();

      await save(tasks);

      const expectedJson = JSON.stringify(tasks, null, 2);
      expect(writeFile).toHaveBeenCalledWith('/home/testuser/.todo.json.tmp', expectedJson, 'utf8');
      expect(rename).toHaveBeenCalledWith('/home/testuser/.todo.json.tmp', '/home/testuser/.todo.json');
    });
  });
});
