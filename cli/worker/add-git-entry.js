const { processNewFile } = require('../../common/git');

// Listen for the message from the parent process
process.on('message', async (message) => {
  try {
    const [entryAbsolutePath, data] = JSON.parse(message);
    console.log('Worker received message:', message);
    await processNewFile(entryAbsolutePath, data);
    console.log('Worker completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Worker failed with error:', error);
    process.exit(1);
  }
});

// Handle any uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception in worker:', error);
  process.exit(1);
});