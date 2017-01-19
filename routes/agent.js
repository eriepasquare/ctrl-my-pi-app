var express = require('express');
var router = express.Router();

var https = require('https');
var fs = require('fs');

var myAgent = new https.Agent({ keepAlive: true, domain: process.env.AGENT_HOST });

router.get('/:agentid/*?', function(req, res){
    if (!req.user) {
      // res.status(401);
      // res.render('error', { error: "User is not authenticated" });
      res.redirect('/#!/logins');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    var agentid = req.params.agentid;
    var agentReqPath = req.params[0];
    var agentResBody, agentResStatus;

    //TODO: get ssl_req_opts from "agentid" configuration
    var options = {
        host:       process.env.AGENT_HOST,
        port:       process.env.AGENT_PORT,
        method:     'GET',
        path:       '/agent/'+agentReqPath,
        pfx:        fs.readFileSync(process.env.AGENT_SSL_PKCS12_KEY),
        passphrase: process.env.AGENT_SSL_PKCS12_PP,
        ca:         fs.readFileSync(process.env.SSL_CA_CERT),
        agent:      myAgent
    };

    https.get(options, function(agentRes) {

      agentResStatus = agentRes.statusCode;
      agentResBody = "";
      agentRes.on("data", function(chunk) {
        agentResBody = agentResBody + chunk;
      });
      agentRes.on('end', function () {
        res.render('jsonpassthrough', {body: agentResBody });
      });

    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
});


module.exports = router;
