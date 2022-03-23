const core = require('@actions/core');

async function run() {
  try {
    
  }
  catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
    else {
      core.setFailed(error);
    }
  }
}

run();