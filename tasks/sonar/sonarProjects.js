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
exports.Projects = void 0;
const sonarCommon_1 = require("./sonarCommon");
class Projects {
    static create(name, org, key, token, visibility = sonarCommon_1.Visibility.Public, baseUrl = 'https://sonarcloud.io/') {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = `${baseUrl}api/projects/create?organization=${org}&project=${key}&name=${name}&visibility=${visibility.toLowerCase()}`;
            return yield sonarCommon_1.Common.makeRequest(token, apiUrl, undefined, sonarCommon_1.HttpMethod.Post);
        });
    }
    static delete(project, token, baseUrl = 'https://sonarcloud.io/') {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = `${baseUrl}api/projects/delete?project=${project}`;
            return yield sonarCommon_1.Common.makeRequest(token, apiUrl, undefined, sonarCommon_1.HttpMethod.Post);
        });
    }
    static isExist(projectName, org, token, baseUrl = 'https://sonarcloud.io/') {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = `${baseUrl}api/projects/search?organization=${org}&projects=${projectName}&onProvisionedOnly=false`;
            const res = yield sonarCommon_1.Common.makeRequest(token, apiUrl);
            return res.components && res.components.length > 0;
        });
    }
}
exports.Projects = Projects;
//# sourceMappingURL=sonarProjects.js.map