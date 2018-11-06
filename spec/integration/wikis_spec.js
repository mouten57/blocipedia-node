const request = require('request');
const server = require('../../src/server');
const sequelize = require('../../src/db/models').sequelize;
const base = 'http://localhost:3000/wikis/';
const Wiki = require('../../src/db/models').Wiki;
const User = require('../../src/db/models').User;

describe('routes : wikis', () => {
  beforeEach(done => {
    this.wiki;
    this.user;
    sequelize.sync({ force: true }).then(res => {
      User.create({
        name: 'matt',
        username: 'mateoOuten',
        email: 'mateo@gmail.com',
        password: '123123'
      }).then(user => {
        this.user = user;

        Wiki.create({
          title: 'Wiki demo',
          body: 'Wiki Body',
          private: false,
          userId: this.user.id
        })
          .then(wiki => {
            this.wiki = wiki;
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe('STANDARD memeber performing CRUD actions for Wiki', () => {
    beforeEach(done => {
      request.get(
        {
          url: 'http://localhost:3000/auth/fake',
          form: {
            role: 'standard'
          }
        },
        (err, res, body) => {
          done();
        }
      );
    });
    // describe('GET /wikis', () => {
    //   it('should return a status code 200 and all wikis', done => {
    //     request.get(base, (err, res, body) => {
    //       expect(res.statusCode).toBe(200);
    //       expect(err).toBeNull();
    //This body needs work. Index isn't showing because there's no currentUser
    //       expect(body).toContain("Wiki demo");
    //       console.log(body);

    //       done();
    //     });
    //   });
    // });
  });
});
