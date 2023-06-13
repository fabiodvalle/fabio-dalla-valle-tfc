import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamsModel from '../database/models/TeamsModel';
import teams from './mocks/teams.mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams', () => {
  beforeEach(sinon.restore);

  it('getAllTeams', async function() {
    sinon.stub(TeamsModel, 'findAll').resolves(teams as any);

    const response = await chai.request(app).get('/teams');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(teams);
  });
  it('getTeamById', async function() {
    sinon.stub(TeamsModel, 'findByPk').resolves(teams[0] as any);

    const response = await chai.request(app).get('/teams/1');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(teams[0]);
  });
});
