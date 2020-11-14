import tl = require('azure-pipelines-task-lib/task');
import { SonarApi } from './sonarApi';

async function createProject() {
  let typedVisibilityString: keyof typeof SonarApi.Visibility = 'Public';
  const prj_name: string = tl.getInput('name', true) ?? 'gdriveano2';
  const prj_key: string = tl.getInput('key', true) ?? 'gdriveano2';
  const sonar_org: string | undefined = tl.getInput('org', true);
  const access_token: string | undefined = tl.getInput('access_token', true);
  const visibility: SonarApi.Visibility = <SonarApi.Visibility>tl.getInput('visibility', false) ?? typedVisibilityString;
  if (access_token === undefined || access_token === '') {
    tl.setResult(tl.TaskResult.Failed, 'No access token was given');
    return;
  }
  const exist = await SonarApi.Projects.isExist(prj_name, sonar_org, access_token);
  if (!exist) {
    const create_res = await SonarApi.Projects.create(prj_name, sonar_org, prj_key, access_token, visibility);
    tl.setResult(tl.TaskResult.Succeeded, `Project ${prj_name} was created successfully with this key: ${create_res.project.key}`, true);
    tl.debug(create_res);
  } else tl.warning(`The project ${prj_name} already exists`);
}

async function deleteProject() {
  const access_token: string | undefined = tl.getInput('access_token', true);
  const prj_key: string = tl.getInput('key', true) ?? 'gdriveano2';
  const sonar_org: string | undefined = tl.getInput('org', true);
  if (access_token === undefined || access_token === '') {
    tl.error('No access token was given');
    return;
  }

  const exist = await SonarApi.Projects.isExist(prj_key, sonar_org, access_token);
  if (exist) {
    const delete_res = await SonarApi.Projects.delete(prj_key, access_token);
    tl.setResult(tl.TaskResult.Succeeded, `Project ${prj_key} was deleted successfully`, true);
    tl.debug(delete_res);
  } else {
    tl.error(`No project found with key ${prj_key}`);
  }
}

const actionsMap: Map<string, () => Promise<void>> = new Map([
  ['create', createProject],
  ['delete', deleteProject],
]);

async function run() {
  try {
    const action: string = tl.getInput('action', true) ?? 'create';
    const actionDelegate = actionsMap.get(action.toLowerCase());
    if (actionDelegate !== undefined) {
      await actionDelegate();
    }
  } catch (err) {
    tl.debug(err.message);
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
