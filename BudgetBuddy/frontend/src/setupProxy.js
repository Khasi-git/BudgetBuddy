const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/google-signin',
    createProxyMiddleware({
      target: 'http://172.17.0.2:8080',
      changeOrigin: true,
      secure: false,
      timeout: 60000, // 60 seconds
      proxyTimeout: 60000 // 60 seconds
    })
  );
};
