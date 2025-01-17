const { override } = require('customize-cra');

module.exports = override((config) => {
    if (config.devServer) {
        config.devServer.setupMiddlewares = (middlewares, devServer) => {
            if (typeof config.devServer.onBeforeSetupMiddleware === 'function') {
                config.devServer.onBeforeSetupMiddleware(devServer);
            }
            if (typeof config.devServer.onAfterSetupMiddleware === 'function') {
                config.devServer.onAfterSetupMiddleware(devServer);
            }
            return middlewares;
        };
    }
    return config;
});
