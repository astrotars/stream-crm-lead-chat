const axios = require('axios').default;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/registrations',  (req, res, next)=>{
    // create a lead in salesforce
    //async function asyncFunc() {
        // post data to a url endpoint
    const response = axios.post('htts://salesforce.com');
    //  }
    // create a stream user
    // create a stream channel
    // generate a frontend stream token for that user

    res.send({
        userId: 'bitter-unit-5',
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYml0dGVyLXVuaXQtNSJ9.Y8LXEx6Fcfc7XTbQzBYNE7yv3EWs6vyMWTBtxt4rC-c',
        channelId: 'godevs'
    })
});

module.exports = router;
