import { readFile, writeFile, rename } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

const TODO_PATH = join(homedir(), '.todo.json');

export async function load() {
  try {
    const data = await readFile(TODO_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function save(tasks) {
  try {
    const content = JSON.stringify(tasks, null, 2);
    const tempPath = `${TODO_PATH}.tmp`;
    await writeFile(tempPath, content, 'utf8');
    await rename(tempPath, TODO_PATH);
  } catch (error) {
    console.error('Failed to save tasks:', error.message);
    throw error;
  }
}
