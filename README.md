# NodeJS HTTP/WS Server with SSL Certified Support
A personal project of a simple WebSocket server with a built-in HTTP REST/API and SSL support.

> **WARNING!** It's a studies purpose project.

### How To Use

> OpenSSL is required to generate SSL certified.

> NodeJS or Docker is required to run application.

- ##### Generate SSL Certified
  ```bash
   chmod +x ssl-generate.sh
   ./ssl-generate.sh
   ```

- ##### Run App (NodeJS)
  ```bash
  cd app
  npm install
  node index.js
  ```

- ##### Run on Docker
  ```bash
  chmod +x dockerize.sh
  ./dockerize <port> <name>
  ```