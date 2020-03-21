require('dotenv').config();
require('./lib/utils/connect')();
const chalk = require('chalk');
const app = require('./lib/app');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(chalk.greenBright(`listening at PORT ${PORT}`));
});
