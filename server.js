var SwaggerServer = require('swagger-boilerplate').Server;

var swaggerServer =
 new SwaggerServer({
   apiFile: './apiDef.yml',
   modulePath: __dirname + '/',
   appName: 'Chart Module Implementation',
   serverPort: 8126
 });

swaggerServer.start();