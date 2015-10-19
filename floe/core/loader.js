__ = function(module) {

    try {

        return require(__core + '/objects/'+ module);

    } catch(err) {

        app.emit('error', err);

    }

};
