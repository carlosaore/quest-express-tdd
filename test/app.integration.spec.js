// test/app.integration.spec.js
const request = require('supertest');
const app = require('../app');
const connection = require('../connection');

describe('GET /bookmarks/:id', () => {
    const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
    beforeEach((done) => connection.query(
      'TRUNCATE bookmark', () => connection.query(
        'INSERT INTO bookmark SET ?', testBookmark, done
      )
    ));

    it('Error case: we provide a id that doesn\'t match any bookmarks in the database', (done) => {
        const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
        beforeEach((done) => connection.query(
            'TRUNCATE bookmark', () => connection.query(
            'INSERT INTO bookmark SET ?', testBookmark, done
        )
        ));
        request(app)
        .get('/bookmarks/2')
        .expect(404)
        .expect('Content-Type', /json/)
        .then(response => {
            const expected = { error: 'Bookmark not found' };
                expect(response.body).toEqual(expected);
                done();
        });
    });

    it('Success case: a id that does exist', (done) => {
        const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
        beforeEach((done) => connection.query(
            'TRUNCATE bookmark', () => connection.query(
            'INSERT INTO bookmark SET ?', testBookmark, done
        )
        ));
        request(app)
        .get('/bookmarks/1')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
            const expected = { "id": 1, "url": "https://nodejs.org/", "title": "Node.js" };
                expect(response.body).toEqual(expected);
                done();
        })
    .catch(done);
    });
});