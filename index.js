const admin = require("firebase-admin");
const express = require("express");
const server = express();
const cors = require("cors");
const bodyParser = require("body-parser");
server.use(bodyParser.json());
server.use(cors());
const apiKey = 100;
const serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
server.post("/createUser", async (req, res) => {
  if (parseInt(req.body.apiKey) != parseInt(apiKey)) {
    console.log("invalid apiKey");
    res.send().end();
    return;
  } else {
    const docRef = db.collection("Dashboard").doc();
    await docRef.set({
      userId: docRef.id,
      userName: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
      userDob: new Date(req.body.userDob),
      userContacts: [
        parseInt(req.body.primaryContact),
        parseInt(req.body.alternateContact),
      ],
      userCity: req.body.userCity,
      userState: req.body.userState,
    });
  }
  res.send().end();
});
server.put("/updateUser", async (req, res) => {
  if (parseInt(req.body.apiKey) != parseInt(apiKey)) {
    console.log("invalid apiKey");
    res.send().end();
    return;
  } else {
    const queryRef = db
      .collection("Dashboard")
      .where("userId", "==", req.query.userId);

    const snapshot = await queryRef.get();
    if (snapshot.empty) {
      res
        .send({
          status: "operation failed",
        })
        .end();
    } else {
      if (req.body.firstName) {
        snapshot.docs.map((doc) => {
          doc.ref.set(
            {
              userName: { firstName: req.body.firstName },
            },
            {
              merge: true,
            }
          );
        });
      }
      if (req.body.lastName) {
        snapshot.docs.map((doc) => {
          doc.ref.set(
            {
              userName: { lastName: req.body.lastName },
            },
            {
              merge: true,
            }
          );
        });
      }
      if (req.body.userDob) {
        snapshot.docs.map((doc) => {
          doc.ref.set(
            {
              userDob: new Date(req.body.userDob),
            },
            {
              merge: true,
            }
          );
        });
      }
      if (req.body.primaryContact && req.body.alternateContact) {
        snapshot.docs.map((doc) => {
          doc.ref.set(
            {
              userContacts: [
                parseInt(req.body.primaryContact),
                parseInt(req.body.alternateContact),
              ],
            },
            {
              merge: true,
            }
          );
        });
      }
      if (req.body.userCity) {
        snapshot.docs.map((doc) => {
          doc.ref.set(
            {
              userCity: req.body.userCity,
            },
            {
              merge: true,
            }
          );
        });
      }

      if (req.body.userState) {
        snapshot.docs.map((doc) => {
          doc.ref.set(
            {
              userState: req.body.userState,
            },
            {
              merge: true,
            }
          );
        });
      }
    }
  }
});

server.get("/users", async (req, res) => {
  const docref = await db.collection("Dashboard").get();
  if (docref.empty) {
    res.send("data not found").end();
  }
  const docs = docref.docs.map((doc) => doc.data());
  res.send(docs).end();
});
server.delete("/deleteUser", async function (req, res) {
  if (parseInt(req.query.apiKey) != parseInt(apiKey)) {
    console.log("invalid key");
    res.end();
    return;
  } else {
    const snapshot = await db
      .collection("Dashboard")
      .where("userId", "==", req.query.userId)
      .get();
    if (snapshot.empty) {
      res
        .send({
          status: "No such document found!",
        })
        .end();
    }

    const result = snapshot.docs.map(async (doc) => await doc.ref.delete());
    res.send().end();
  }
});

server.listen(5000, () => {
  console.log("server listning!!");
});
