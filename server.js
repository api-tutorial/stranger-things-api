require('dotenv').config();
require('./lib/utils/connect')();
const app = require('./lib/app');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`listening at PORT ${PORT}`);
});
