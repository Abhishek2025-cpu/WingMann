const cron = require("node-cron");
const CallSession = require("../models/CallSession");

cron.schedule("* * * * *", async () => {
  const now = new Date();

  await CallSession.updateMany(
    {
      status: "ACCEPTED",
      expiresAt: { $lte: now }
    },
    {
      status: "ENDED",
      endedAt: now
    }
  );
});
