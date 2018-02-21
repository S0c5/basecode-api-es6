import app from './bootstrap';

if (require.main === module) {
  console.log(`bootstraping app with env: ${process.env.NODE_ENV || 'development'}`);
  app.listen()
    .then(port => console.log(`correct listen on port ${port}`));
}
