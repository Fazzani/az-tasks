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
exports.EndpointType = exports.Common = exports.Visibility = exports.HttpMethod = void 0;
const axios = require("axios");
const tl = __importStar(require("azure-pipelines-task-lib/task"));
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["Get"] = "get";
    HttpMethod["Post"] = "post";
    HttpMethod["Put"] = "put";
    HttpMethod["Delete"] = "delete";
    HttpMethod["Head"] = "head";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
var Visibility;
(function (Visibility) {
    Visibility["Public"] = "public";
    Visibility["Private"] = "private";
})(Visibility = exports.Visibility || (exports.Visibility = {}));
class Common {
    static makeRequest(token, url, payload, method = HttpMethod.Get) {
        return __awaiter(this, void 0, void 0, function* () {
            tl.debug(`${url}`);
            tl.debug(`${token}`);
            try {
                const result = yield axios.default({
                    method,
                    url,
                    data: payload,
                    auth: {
                        username: token,
                        password: '',
                    },
                });
                return result.data;
            }
            catch (error) {
                tl.debug(`${JSON.stringify(error)}`);
                throw error;
            }
        });
    }
    static getEndpoint(id, type) {
        const url = tl.getEndpointUrl(id, false);
        const token = tl.getEndpointAuthorizationParameter(id, 'apitoken', type !== EndpointType.SonarCloud);
        const username = tl.getEndpointAuthorizationParameter(id, 'username', true);
        const password = tl.getEndpointAuthorizationParameter(id, 'password', true);
        const organization = tl.getInput('org', type === EndpointType.SonarCloud);
        return { type, url, token, username, password, organization };
    }
}
exports.Common = Common;
var EndpointType;
(function (EndpointType) {
    EndpointType["SonarCloud"] = "SonarCloud";
    EndpointType["SonarQube"] = "SonarQube";
})(EndpointType = exports.EndpointType || (exports.EndpointType = {}));
//# sourceMappingURL=sonarCommon.js.map