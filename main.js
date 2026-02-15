const app = require("./index");
const connectDB = require("./Config/db");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});