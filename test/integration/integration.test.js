#!/usr/bin/env node

var newman = require('newman');
var rimraf = require('rimraf');

process.env.DEBUG = 'lumi:*';
process.env.NODE_ENV = 'test';
process.env.DB = './test_db/';

var lumi = require('../../build/server/boot');

lumi.boot(() => {
    newman.run(
        {
            collection: require('./Lumi.postman_collection.json'),
            environment: require('./Lumi.postman_environment.json'),
            reporters: 'cli'
        },
        function(err) {
            if (err) {
                throw err;
            }
            rimraf(process.env.DB, () => {
                process.exit(0);
            });
        }
    );
});
