const streamChat = require('stream-chat');
const axios = require('axios').default;
const express = require('express');
const router = express.Router();

router.post('/registrations', async (req, res, next) => {
    try {
        await axios.post(
            'https://api.getbase.com/v2/leads',
            {
                'data': {
                    'first_name': `${req.body.firstName}`,
                    'last_name': `${req.body.lastName}`,
                    'description': 'Lead created through Chat Inquiry',
                    'email': `${req.body.email}`
                }
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
                }
            }
        );

        const client = new streamChat.StreamChat(
            process.env.STREAM_API_KEY,
            process.env.STREAM_API_SECRET
        );
        const user = {
            id: `${req.body.firstName}-${req.body.lastName}`.toLowerCase(),
            role: 'user',
            image: `https://robohash.org/${req.body.email}`
        };
        await client.upsertUsers([user, { id: 'sales-admin', role: 'admin' }]);
        const token = client.createToken(user.id);
        const channel = client.channel('messaging', user.id, {
            members: [user.id, 'sales-admin'],
        });
        res.status(200).json({
            userId: user.id,
            token,
            channelId: channel.id,
            apiKey: process.env.STREAM_API_KEY
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;
