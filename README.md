# stranger-things-api
Authors > [Paige Gorry](https://github.com/paigeegorry) | 
[Kate Dameron](https://github.com/katedam)

**[stranger-things-api.fly.dev](https://stranger-things-api.fly.dev)**

---

## #API_Documentation

Explore our API here: [strangerthingsapi.netlify.app](https://strangerthingsapi.netlify.app/docs)

### Routes 
**`GET /api/v1/characters`** - get all characters (default 20 per page)

**`GET /api/v1/characters?perPage=<num>?page=<num>`** - edit/page through character list

**`GET /api/v1/characters/:id`** - get character by their id

**`GET /api/v1/characters/random?count=<num>`** - get a random character (default 1)

**`GET /api/v1/characters?name=<string>`** - get character by their name

**`GET /api/v1/characters?<query>=<string>`** - get character by a specific query string (see options below)

**queries available:** aliases, otherRelations, affiliation, occupation, residence, appearsInEpisodes, status, gender, eyeColor, born, hairColor, portrayedBy

## Character Schema
This are the type defs for the data returned.
```
{
  name: String,
  photo: String,
  status: String,
  born: String,
  aliases: {
    type: [String],
    default: ['unknown']
  },
  otherRelations: {
    type: [String],
    default: ['unknown']
  },
  affiliation: {
    type: [String],
    default: ['unknown']
  },
  occupation: {
    type: [String],
    default: ['unknown']
  },
  residence: {
    type: [String],
    default: ['unknown']
  },
  gender: String,
  eyeColor: String,
  hairColor: String,
  portrayedBy: String,
  appearsInEpisodes: {
    type: [String],
    default: ['unknown']
  },
}
```

## Example
**GET /api/v1/characters?name=Eleven**
```
[
  {
    "_id": "5e77d8d2caf0952a9c8499d9",
    "aliases": [
      "El",
      "011",
      "Jane Ives",
      "The Weirdo",
      "Eleanor",
      "Shirley Temple",
      "Mage"
    ],
    "otherRelations": [
      "Mike Wheeler",
      "Dustin Henderson",
      "Lucas Sinclair",
      "Max Mayfield",
      "Will Byers",
      "Jonathan Byers",
      "Benny Hammond",
      "Martin Brenner"
    ],
    "affiliation": [
      "Hawkins National Laboratory",
      "Party",
      "Ives family",
      "Hopper family"
    ],
    "occupation": [
      "Lab test subject (formerly)"
    ],
    "residence": [
      "Hawkins, Indiana (1971 - 1985)",
      "Byers house (July 1985 - October 1985)",
      "Hopper cabin (December 1983 - July 1985)",
      "Wheeler basement (November 1983)",
      "Hawkins National Laboratory (1971 - November 1983)"
    ],
    "appearsInEpisodes": [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25"
    ],
    "photo": "https://vignette.wikia.nocookie.net/strangerthings8338/images/f/f1/Eleven_S03_portrait.png/revision/latest/scale-to-width-down/286?cb=20190722075442",
    "name": "Eleven",
    "status": "Alive",
    "born": "1971",
    "gender": "Female",
    "eyeColor": "Brown",
    "hairColor": "Brown",
    "portrayedBy": "Millie Bobby Brown"
  }
]
```

**Say hi on Twitter! [@katerj](https://twitter.com/katerj) [@paigeegorry](https://twitter.com/paigeegorry)**

