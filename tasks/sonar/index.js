"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const tl = __importStar(require("azure-pipelines-task-lib/task"));
const sonar_common = __importStar(require("./sonarCommon"));
const sonarCommon_1 = require("./sonarCommon");
const sonar_projects = __importStar(require("./sonarProjects"));
function createProject() {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const typedVisibilityString = 'Public';
        const prgName = (_a = tl.getInput('name', true)) !== null && _a !== void 0 ? _a : 'gdriveano2';
        const prjKey = (_b = tl.getInput('key', true)) !== null && _b !== void 0 ? _b : 'gdriveano2';
        // const sonarOrg: string | undefined = tl.getInput('org', true);
        // const token: string | undefined = tl.getInput('access_token', true);
        const serviceConnection = (_c = tl.getInput(sonarCommon_1.EndpointType.SonarCloud, true)) !== null && _c !== void 0 ? _c : '';
        const endpoint = sonar_common.Common.getEndpoint(serviceConnection, sonarCommon_1.EndpointType.SonarCloud);
        tl.debug(`Endpoint: ${JSON.stringify(endpoint)}`);
        const visibility = (_d = tl.getInput('visibility', false)) !== null && _d !== void 0 ? _d : typedVisibilityString;
        if (endpoint.token === undefined || endpoint.token === '') {
            tl.setResult(tl.TaskResult.Failed, 'No access token was given');
            return;
        }
        endpoint.token = 'd4b5728a887c91d8959c3aaef85742f1d69b90d3';
        const exist = yield sonar_projects.Projects.isExist(prjKey, endpoint.organization, endpoint.token, endpoint.url);
        if (!exist) {
            const res = yield sonar_projects.Projects.create(prgName, endpoint.organization, prjKey, endpoint.token, visibility, endpoint.url);
            tl.setResult(tl.TaskResult.Succeeded, `Project ${prgName} was created successfully with this key: ${res.project.key}`, true);
            tl.debug(res);
        }
        else {
            const msg = `The project ${prgName} already exists`;
            tl.warning(msg);
            tl.setResult(tl.TaskResult.SucceededWithIssues, msg, true);
        }
    });
}
function deleteProject() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const serviceConnection = (_a = tl.getInput(sonarCommon_1.EndpointType.SonarCloud, true)) !== null && _a !== void 0 ? _a : '';
        const endpoint = sonar_common.Common.getEndpoint(serviceConnection, sonarCommon_1.EndpointType.SonarCloud);
        tl.debug(`Endpoint: ${JSON.stringify(endpoint)}`);
        // const token: string | undefined = tl.getInput('access_token', true);
        const prjKey = (_b = tl.getInput('key', true)) !== null && _b !== void 0 ? _b : 'gdriveano2';
        // const sonarOrg: string | undefined = tl.getInput('org', true);
        if (endpoint.token === undefined || endpoint.token === '') {
            tl.error('No access token was given');
            tl.setResult(tl.TaskResult.Failed, 'No access token was given');
            return;
        }
        const exist = yield sonar_projects.Projects.isExist(prjKey, endpoint.organization, endpoint.token, endpoint.url);
        if (exist) {
            const res = yield sonar_projects.Projects.delete(prjKey, endpoint.token, endpoint.url);
            tl.debug(res);
            tl.setResult(tl.TaskResult.Succeeded, `Project ${prjKey} was deleted successfully`, true);
        }
        else {
            tl.error(`No project found with key ${prjKey}`);
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
            tl.debug(err.message);
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
//# sourceMappingURL=index.js.map