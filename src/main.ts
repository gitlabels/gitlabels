import { env } from "process";

const core = require('@actions/core');
const github = require("@actions/octokit");
const { GitHub } = require("@actions/octokit/utils");
const fs = require('fs');
const { readFile } = require('fs/promises');

interface LabelUpdate {
  name: string;
  color: string;
  description?: string;
}

async function run() {
  try {
    const token = env.GITHU_TOKEN
    const repo = github.context.repo

    const octokit = github.getOctokit(token, {
      userAgent: 'gitlabels-action'
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

    let existingLabels = await listLabelsForRepo(octokit, repo)

    labels.forEach(async (newLabel: LabelUpdate) => {
      var name = newLabel.name;
      var color = newLabel.color;
      var description = newLabel.description;

      try {
        if (labelExists(existingLabels, name)) {
          core.info(`Updating label ${name}`)

          await octokit.rest.issues.updateLabel({
            ...repo,
            name,
            new_name: name,
            color,
            description
          });
        }
        else {
          core.info(`Creating label ${name}`)

          await octokit.rest.issues.createLabel({
            ...repo,
            name,
            color,
            description
          });
        }
      }
      catch (error: any) {
        core.setFailed(`Failed to update label '${name}'. Error: ${error}`)
      }
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

async function listLabelsForRepo(octokit: any, repo: any) {
  let reponse = await octokit.rest.issues.listLabelsForRepo({ ...repo })
  return reponse.data
}

function labelExists(labels: Array<any>, name: String): Boolean {
  let existingLabel = labels.find(label => label.name === name);
  return existingLabel != null;
}

run();