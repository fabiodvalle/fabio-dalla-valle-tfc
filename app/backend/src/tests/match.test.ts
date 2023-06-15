import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchesModel from '../database/models/MatchesModel';
import matchesMock from './mocks/matches.mocks';
import JWT from '../utils/jwt';
import TeamsModel from '../database/models/TeamsModel';

chai.use(chaiHttp);

const { expect } = chai;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY4Njc2MzgzMn0.-_zGAqz107iPqjJkC4MzIX0GZDkCa3EVUkS43-IWzr8';

describe('Matches', () => {
  beforeEach(sinon.restore);

  it('getAllMatches', async function() {
    sinon.stub(MatchesModel, 'findAll').resolves(matchesMock.allMatches as any);

    const response = await chai.request(app).get('/matches');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(matchesMock.allMatches);
  });
  it('getAllMatches inProgress', async function() {
    sinon.stub(MatchesModel, 'findAll').resolves(matchesMock.inProgress as any);

    const response = await chai.request(app).get('/matches?inProgress=true');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(matchesMock.inProgress);
  });
  it('getAllMatches finished', async function() {
    sinon.stub(MatchesModel, 'findAll').resolves(matchesMock.finishedMatches as any);

    const response = await chai.request(app).get('/matches?inProgress=false');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(matchesMock.finishedMatches);
  });
  it('update match', async function() {
    sinon.stub(JWT, 'verify').resolves({ email: 'admin@admin.com', role: 'admin', iat: 1686763832 })
    sinon.stub(MatchesModel, 'update').resolves();

    const response = await chai.request(app).patch('/matches/1').set('Authorization', token);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ message: 'Updated' });
  });
  it('update match finished', async function() {
    sinon.stub(JWT, 'verify').resolves({ email: 'admin@admin.com', role: 'admin', iat: 1686763832 })
    sinon.stub(MatchesModel, 'update').resolves();

    const response = await chai.request(app).patch('/matches/1/finish').set('Authorization', token);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ message: 'Finished' });
  });
  it('create match equal teams', async function() {
    sinon.stub(JWT, 'verify').resolves({ email: 'admin@admin.com', role: 'admin', iat: 1686763832 })
    sinon.stub(MatchesModel, 'create').resolves();

    const response = await chai.request(app).post('/matches/').set('Authorization', token).send(
      {
        "homeTeamId": 16,
        "homeTeamGoals": 2,
        "awayTeamId": 16,
        "awayTeamGoals": 2
      }
    );

    expect(response.status).to.equal(422);
    expect(response.body).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
  });
  it('create match wrong id home team', async function() {
    sinon.stub(JWT, 'verify').resolves({ email: 'admin@admin.com', role: 'admin', iat: 1686763832 })
    sinon.stub(TeamsModel, 'findByPk').resolves();
    sinon.stub(MatchesModel, 'create').resolves();

    const response = await chai.request(app).post('/matches/').set('Authorization', token).send(
      {
        "homeTeamId": 160,
        "homeTeamGoals": 2,
        "awayTeamId": 1,
        "awayTeamGoals": 2
      }
    );

    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({ message: 'There is no team with such id!' });
  });
  it('create match', async function() {
    sinon.stub(JWT, 'verify').resolves({ email: 'admin@admin.com', role: 'admin', iat: 1686763832 })
    // sinon.stub(TeamsModel, 'findByPk').resolves();
    sinon.stub(MatchesModel, 'create').resolves(matchesMock.createdMatchResponse);

    const response = await chai.request(app).post('/matches/').set('Authorization', token).send(
      {
        "homeTeamId": 5,
        "homeTeamGoals": 2,
        "awayTeamId": 1,
        "awayTeamGoals": 2
      }
    );

    expect(response.status).to.equal(201);
    expect(response.body).to.deep.equal(matchesMock.createdMatch);
  });
});
