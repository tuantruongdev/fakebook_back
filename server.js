const app = require("./app");

const port=3001;
app.listen(port, () => {
  console.log("app is listening on port "+port);
});
