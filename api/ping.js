const cors = require('../lib/cors');
const handler = (req,res) =>{
  if(req.method === 'GET'){
    res.send({pong:"pong"});
    return;
  }
  res.status(404);
  res.end();
  return;
}

module.exports = (req,res)=>cors(req,res,handler);
