var streamChat = require('stream-chat');
//var streamChannel = require('stream-chat-react');
const axios = require('axios').default;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/registrations', async (req, res, next)=>{
  // create a lead in zendesk
      const payload = {
          'data': {
            //representative sample of possible Lead fields used in this tutorial, many more are available
            'first_name': `${req.body.firstName}`,
            'last_name': `${req.body.lastName}`,
            'description': 'Lead created through Chat Inquiry',
            'email': `${req.body.email}`
          }
      }
      const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
      } 
      try {
          const response = await axios.post('https://api.getbase.com/v2/leads', payload,{headers});
      } catch(error){
          console.log('BODY',error.response.data.errors)
          console.log('ERROR',error)
      } 

    // create a stream user
    
      try {
        const data = req.body;
        const apiKey = process.env.STREAM_API_KEY;
        const apiSecret = process.env.STREAM_API_SECRET;
        const client = new streamChat.StreamChat(apiKey, apiSecret);
        const user = {
          id: `${req.body.firstName}`,
          role: 'user',
          image: `https://robohash.org/${req.body.email}`
        };
        await client.updateUsers([user, {id:'sales-admin', role:'admin'}]);
        const token = client.createToken(user.id);
        const channel = client.channel('messaging', user.id, {
          members: [user.id, 'sales-admin'],
      });
        res.status(200).json({
          userId:user.id,
          token,
          channelId: channel.id,
          apiKey
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: error.message
        });
      }    
});

module.exports = router;
