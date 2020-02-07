// Sends the response back in JSON format
const RespondJSON = (response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Sends the response back in XML format
const RespondXML = (response, status, object) => {
  let XML = '<response>';
  // Convert all key-value pairs in the object to XML elements
  for (const [key, value] of Object.entries(object)) {
    XML = `${XML}<${key}>${value}</${key}>`;
  }
  XML = `${XML}</response>`;

  response.writeHead(status, { 'Content-Type': 'text/xml' });
  response.write(XML);
  response.end();
};

// Sends a response with a given object based on the request's accept header
const Respond = (accecpt, response, status, object) => {
  if (accecpt === 'text/xml') {
    RespondXML(response, status, object);
  }
  // Default to JSON when irregular header type is given
  else {
    RespondJSON(response, status, object);
  }
};

const Success = (accecpt, response) => Respond(accecpt, response, 200, { message: 'Successful Response' });

const BadRequest = (accecpt, response, params) => {
  // Check for missing validation
  if (!params.valid || params.valid !== 'true') {
    Respond(accecpt, response, 400, {
      message: 'Missing valid query parameters',
      id: 'Bad Request',
    });
  } else {
    Respond(accecpt, response, 200, { message: 'Valid query parameters given' });
  }
};

const Unauthorized = (accecpt, response, params) => {
  // Check for missing login
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    Respond(accecpt, response, 401, {
      message: 'Incorrect login parameters',
      id: 'Unauthorized',
    });
  } else {
    Respond(accecpt, response, 200, { message: 'Valid login parameters given' });
  }
};

const Forbidden = (accecpt, response) => Respond(accecpt, response, 403, {
  message: 'Access Denied',
  id: 'Forbidden',
});

const Internal = (accecpt, response) => Respond(accecpt, response, 500, {
  message: 'Something went wrong',
  id: 'Internal Server Error',
});

const NotImplemented = (accecpt, response) => Respond(accecpt, response, 501, {
  message: 'Requested resource not implemented',
  id: 'Not Implemented',
});

const NotFound = (accecpt, response) => Respond(accecpt, response, 404, {
  message: 'Resource not found',
  id: 'Not Found',
});

module.exports = {
  Success,
  BadRequest,
  Unauthorized,
  Forbidden,
  Internal,
  NotImplemented,
  NotFound,
};
