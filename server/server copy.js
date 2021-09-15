require("dotenv").config({ path: __dirname + "/./.env" });
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb"); // or ObjectID

const PROTO_PATH = "./restaurant.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var restaurantProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();
// const menu=[
//     {
//         id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
//         name: "Tomyam Gung",
//         price: 500
//     },
//     {
//         id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
//         name: "Somtam",
//         price: 60
//     },
//     {
//         id: "8551887c-f82d-4e44-88ca-ae2a1ccc92b7",
//         name: "Pad-Thai",
//         price: 120
//     }
// ];

client.connect().then(async (clientDb) => {
  server.addService(restaurantProto.RestaurantService.service, {
    getAllMenu: async (_, callback) => {
      let menu = await db.collection('menus').find({}).toArray()
      for (let m of menu) {
        m.id = m._id.toString();
        delete m._id;
      }

      callback(null, { menu });
    },
    get: async (call, callback) => {
      let menuItem = await db.collection('menus').findOne({
        _id: ObjectId(call.request.id)
      })

      menuItem.id = menuItem._id.toString();
      // let menuItem = menu.find((n) => n.id == call.request.id);

      if (menuItem) {
        callback(null, menuItem);
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Not found",
        });
      }
    },
    insert: (call, callback) => {
      let menuItem = call.request;

      await db.collection('menus').insertOne(menuItem);

      // menuItem.id = uuidv4();
      // menu.push(menuItem);
      callback(null, menuItem);
    },
    update: (call, callback) => {
      let existingMenuItem = await db.collection('menus').findOne({
        _id: ObjectId(call.request.id)
      })

      if (existingMenuItem) {
        existingMenuItem.name = call.request.name;
        existingMenuItem.price = call.request.price;

        await db.collection('menus').updateOne({_id: ObjectId(call.request.id)}, {$set: {
          name: call.request.name,
          price: call.request.price,
        }});

        callback(null, existingMenuItem);
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Not Found",
        });
      }
    },
    remove: (call, callback) => {
      let menuItem = await db.collection('menus').findOne({
        _id: ObjectId(call.request.id)
      })

      if (menuItem) {
        await db.collection('menus').deleteOne({_id: ObjectId(call.request.id)});
        callback(null, {});
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "NOT Found",
        });
      }
    },
  });

  server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
  console.log("Server running at http://127.0.0.1:30043");
  server.start();
});
