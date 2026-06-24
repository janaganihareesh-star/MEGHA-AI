const EventEmitter = require('events');

class QueueService extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.isProcessing = false;
    
    // Listen to self for new tasks to trigger processing
    this.on('newTask', this.processQueue.bind(this));
  }

  /**
   * Add an async task to the background queue.
   * @param {Function} taskFn - An async function representing the background task
   * @param {string} taskName - For logging purposes
   */
  enqueue(taskFn, taskName = 'Unnamed Task') {
    this.queue.push({ taskFn, taskName });
    // Emit event asynchronously to decouple from the current stack trace
    setImmediate(() => {
      this.emit('newTask');
    });
  }

  async processQueue() {
    if (this.isProcessing) return;
    if (this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { taskFn, taskName } = this.queue.shift();
      try {
        console.log(`[Queue] Starting background task: ${taskName}`);
        await taskFn();
        console.log(`[Queue] Completed background task: ${taskName}`);
      } catch (err) {
        console.error(`[Queue] Error processing background task '${taskName}':`, err);
      }
    }

    this.isProcessing = false;
  }
}

// Export a singleton instance
module.exports = new QueueService();
