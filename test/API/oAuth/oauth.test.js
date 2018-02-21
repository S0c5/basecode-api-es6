describe('oAuth2', () => {
  const User = db.model('user');
  const Client = db.model('client');

  let user;
  let credentials;
  let client;

  before(async () => {
    await db.clear();
    user = await User.create({ email: 'cat@catdog.com' });
    client = await Client.create({ name: 'desktop-app' });
    user.password = 'admin123';
  });

  it('Must reject because have an invalid client credentials', () =>
    request
      .post('/oauth2/token')
      .send({
        grant_type: 'password',
        client_id: 'foo',
        client_secret: 'foo',
        username: user.email,
        password: user.password,
      })
      .expect(401));

  it('Must be reject because have an invalid user credentials', () =>
    request
      .post('/oauth2/token')
      .send({
        grant_type: 'password',
        client_id: client.id,
        client_secret: client.secret,
        username: 'foo',
        password: 'foo',
      }).expect(403));

  it('Get refresh and token', () => request.post('/oauth2/token').send({
    grant_type: 'password',
    client_id: client.id,
    client_secret: client.secret,
    username: user.email,
    password: user.password,
  })
    .type('json')
    .expect(200)
    .then((res) => {
      credentials = res.body;
    }));
  it('Get token by refresh token', () => request.post('/oauth2/token').send({
    grant_type: 'refresh_token',
    client_id: client.id,
    client_secret: client.secret,
    refresh_token: credentials.refresh_token,
  }).expect(200));
});