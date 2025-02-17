import ExtendedServerResponse from "../interfaces/IServerResponse";
import Options from "../interfaces/IOptions";

import ErrorsDetails from "../errors/details";

import mime from 'mime';
import fs, { ReadStream } from 'fs'
import { basename } from 'path';

export class Response {

  constructor(initializer?: ExtendedServerResponse) { }

  initialize(res: ExtendedServerResponse): void {
    Response.send(res);
    Response.json(res);
    Response.download(res);
    Response.redirect(res);
    Response.sendFile(res);
  }

  public static send(res: ExtendedServerResponse): void {
    res.send = function (body: object | string) {
      if (typeof body === 'object') {
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(body), 'utf-8');
      } else {
        this.setHeader('Content-Type', 'text/plain');
        this.end(body, 'utf-8');
      }
    };
  }

  public static json(res: ExtendedServerResponse): void {
    res.json = function (body: Object | String) {
      this.setHeader('Content-Type', 'application/json');
      return this.send(JSON.stringify(body));
    };
  }


  // TODO: fs stream is kinda over engineering, so lets check if the path needs that
  // if no, just read the entire file instead process the file in chunks

  public static download(res: ExtendedServerResponse): void {
    res.download = function (path: string) {
      const contentType = mime.getType(path) || 'application/octet-stream';

      this.setHeader('Content-Type', contentType);
      this.setHeader('Content-Disposition', `attachment; filename=${path.split('/').pop()}`);

      const fileStream = fs.createReadStream(path);
      fileStream.pipe(this);
    };
  }

  public static redirect(res: ExtendedServerResponse): void {
    res.redirect = function (url: string): void {
      if (!url) {
        return;
      }

      this.statusCode = 302;
      this.setHeader('Location', url);
      this.end();
    };
  }

  // yea i know this is not the same function on express, but i wanna make a something different
  // TODO: change the response of sendFile function

  public static sendFile(res: ExtendedServerResponse): void {
    res.sendFile = function (path: string, options?: Options, callback?: Function): void {

      if (!path)
        throw ErrorsDetails.create('Path is required', {
          expected: 'non-empty string',
          received: path,
        });

      if (!fs.existsSync(path))  
        throw ErrorsDetails.create('This path does not exist', {
        expected: 'a valid path',
        received: path,
      });


      const contentType = mime.getType(path) || 'application/octet-stream';
      const stats = fs.statSync(path)

      let fileContent: Buffer | ReadStream;

      if (stats.size < 1024 * 1024) fileContent = fs.readFileSync(path);

      else fileContent = fs.createReadStream(path)

      this.setHeader('Content-Type', contentType)
      this.setHeader('Content-Disposition', `${options?.attachment ? 'attachment' : 'inline'}; filename=${basename(path)}`);


      if (callback) {
        callback.call(this, JSON.stringify(fileContent));
      } else {
        this.write(fileContent);
        this.end();
      }

    };
  }
}