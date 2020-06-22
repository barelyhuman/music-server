const Cors = require('cors');
const runMiddleware = require('../lib/run-middleware');

module.exports = async (req,res,handler) => {
  try{
    const cors = Cors();

    await runMiddleware(req,res,cors);
    
    return handler(req,res);

  }catch(err){
    res.setHeader('Content-Type','application/json');
    res.statusCode=500;
    res.write(JSON.stringify({error:'Oops! Something went wrong'}));
    res.end();
    throw err;
  }
}

