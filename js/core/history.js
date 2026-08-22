/**
 * Bedrock JSON-UI Studio - History (Undo / Redo) Manager
 */

export class HistoryManager {
  constructor(maxHistory = 50) {
    this.maxHistory = maxHistory;
    this.stack = [];
    this.currentIndex = -1;
  }

  /**
   * Pushes a new state snapshot
   * @param {Object} stateSnapshot 
   */
  push(stateSnapshot) {
    const serialized = JSON.stringify(stateSnapshot);
    if (this.currentIndex >= 0 && this.stack[this.currentIndex] === serialized) {
      return;
    }

    this.stack = this.stack.slice(0, this.currentIndex + 1);
    this.stack.push(serialized);

    if (this.stack.length > this.maxHistory) {
      this.stack.shift();
    }

    this.currentIndex = this.stack.length - 1;
  }

  canUndo() {
    return this.currentIndex > 0;
  }

  canRedo() {
    return this.currentIndex < this.stack.length - 1;
  }

  undo() {
    if (!this.canUndo()) return null;
    this.currentIndex--;
    return JSON.parse(this.stack[this.currentIndex]);
  }

  redo() {
    if (!this.canRedo()) return null;
    this.currentIndex++;
    return JSON.parse(this.stack[this.currentIndex]);
  }

  clear() {
    this.stack = [];
    this.currentIndex = -1;
  }
}
