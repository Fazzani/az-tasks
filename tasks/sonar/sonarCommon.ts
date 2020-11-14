import axios = require('axios');
import * as tl from 'azure-pipelines-task-lib/task';
import qs from 'qs';

export enum HttpMethod {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete',
  Head = 'head',
}

export enum Visibility {
  Public = 'public',
  Private = 'private',
}
export class Common {
  static async makeRequest(token: string, url: string, payload?: object, method: HttpMethod = HttpMethod.Get) {
    tl.debug(`${url}`);
    tl.debug(`${token}`);
    try {
      const result = await axios.default({
        method,
        url,
        data: qs.stringify(payload),
        auth: {
          username: token,
          password: '',
        },
      });
      return result.data;
    } catch (error) {
      tl.debug(`${JSON.stringify(error)}`);
      throw error;
    }
  }
  public static getEndpoint(id: string, type: EndpointType): EndpointData {
    const url = tl.getEndpointUrl(id, false);
    const token = tl.getEndpointAuthorizationParameter(id, 'apitoken', type !== EndpointType.SonarCloud);
    const username = tl.getEndpointAuthorizationParameter(id, 'username', true);
    const password = tl.getEndpointAuthorizationParameter(id, 'password', true);
    const organization = tl.getInput('org', type === EndpointType.SonarCloud);
    return { type, url, token, username, password, organization } as EndpointData;
  }
}

export enum EndpointType {
  SonarCloud = 'SonarCloud',
  SonarQube = 'SonarQube',
}

export interface EndpointData {
  url: string;
  token?: string;
  username?: string;
  password?: string;
  organization?: string;
}
