const path = require('path');
const appRoot = path.dirname(require.main.filename);

module.exports = {
    CONTROLLERSPATH:path.join(appRoot,'controllers'),
    GLOBFILEEXCEPTIONS : ['index.js']
}