import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UsersModel from '../database/models/UsersModel';

chai.use(chaiHttp);

const { expect } = chai;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY4Njc2MzgzMn0.-_zGAqz107iPqjJkC4MzIX0GZDkCa3EVUkS43-IWzr8';

describe('Users', () => {
  beforeEach(sinon.restore);

  it('login sem email', async function() {
    const response = await chai.request(app).post('/login').send({ email: '', password: '123456' });

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
  });
  it('email inválido', async () => {
    sinon.stub(UsersModel, 'findOne').resolves(null);
    const response = await chai.request(app).post('/login').send({ email: 'sasaddad', password: 'adasdasdas' });
    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  })
  it('email não casdastrado', async () => {
    sinon.stub(UsersModel, 'findOne').resolves(null);
    const response = await chai.request(app).post('/login').send({ email: 'admin@amin.com', password: 'adaaassd' });
    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  })
  it('password tamanho inválido', async () => {
    sinon.stub(UsersModel, 'findOne').resolves(null);
    const response = await chai.request(app).post('/login').send({ email: 'admin@admin.com', password: 'adasd' });
    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  })
  it('password inválido', async () => {
    const userInstance = UsersModel.build(
      {
        username: 'Admin',
        role: 'admin',
        email: 'admin@admin.com',
        password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
      },
    );
    sinon.stub(UsersModel, 'findOne').resolves(userInstance);
    const response = await chai.request(app).post('/login').send({ email: 'admin@admin.com', password: 'secret_' });
    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  })
  it('login correto', async () => {
    const userInstance = UsersModel.build(
      {
        username: 'Admin',
        role: 'admin',
        email: 'admin@admin.com',
        password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
      },
    );
    sinon.stub(UsersModel, 'findOne').resolves(userInstance);
    const response = await chai.request(app).post('/login').send({ email: 'admin@admin.com', password: 'secret_admin' });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  })
  it('login/role sem token', async () => {
    const response = await chai.request(app).get('/login/role');
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message', 'Token not found');

  })
  it('login/role token inválido', async () => {
    const response = await chai.request(app).get('/login/role').set('Authorization', 'token');
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message', 'Token must be a valid token');

  })
  // it('login/role token válido', async () => {
  //   const response = await chai.request(app).get('/login/role').set('Authorization', token);
  //   console.log(response);
    
  //   expect(response.status).to.equal(200);
  //   expect(response.body).to.have.property('role');

  // })
});
