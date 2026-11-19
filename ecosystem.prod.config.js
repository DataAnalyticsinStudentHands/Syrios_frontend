module.exports = {
  apps: [
    {
      name: 'Syrios Frontend Main',
      cwd: __dirname,
      // sirv indexes build files at startup; restart PM2 after each rebuild.
      script: './node_modules/sirv-cli/bin.js',
      // Deep links load the app shell; missing assets keep real 404 responses.
      args: ['build', '--single', '--ignores', '^/assets(?:/|$)', '--port', '3000', '--host', '0.0.0.0'],
    },
  ],
};
