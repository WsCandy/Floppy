var rewrite = require('koa-rewrite');

exports.init = function(app) {
    
    // Rewrite timestamped assets
    app.use(rewrite(/(\/.+)\.(\d+)\.([^.\/]+)/, '$1.$3'));
    
}
