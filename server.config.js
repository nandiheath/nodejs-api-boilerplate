module.exports = {
  apps: [{
    name: 'nodejs-api-boilderplate',
    script: './src/server.js',
    watch: false,
    max_restarts: 5,
    restart_delay: 1000
  }],
};
