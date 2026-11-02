module.exports = {
  apps: [
    {
      name: 'Syrios Frontend Main',
      cwd: __dirname,
      script: './node_modules/http-server/bin/http-server',
      args: 'build -p 3000',
    },
  ],
};
