const { processNewFile } = require('../../common/git');

// Get the arguments passed from the parent process
const [entryAbsolutePath, data] = JSON.parse(process.argv[2]);

// Run the processNewFile function
processNewFile(entryAbsolutePath, data)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Background process failed:', error);
    process.exit(1);
  });