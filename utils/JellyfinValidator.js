/* globals fetch */
import Url from 'url-parse';

export default class JellyfinValidator {
  static parseUrl(host = '', port = '') {
    if (!host) {
      throw new Error('host cannot be blank')
    }
    // Parsing seems to fail if a protocol is not set
    if (!host.startsWith('http://') && !host.startsWith('https://')) {
      host = `http://${host}`;
    }
    // Parse the host as a url
    const url = new Url(host);
    // Override the port if provided
    if (port) {
      url.set('port', port);
    }
    return url;
  }

  static getServerUrl(server = {}) {
    if (!server || !server.url || !server.url.origin) {
      throw new Error(`Cannot get server url for invalid server ${server}`)
    }
    return `${server.url.origin}${server.url.pathname}`;
  }

  static async validate(server = {}) {
    // Does the server have a valid url?
    if (!server.url || !server.url.origin) {
      return false;
    }

    const serverUrl = this.getServerUrl(server);
    const infoUrl = `${serverUrl}/system/info/public`;
    console.log('info url', infoUrl);
    // Try to fetch the server's public info
    try {
      const response = await fetch(infoUrl);
      const responseJson = await response.json();
      console.log('response', responseJson);

      // Versions prior to 10.3.x do not include ProductName so return true if response includes Version < 10.3.x
      if (responseJson.Version) {
        const versionNumber = responseJson.Version.split('.').map(num => Number.parseInt(num, 10));
        if (versionNumber.length === 3 && versionNumber[0] === 10 && versionNumber[1] < 3) {
          console.log('Is valid old version');
          return true;
        }
      }

      return responseJson.ProductName === 'Jellyfin Server';
    } catch(err) {
      return false;
    }
  }
}