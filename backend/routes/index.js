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
              'first_name': `${req.body.firstName}`,
              'last_name': `${req.body.lastName}`,
              'organization_name': '',
              'source_id': 1469923,
              'title': '',
              'description': 'Lead created through Chat Inquiry',
              'industry': '',
              'website': '',
              'email': `${req.body.email}`,
              'phone': '',
              'mobile': '',
              'fax': '',
              'twitter': '',
              'facebook': '',
              'linkedin': '',
              'skype': '',
              'address': {
                'line1': '',
                'city': '',
                'postal_code': '',
                'state': '',
                'country': ''
              },
              'tags': [
                'important'
              ],
              'custom_fields': {
                'known_via': ''
              }
            }
        }
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 9317ff015ef828ef5fd2c2869f6d3a70810f8f2c62f443eab40a1254c7f6db36'
        } 
        try {
            const response = await axios.post('https://api.getbase.com/v2/leads', payload,{headers});
        } catch(error){
            console.log('EMAILRESPONSE',`${res.body}`)
            console.log('RESDATA',res.data)
            console.log('RES',res)
            console.log('BODY',error.response.data.errors)
            console.log('ERROR',error)
        }
 
    //  }
    // create a stream user
    
      try {
        const data = req.body;
        const apiKey = 'egf5n586twvh';
        const apiSecret = 'ahwrb765dgh9rjs33pvzxx7z5vwwaqzz6cj2q8m5tctab6yx2gdu3sc6wyh5g7zg';
        const client = new streamChat.StreamChat(apiKey, apiSecret);
        const user = Object.assign({}, data, {
          id: `${req.body.firstName}`,
          role: 'admin',
          image: `https://robohash.org/${req.body.email}`
        });
        const token = client.createToken(user.id);
        const channel = client.channel('messaging', 'godevs', {
          // add as many custom fields as you'd like
          image: `https://robohash.org/${req.body.email}`,
          name: 'CRM Inquiry',
        });
        await client.updateUsers([user]);
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
    
    // create a stream channel
    // generate a frontend stream token for that user

    // res.send({
    //     userId: 'bitter-unit-5',
    //     //token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYml0dGVyLXVuaXQtNSJ9.Y8LXEx6Fcfc7XTbQzBYNE7yv3EWs6vyMWTBtxt4rC-c',
    //     token,
    //     channelId: 'godevs'
    // })
});

module.exports = router;
