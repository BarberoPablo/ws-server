const express = require("express");
const cors = require("cors");
const coopeRoutes = require("./routes/coopeRoutes");

const app = express();
const port = 3001;

app.use(cors());

app.use(coopeRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
