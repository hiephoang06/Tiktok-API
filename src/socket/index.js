import { Server } from 'socket.io';
import { verifyToken } from '../../app/auth/auth.method.js';
import ProfileModel from '../../app/models/Profile.js';
export const SocketIO = (server) => {
  const io = new Server(server, { cors: { origin: '*' } });
  const arr = [];

  io.on('connection', async (socket) => {
    const user = await isAuthSocket(socket);
    arr[user._id] = socket.id;
    console.log(user._id, socket.id)
    socket.on('send_message', (data) => {
      console.log(data)
      socket.to(arr[data.receiver]).emit('new_message', data);
    });

    socket.on('disconnect', () => {
      delete arr[user._id];
    });
  });
};

const getByValue = (arr, searchValue) => {
  for (const [key, value] of Object.entries(arr)) {
    if (value === searchValue) {
      return key;
    }
  }
};

const isAuthSocket = async (socket) => {
  try {
    const accessTokenFromHeader = socket.handshake.headers.authorization.split(' ')[1];

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    const verified = await verifyToken(accessTokenFromHeader, accessTokenSecret);

    const userID = verified.payload.userID;

    const checkExist = await ProfileModel.findOne({ userID });

    return checkExist;
  } catch (error) {
    console.log(error);
  }
};
