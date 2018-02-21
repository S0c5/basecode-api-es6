describe('User', () => {
  const User = db.model('user');
  const userNew = User.mock();
  let userCustomer;

  before(async () => {
    userCustomer = await User.createAndLogin({ email: 'batman@baticueva.com', role: 'admin' });
  });

  it('#create: needs authentication', () =>
    request
      .post('/users')
      .set(userCustomer.token)
      .send(userNew)
      .expect(200)
      .then(res => res.body)
      .then((body) => {
        body.email.should.equal(userNew.email);
        userNew._id = body._id;
      }));

  it('#read: can read unauthenticated', () =>
    request
      .get(`/users/${userNew._id}`)
      .expect(200)
      .then(res => res.body)
      .then((body) => {
        body.email.should.equal(userNew.email);
      }));

  it('#update: need authentication', () =>
    request
      .put(`/users/${userNew._id}`)
      .set(userCustomer.token)
      .send({ email: 'someNewEmail@gmail.com' })
      .expect(200)
      .then(res => res.body)
      .then((body) => {
        body.email.should.equal('someNewEmail@gmail.com');
      }));

  it('#delete: need authentication', () =>
    request
      .delete(`/users/${userNew._id}`)
      .set(userCustomer.token)
      .expect(200)
      .then(res => res.body)
      .then((body) => {
        body.status.should.equal('disabled');
      }));

  it('#list: can list users unauthenticated', () =>
    request
      .get('/users')
      .expect(200)
      .then(res => res.body)
      .then((body) => {
        body.length.should.above(1);
      }));
});
