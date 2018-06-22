const mongoose = require('mongoose');
const server = require('./api/server');
const Game = require('./games/Game');
const request = require('supertest');

const mockData = [
  {
    title: 'Super Game',
    genre: 'The engagest',
    releaseDate: 'Just now',
  },
  {
    title: 'Super Game 2',
    genre: 'The engagest',
    releaseDate: 'Just tomorrow',
  },
  {
    title: 'Super Game 3',
    genre: 'The engagest',
    releaseDate: 'Just after tomorrow',
  },
];

describe('The API Server', () => {
  beforeAll(() => {
    return mongoose
      .connect('mongodb://localhost/test')
      .then(async () => {
        console.log('\n=== connected to TEST DB ===');
        await Game.insertMany(mockData)
          .then(games => {
            // console.log('GAMES CREATED: ', games);
            Game.find({})
              .then(respoonse => {
                console.log('======== MOCK DATA CREATED ========');
              })
              .catch(e => {
                console.log('ERROR ADDING MOCK DATA TO DATABASE');
              });
          })
          .catch(e => {
            console.log('error', e);
          });
      })
      .catch(err => {
        console.log('error connecting to TEST database, is MongoDB running?');
      });
  });

  afterAll(async () => {
    await Game.deleteMany({ genre: 'The engagest' })
      .then(deleteAll => {
        console.log('deleteAll', deleteAll);
      })
      .catch(e => {
        console.log('error', e);
      });
    return mongoose.disconnect().then(() => console.log('\n=== disconnected from TEST DB ==='));
  });

  let gameId;
  // // hint - these wont be constants because you'll need to override them.

  beforeEach(() => {
    //   // write a beforeEach hook that will populate your test DB with data
    //   // each time this hook runs, you should save a document to your db
    //   // by saving the document you'll be able to use it in each of your `it` blocks
  });

  afterEach(() => {
    //   // clear the games collection.
  });

  it('GET', async () => {
    const response = await request(server).get('/api/games');
    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // test the POST here
  test('POST with valid data', async () => {
    const newGame = {
      title: 'Awesome Game',
      genre: 'Awesomes!',
      releaseDate: 'After tee time',
    };
    const res = await request(server)
      .post('/api/games')
      .send(newGame);

    expect(res.body._id).toHaveLength(24);
    expect(res.status).toEqual(201);
  });

  test('POST with no valid data', async () => {
    // Here is missing a 'required' field for Game.model -> The missing field is: 'genre'
    const newBadDAta = {
      title: 'Awesome Game',
      releaseDate: 'After tee time',
    };

    const res = await request(server)
      .post('/api/games')
      .send(newBadDAta);

    expect(res.body.error._message).toEqual('Game validation failed');
    expect(res.status).toEqual(500);
  });
  // test the GET here

  // Test the DELETE here
});
