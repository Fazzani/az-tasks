"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const sonarApi_1 = require("./sonarApi");
function createProject() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let typedVisibilityString = 'Public';
        const prj_name = (_a = tl.getInput('name', true)) !== null && _a !== void 0 ? _a : 'gdriveano2';
        const prj_key = (_b = tl.getInput('key', true)) !== null && _b !== void 0 ? _b : 'gdriveano2';
        const sonar_org = tl.getInput('org', true);
        const access_token = tl.getInput('access_token', true);
        const visibility = (_c = tl.getInput('visibility', false)) !== null && _c !== void 0 ? _c : typedVisibilityString;
        if (access_token === undefined || access_token === '') {
            tl.setResult(tl.TaskResult.Failed, 'No access token was given');
            return;
        }
        const exist = yield sonarApi_1.SonarApi.Projects.isExist(prj_name, sonar_org, access_token);
        if (!exist) {
            const create_res = yield sonarApi_1.SonarApi.Projects.create(prj_name, sonar_org, prj_key, access_token, visibility);
            tl.setResult(tl.TaskResult.Succeeded, `Project ${prj_name} was created successfully with this key: ${create_res.project.key}`, true);
            console.log(create_res);
        }
        else
            tl.setResult(tl.TaskResult.SucceededWithIssues, `The project ${prj_name} already exists`);
    });
}
function deleteProject() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const access_token = tl.getInput('access_token', true);
        const prj_key = (_a = tl.getInput('key', true)) !== null && _a !== void 0 ? _a : 'gdriveano2';
        const sonar_org = tl.getInput('org', true);
        console.log('test');
        if (access_token === undefined || access_token === '') {
            tl.error('No access token was given');
            return;
        }
        const exist = yield sonarApi_1.SonarApi.Projects.isExist(prj_key, sonar_org, access_token);
        if (exist) {
            const delete_res = yield sonarApi_1.SonarApi.Projects.delete(prj_key, access_token);
            tl.setResult(tl.TaskResult.Succeeded, `Project ${prj_key} was deleted successfully`, true);
            console.log(delete_res);
        }
        else {
            tl.setResult(tl.TaskResult.Failed, `No project found with key ${prj_key}`);
        }
    });
}
const actionsMap = new Map([
    ['create', createProject],
    ['delete', deleteProject],
]);
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const action = (_a = tl.getInput('action', true)) !== null && _a !== void 0 ? _a : 'create';
            const actionDelegate = actionsMap.get(action.toLowerCase());
            if (actionDelegate !== undefined) {
                yield actionDelegate();
            }
        }
        catch (err) {
            console.log(err.message);
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
//# sourceMappingURL=index.js.map