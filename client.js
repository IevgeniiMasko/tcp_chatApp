const net = require('node:net');

const readlinePromises = require('node:readline/promises');

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = net.createConnection(3000, '127.0.0.1', async () => {
  console.log(`Connection created`);

  const ask = async () => {
    const message = await rl.question('Enter message > ');
    await moveCursor(0, -1);
    await clearLine(0);
    socket.write(message);
  };

  ask();

  socket.on('data', async (data) => {
    console.log();
    await moveCursor(0, -1);
    await clearLine(0);

    const dataStr = data.toString('utf8');
    if (dataStr.substring(0, 6) === 'userId') {
      console.log(`Your userId: ${dataStr.substring(7)}`);
    } else {
      console.log(dataStr);
    }

    ask();
  });
});

socket.on('end', async () => {
  console.log();
  socket.destroy();
  await moveCursor(0, -1);
  await clearLine(0);
  console.log(`Connection ended`);
});
