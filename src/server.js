const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const boot = require('./boot');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use(cors());
app.use(bodyParser.json());

boot.processBoot(app)
    .then(() => {

        app.use('/api', routes(app));

        app.listen(PORT, () => {
            console.log("Listening on " + PORT);
        });

    })
    .catch(err=>{throw err;});



module.exports = app;