// tslint:disable:no-console
import app from "./app";
import config from "./config/config";

// Server
app.listen(config.port, () =>
  console.log(`Server running: http://localhost:${config.port}`)
);
