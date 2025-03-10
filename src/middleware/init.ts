const setPrototypeOf = require('setprototypeof')

exports.init = function(app: { response: object | null; }): Function {
    return function expressInit(req: any, res: any, next: () => void) {

      Object.setPrototypeOf(res, app.response);
      next();
    }
  }