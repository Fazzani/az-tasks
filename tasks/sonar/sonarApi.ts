import axios = require('axios');
export namespace SonarApi {
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
    static async makeRequest(access_token: string, url: string, payload?: object, method: HttpMethod = HttpMethod.Get) {
      try {
        const result = await axios.default({
          method: method,
          url: url,
          data: payload,
          auth: {
            username: access_token,
            password: '',
          },
        });
        return result.data;
      } catch (error) {
        throw error;
      }
    }
  }

  export class Projects {
    public static async create(
      name: string,
      org: string | undefined,
      key: string,
      token: string,
      visibility: SonarApi.Visibility = SonarApi.Visibility.Public,
      base_url: string = 'https://sonarcloud.io/api/',
    ): Promise<any> {
      const api_url = `${base_url}projects/create?organization=${org}&project=${key}&name=${name}&visibility=${visibility.toLowerCase()}`;
      return await SonarApi.Common.makeRequest(token, api_url, undefined, SonarApi.HttpMethod.Post);
    }

    public static async delete(project: string, token: string, base_url: string = 'https://sonarcloud.io/api/'): Promise<any> {
      const api_url = `${base_url}projects/delete?project=${project}`;
      return await SonarApi.Common.makeRequest(token, api_url, undefined, SonarApi.HttpMethod.Post);
    }

    public static async isExist(projectName: string, org: string | undefined, token: string, base_url: string = 'https://sonarcloud.io/api/'): Promise<boolean> {
      const api_url = `${base_url}projects/search?organization=${org}&projects=${projectName}&onProvisionedOnly=false`;
      const res = await SonarApi.Common.makeRequest(token, api_url);
      return res.components && res.components.length > 0;
    }
  }
}
