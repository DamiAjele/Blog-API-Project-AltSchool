const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

mongoose.Promise = global.Promise;

class Connection {
  constructor() {
    this.mongoServer = null;
  }

  async connect() {
    this.mongoServer = await MongoMemoryServer.create();
    const mongoUri = this.mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }

  async disconnect() {
   await mongoose.disconnect();
   if (this.mongoServer) {
     await this.mongoServer.stop();
   }
  }

  async cleanup() {
    const models = Object.keys(mongoose.connection.models);
    const promises = [];

    models.map((model) => {
      promises.push(mongoose.connection.models[model].deleteMany({}));
    });

    await Promise.all(promises);
  }
}

exports.connect = async () => {
  const conn = new Connection();
  await conn.connect();
  return conn;
};