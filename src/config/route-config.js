module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");

        if(process.env.NODE_ENV === 'test') {
            const mockAuth = require('../../spec/support/mock-auth.js');
        }

        app.use(staticRoutes);
    }
}