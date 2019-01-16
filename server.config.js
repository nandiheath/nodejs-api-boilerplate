module.exports = {
  apps: [{
    name: 'oibs-api',
    script: './src/server.js',
    watch: false,
    max_restarts: 5,
    restart_delay: 1000
  }],
};
