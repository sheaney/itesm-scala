if (!global.hasOwnProperty('db')) {
    var Sequelize = require('sequelize');
    var sq = null;
    var fs = require('fs');
    var PGPASS_FILE = '.pgpass';
    if (process.env.DATABASE_URL) {
        /* Remote database
           Do `heroku config` for details. We will be parsing a connection
           string of the form:
           postgres://bucsqywelrjenr:ffGhjpe9dR13uL7anYjuk3qzXo@\
           ec2-54-221-204-17.compute-1.amazonaws.com:5432/d4cftmgjmremg1
        */
        var pgregex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
        var match = process.env.DATABASE_URL.match(pgregex);
        var user = match[1].trim();
        var password = match[2].trim();
        var host = match[3].trim();
        var port = match[4].trim();
        var dbname = match[5].trim();
        var config =  {
            dialect:  'postgres',
            protocol: 'postgres',
            port:     port,
            host:     host,
            logging:  true //false
        };
        sq = new Sequelize(dbname, user, password, config);
    } else {
        /* Local database
           We parse the .pgpass file for the connection string parameters.
        */
        var pgtokens = fs.readFileSync(PGPASS_FILE).toString().split(':');
        var host = pgtokens[0].trim();
        var port = pgtokens[1].trim();
        var dbname = pgtokens[2].trim();
        var user = pgtokens[3].trim();
        var password = pgtokens[4].trim();
        var config =  {
            dialect:  'postgres',
            protocol: 'postgres',
            port:     port,
            host:     host,
        };
        var sq = new Sequelize('itesm', 'sheaney', 'scala', config);
        //var sq = new Sequelize(dbname, user, password, config);
    }
    global.db = {
        Sequelize: Sequelize,
        sequelize: sq,
        UserInfo: sq.import(__dirname + '/userinfo')
    };
}
module.exports = global.db;
