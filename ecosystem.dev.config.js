module.exports = {
  apps: [
    {
      name: 'Syrios Frontend dev',
      cwd: __dirname,
      // The staging proxy must strip /dev/ before forwarding requests here.
      // sirv indexes build files at startup; restart PM2 after each rebuild.
      script: './node_modules/sirv-cli/bin.js',
      // Keep asset 404s and revalidate staging files without enabling dev mode.
      args: ['build', '--single', '--ignores', '^/assets(?:/|$)', '--port', '5000', '--host', '0.0.0.0', '--maxage', '0'],
    },
  ],
};
