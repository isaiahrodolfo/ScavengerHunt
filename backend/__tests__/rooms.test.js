const io = require('socket.io-client');
const http = require('http');
const socketIo = require('socket.io');

// Create the server instance
const app = http.createServer();
const ioServer = socketIo(app);

describe('Socket.io Room Operations', () => {
  let socket;
  let server;

  beforeAll((done) => {
    // Start the server
    server = app.listen(3001, done); // Make sure another process is not already running on this port
  });

  beforeEach((done) => {
    // Simulate client connection
    socket = io.connect('http://localhost:3000', {
      transports: ['websocket'],
    });
    socket.on('connect', done);
  });

  afterEach(() => {
    socket.disconnect();
  });

  afterAll(() => {
    server.close();
  });

  test('should emit hello event on createRoom', (done) => {
    // Spy on the console.log to check emitted events
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    socket.emit('createRoom', 'room123');
    // Check if the "hello" event was emitted
    setTimeout(() => {
      expect(logSpy).toHaveBeenCalledWith('Emitting event: hello with args: [ "world" ]');
      logSpy.mockRestore();
      done();
    }, 100);
  });

  test('should join room on joinRoom', (done) => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    socket.emit('joinRoom', 'room123');
    setTimeout(() => {
      expect(logSpy).toHaveBeenCalledWith('Emitting event: joinRoom with args: [ "room123" ]');
      logSpy.mockRestore();
      done();
    }, 100);
  });

  // More tests can be added for other actions...
});
