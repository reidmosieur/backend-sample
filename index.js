const express = require("express");
const app = express();
const port = 3000;

// TODO
// this should scale reasonably well for in memory.
// performance could be improved with a Set or a Map
// but would tradeoff simplicity by requiring unique keys.
// privacy would require a database to check against for
// opt-outs. similarly, abuse would require a database
// and external API to track IPs that are known abusers

const emailOpensStore = [];

// construct errors and add information to the store
function storeEmailOpen(values) {
  const errors = constructEmailOpenErrors(values);

  emailOpensStore.push({
    ...values,
    errors,
  });

  return errors;
}

// currently just returns the array but could be extended
// to filter, paginate, etc
function readEmailOpens() {
  return emailOpensStore;
}

// check for variables coming from the request that could
// be undefined. could be extended in the future to check
// for additional variables, verify IDs exist, etc
function constructEmailOpenErrors(values) {
  const { campaignId, userId, timestamp, userAgent, userIp } = values;

  if (campaignId && userId && timestamp && userAgent && userIp) {
    return undefined;
  }

  let errors = {};

  if (!campaignId) errors.campaignId = "Campaign ID is missing";
  if (!userId) errors.userId = "User ID is missing";
  if (!timestamp) errors.timestamp = "Timestamp is missing";
  if (!userAgent) errors.userAgent = "User agent is missing";
  if (!userIp) errors.userIp = "User IP is missing";

  return errors;
}

// put all of the write logic together.
// we're writing all events here, even if they
// should throw an error since it's best to track all
// events
function handleEmailOpened(req) {
  const { campaignId, userId } = req.query;
  const timestamp = new Date();
  const userAgent = req.get("user-agent");
  const userIp = req.ip;

  const values = { campaignId, userId, timestamp, userAgent, userIp };

  const errors = storeEmailOpen(values);

  console.log("Email opened:", JSON.stringify(values, null, 2));

  return errors;
}

app.get("/open", (req, res) => {
  const errors = handleEmailOpened(req);

  if (errors) return res.status(400).send();
  return res.send();
});

app.get("/opens", (req, res) => {
  const opens = readEmailOpens();

  console.log("Read email opens");

  return res.json(opens);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
