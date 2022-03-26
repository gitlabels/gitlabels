import { env } from "process";

const core = require('@actions/core');
const { Octokit } = require("@octokit/rest");
const fs = require('fs');
const { readFile } = require('fs/promises');

interface LabelUpdate {
  name: string;
  color: string;
  description?: string;
}

async function run() {
  try {
    const owner = env.GITHUB_REPOSITORY_OWNER || ''
    const repo = env.GITHUB_REPOSITORY?.substring(owner.length + 1)

    const octokit = new Octokit({
      auth: env.GITHUB_TOKEN,
      userAgent: 'gitlabels-action',
      baseUrl: env.GITHUB_API_URL,
    })

    const labelsPath = '.github/labels.json';
    if (!fs.existsSync(labelsPath)) {
      return;
    }

    let content = await readFile(labelsPath);
    let labels = JSON.parse(content);

    if (!labels.forEach) {
      core.setFailed('labels.json file must contain array of label definitions.')
      return
    }

    labels.forEach(async (newLabel: LabelUpdate) => {
      var name = newLabel.name;
      var color = newLabel.color;
      var description = newLabel.description;

      await octokit.rest.issues.updateLabel({
        owner,
        repo,
        name,
        new_name: name,
        color,
        description
      });

      core.info(`Label ${name} updated.`)
    });
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