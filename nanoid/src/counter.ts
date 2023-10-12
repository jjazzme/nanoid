// class for generation counting

import fs from 'fs';

export class Counter {
  path: string;
  value: number;
  writerInterval: number;

  constructor(path: string, writerInterval: number) {
    this.path = path;
    this.value = parseInt(fs.readFileSync(path, 'utf8'));
    this.writerInterval = writerInterval;
    this.writer();
  }

  private writer() {
    setTimeout(() => {
      try {
        const saved = parseInt(fs.readFileSync(this.path, 'utf8'));
        // if (this.value < saved) this.value = saved;
        if (this.value !== saved) {
          fs.writeFileSync(this.path, this.value.toString(), 'utf8');
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.writer();
      }
    }, this.writerInterval);
  }

  inc() {
    this.value++;
  }
}
