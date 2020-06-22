const cors = require('../lib/cors');
const handler = (req,res) =>{
  if(req.method === 'GET'){
    res.write(JSON.stringify({
      pong:"pong"
    }));
    res.end();
    return;
  }
  res.statusCode = 404;
  res.end();
  return;
}

module.exports = (req,res)=>cors(req,res,handler);
