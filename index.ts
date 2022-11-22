import http from 'http';
import app from './app';
import { PORT } from './utils/config';

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
