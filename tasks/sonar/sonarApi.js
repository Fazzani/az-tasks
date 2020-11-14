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
exports.SonarApi = void 0;
const axios = require("axios");
var SonarApi;
(function (SonarApi) {
    let HttpMethod;
    (function (HttpMethod) {
        HttpMethod["Get"] = "get";
        HttpMethod["Post"] = "post";
        HttpMethod["Put"] = "put";
        HttpMethod["Delete"] = "delete";
        HttpMethod["Head"] = "head";
    })(HttpMethod = SonarApi.HttpMethod || (SonarApi.HttpMethod = {}));
    let Visibility;
    (function (Visibility) {
        Visibility["Public"] = "public";
        Visibility["Private"] = "private";
    })(Visibility = SonarApi.Visibility || (SonarApi.Visibility = {}));
    class Common {
        static makeRequest(access_token, url, payload, method = HttpMethod.Get) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield axios.default({
                        method: method,
                        url: url,
                        data: payload,
                        auth: {
                            username: access_token,
                            password: '',
                        },
                    });
                    return result.data;
                }
                catch (error) {
                    throw error;
                }
            });
        }
    }
    SonarApi.Common = Common;
    class Projects {
        static create(name, org, key, token, visibility = SonarApi.Visibility.Public, base_url = 'https://sonarcloud.io/api/') {
            return __awaiter(this, void 0, void 0, function* () {
                const api_url = `${base_url}projects/create?organization=${org}&project=${key}&name=${name}&visibility=${visibility.toLowerCase()}`;
                return yield SonarApi.Common.makeRequest(token, api_url, undefined, SonarApi.HttpMethod.Post);
            });
        }
        static delete(project, token, base_url = 'https://sonarcloud.io/api/') {
            return __awaiter(this, void 0, void 0, function* () {
                const api_url = `${base_url}projects/delete?project=${project}`;
                return yield SonarApi.Common.makeRequest(token, api_url, undefined, SonarApi.HttpMethod.Post);
            });
        }
        static isExist(projectName, org, token, base_url = 'https://sonarcloud.io/api/') {
            return __awaiter(this, void 0, void 0, function* () {
                const api_url = `${base_url}projects/search?organization=${org}&projects=${projectName}&onProvisionedOnly=false`;
                const res = yield SonarApi.Common.makeRequest(token, api_url);
                return res.components && res.components.length > 0;
            });
        }
    }
    SonarApi.Projects = Projects;
})(SonarApi = exports.SonarApi || (exports.SonarApi = {}));
//# sourceMappingURL=sonarApi.js.map