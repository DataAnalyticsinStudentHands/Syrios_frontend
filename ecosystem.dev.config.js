module.exports = {
  apps: [
    {
      name: 'Syrios Frontend dev',
      cwd: __dirname,
      script: './node_modules/http-server/bin/http-server',
      args: 'build -p 5000 -c-1',
    },
  ],
};
