'use strict';

require('dotenv').config();

if(!process.env.NODE_ENV){
    throw new Error('undefined NODE_ENV');
}
//If the software isn't in production, load babel
if(process.env.NODE_ENV!=='producttion'){
    require('babel-register');
}
//This combines everything.
require('./src/main');