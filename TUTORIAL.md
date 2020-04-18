## Tutorial

This project uses Node.js, Express, Superagent, MongoDB, Mongoose, and node-html-parser deployed to Heroku. This tutorial requires some familiarity with Node.js, Express, and MongoDB, but we have linked resources for you as well. Other technologies are available!

### Getting set up

For this project you'll need to set up a Node.js server. We used Express.js but you can use whatever you want! Check out [this tutorial](https://www.guru99.com/node-js-express.html).

### Things to consider before scraping:
Think about what you are scraping and how often that data changes. 
  ###### If you are scraping data for a streaming service (Netflix, Hulu, etc.), think about how often shows are added to those sites. Do you have a schedule for how you want to maintain your API to keep it up to date? How will you maintain versioning on your API? 

### Step 1: Get set up to scrape some data!

- You will need a parser package (there are 100s of them available so you can use whatever you want). For this project we used [node-html-parser](https://www.npmjs.com/package/node-html-parser).
- You will also need to install an npm package to help with the request. We used [super-agent](https://www.npmjs.com/package/superagent).

`> npm install -D node-html-parser superagent`

- Now make a _scraper.js_ file at the root of your repo
- Add a function to make the initial request

```
const request = require('superagent');
const { parse } = require('node-html-parser');

const scraper = () => {
  return request
    .get([your url here])
    .then(res => res.text)
    .then(parse)
    .then(console.log);
};

scraper();

module.exports = { scraper };
```

- Now you should be able to run `node scraper.js` and see some html data appear in your console

### Step 2: Make a game plan

Open up your dev tools and inspect the elements that hold the data you need to scrape. In our case, the first thing we needed to do was grab each `h2` header with the class `pi-title`. Here's a screenshot to see what we started with this:

![Game Plan](inspectView.png)

#### First things first

- We can grab a series of elements like the `h2` by using the `querySelectorAll` method on the html we get back from the parser. To do this we made a helper function. Be sure to look at the documentation for your npm parser to see what kinds of selectors are available.

```
const titlesList = html => html
  .querySelectorAll('h2 .pi-title')
  .map(node => node.rawText);
```

- add your helper function to your request function

```
const scraper = () => {
  return request
    .get('url')
    .then(res => res.text)
    .then(parse)
    .then(titlesList)
    .then(console.log);
};
```

run `node scraper.js` again

At this point you should be able to see the data and start to make decisions about how to grab different elements, run some clean up functions and start to piece it all together to match your db schema.

### Step 3: Database 

_We are using [MongoDB](https://docs.mongodb.com/manual/tutorial/getting-started/) with [Mongoose ODM](https://mongoosejs.com/docs/index.html) (object data modeling). The Mongoose documentation is top notch, whereas the MongoDB docs could use some work. Please reference their documentation for more information. **You will need MongoDB set up on your computer to follow along.** This is how we set up our database._

#### a. Set up your schema

Your schema is how you want your data to look in your database. Basically it is a blueprint for MongoDB. Since all of our data is information about the characters of _Stranger Things_ we need a character schema. For each key value pair from our data, we need to specify it's type. i.e. Here is a character we scraped:

```
{
  name: 'Eleven'
}
```

So we need to tell Mongoose that we are expecting all character's names to be a _string_.

Here is a short snippet:

```
// See full file in ./lib/models/Character.js

const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: String,
  aliases: {
    type: [String],
    default: ['unknown']
  },
});

module.exports = mongoose.model('Character', characterSchema);
```

You'll notice that 'aliases' has a type `[String]`; this is to specify that all aliases are arrays of strings. 

The default value is for characters that do not have an 'aliases' field. This is an optional field. (There is also an optional 'required' field, which is defaulted to false.)

#### b. Set up your connection

1. You are going to need to connect your application to your database. We also want to listen for on, off, and error events for our connection. Check out our connect.js file. You will see we import and call our event listeners into our server.js file as 

    `require('lib/utils/connect.js')();`

2. Your local db name should remain private to you. Set up an .env file and store your `MONGODB_URI=` link there. See our `.env.example` file in the root of our project. _Don't forget to add .env to your .gitignore file!_

    To access your environment variables, you need to run

    ` > npm i dotenv `

    and add this to the top of your server.js file

    `require('dotenv').config();`

3. Try running your server. Remember, first you will need to run `gomongo`. Then run your server.js file. You should be able to see the following log:

    ```
    listening on PORT ${PROCESS.ENV_PORT}
    Connection open on mongodb:${PROCESS.ENV_MONGODB_URI}
    ```

#### c. Seed your database
In order to seed your database, you will need:
```
// access to your MONGODB_URI
require('dotenv').config(); 

// connection to your db
require('./lib/utils/connect')(); 

// your scraper function
const scrapeData = require('./scrapers/infoScraper'); 

// your mongoose schema
const Character = require('./lib/Models/Character'); 
```

We set all of this up in it's own file in the root of our application.

```
// ./seed.js

// don't forget to close the connection when finished!
const mongoose = require('mongoose'); 

scrapeData()
  .then(chars => Character.create(chars))
  .finally(() => mongoose.connection.close()); 
```

To check out your data, we used [Robo3T](https://robomongo.org/), a free, open source MongoDB GUI. Check out their website for documentation on how to download and set this up on your machine. 

#### Step 4: Routes
This section requires some familiarity with [Express Router](http://expressjs.com/en/5x/api.html#router). 

This section will just be a summary of the functionality of each of our routes. 

**Hot Tip** 
We recommend thinking of your users and data. What data would your users want? If you have _a lot_ of data, consider pagination as an option. Try and bounce off ideas with other devs to come up with your routes. 

##### a. Get character by id
    
    .get('/:id', (req, res, next) => {
      Character
        .findById(req.params.id)
        .select('-__v')
        .then(character => res.send(character))
        .catch(next);
    })
    

##### b. Get random character(s)
  Our get route looks very similar here... 

    
    .get('/random', (req, res, next) => {
      const { count = 1 } = req.query;
      Character
        .getRandom(+count)
        .then(character => res.send(character))
        .catch(next);
    })

  You'll notice a custom static called 'getRandom' being used. You can create your own static method in your model schema. Check out the [docs](https://mongoosejs.com/docs/2.7.x/docs/methods-statics.html) to learn more.

    characterSchema.statics.getRandom = function(count) {
      return this.aggregate([{ $sample: { size: count }}, {$project: { __v: false}}]);
    };

##### c. Get characters + pagination + queries
  For our get all characters route, we repurposed it to handle multiple functionalities including pagination and all queries. Check out the source code:

    .get('/', (req, res, next) => {
    const { page = 1, perPage = 20, ...search } = req.query;

    const query = Object.entries(search)
      .reduce((query, [key, value]) => {
        query[key] = new RegExp(value, 'gmi');
        return query;
      }, {});

    Character
      .find(query)
      .skip(+perPage * (+page - 1))
      .limit(+perPage)
      .lean()
      .select('-__v')
      .then(characters => res.send(characters))
      .catch(next);
    });

### Step 5: Deploy!

We decided to deploy to Heroku! Here are some resources:
* [Deploying NodeJS App](https://devcenter.heroku.com/articles/deploying-nodejs)
* [Deploying with Git](https://devcenter.heroku.com/articles/git)
* [mLab noSQL DB set-up](https://devcenter.heroku.com/articles/mongolab)

### Step 6: Document!

Take the time to document your application either in a README or create a front end! Provide information on your routes and what type of data users will be accessing. 

**Share your APIs with us on Twitter! [@katerj](https://twitter.com/katerj) [@paigeegorry](https://twitter.com/paigeegorry)**
