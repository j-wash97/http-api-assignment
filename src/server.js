const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponse.js');
const dataHandler = require('./dataResponse.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.GetIndex,
  '/style.css': htmlHandler.GetCSS,
  '/success': dataHandler.Success,
  '/badRequest': dataHandler.BadRequest,
  '/unauthorized': dataHandler.Unauthorized,
  '/forbidden': dataHandler.Forbidden,
  '/internal': dataHandler.Internal,
  '/notImplemented': dataHandler.NotImplemented,
  notFound: dataHandler.NotFound,
};

const OnRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  const accept = request.headers.accept.split(',')[0];

  console.log(accept);
  console.log(parsedUrl.pathname);
  console.log(params);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](accept, response, params);
  } else {
    urlStruct.notFound(accept, response);
  }
};

http.createServer(OnRequest).listen(port);
console.log(`Listening on port ${port}`);
