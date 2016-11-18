'use strict';

var context = require.context('./test/__tests__/', true, /-test\.js(x)?$/);
context.keys().forEach(context);