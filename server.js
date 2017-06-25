var SwaggerServer = require('swagger-boilerplate').Server;

var swaggerServer =
 new SwaggerServer({
   apiFile: './apiDef.yml',
   modulePath: __dirname + '/',
   appName: 'Chart Module Implementation',
   serverPort: process.env.PORT || 8126
 });

swaggerServer.start();
