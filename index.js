const app = require("./src/app");
const connect = require("./src/config/db");
let port = process.env.PORT || 2345;
app.listen(port, async () => {
  try {
    await connect();
    console.log(`Listening on port ${port}`);
  } catch (e) {
    console.log(e);
  }
});
