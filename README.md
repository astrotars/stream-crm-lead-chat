# Generate Zendesk Leads from custom Chat application
This post will demonstrate how to configure a Lead creation in Zendesk from a customer inquiry via a Chat bot interaction.

#### Process Flow of the Application
* The user initiates an inquiry chat,
* User provides basic information via a form,
* The form information is passed to the 
backend, which sends a request to Zendesk to create the Lead and gets a secure frontend token from Stream
* The frontend will then display the chat screen.
* At the conclusion of the chat (or at some other configured event), the frontend will hand-off to the backend to send a request to zendesk to update the Lead notes with the chat transcript.
## Overview
The application described in this post is composed of a frontend web interface based on React and a simple Node.js backend application. The backend relies on Express (Node.js) and leverages Stream's JavaScript library to generate a frontend token, and Axios to load data into Zendesk via the Zendesk Sell API

The steps we will take to configure this application are:
1. [Create an Access Token in Zendesk](#create-an-access-token-in-zendesk)
2. [Configure Stream Chat](#configure-stream-chat)
3. [Configure the security token keys in the backend and start the backend](#configure-the-security-token-keys-in-the-backend-and-start-the-backend)
4. [Configure Axios snippets to use your Zendesk system and credentials](#configure-axios-snippets-to-use-your-zendesk-system-and-credentials)
4. [Setup the frontend form and chat bot](#setup-the-frontend-form-and-chat-bot)

### Prerequisites

To follow along the post, you will need a free [Stream](https://getstream.io/get_started/?signup=#flat_feed) account and a Zendesk Sell account. For this post, we used a Trial version of [Zendesk Sell](https://www.zendesk.com/register/?ref=218b).

This post requires basic knowledge of [Node.js](https://nodejs.org/en/ "node website"), [Axios](https://github.com/axios/axios "Axois documentation on Github"), and the code is intended to run locally. A basic understanding of [Zendesk Sell API](https://developer.zendesk.com/rest_api/docs/sell-api/apis) is also needed to configure the secure communication between the app and Zendesk, though specific steps needed here are provided.

### Create an Access Token in Zendesk
([back to Overview](#overveiw))

The purpose of this post is not to explain Zendesk configuration in detail. We will touch on only what is required to complete the functionality described in the post. The code snippets will allow you to complete the creation and update of Leads in your Zendesk system; however, you must configure the OAuth security settings from your Settings panel in your Zendesk system.

1. First go to Settings

![](images/zendesk-setting-panel.png)

2. Click on "OAuth" under the "Integrations" menu item

![](images/zendesk-OAuth-settings.png)

3. Click on the button labeled, "+ Add Access Token"

![](images/zendesk-create-OAuth.png)

4. Complete description and leave settings unchanged (more restrictive settings may be required for your application) and click "Save"

![](images/zendesk-add-access-token.png)

5. Copy value of the access token, which you will need to configure your backend communication with zendesk.

![](images/zendesk-access-token-example.png)

### Configure Stream Chat
([back to Overview](#overveiw))

### Configure the security token keys in the backend and start the backend
([back to Overview](#overveiw))

### Configure Axios snippets to use your Zendesk system and credentials
([back to Overview](#overveiw))

Locate the file [backend/routes/index.js](backend/routes/index.js).

Change the code in lines #, # as follows.

```javascript
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

```

### Setup the frontend form and chat bot
([back to Overview](#overveiw))

For the purposes of this post, we will configure the capture of the minimum level of information in order to create a CRM Lead, your requirements may differ.

We will configure the frontend to first display the initial form and then to request that the backend create a Zendesk Lead and get a Stream token. The frontend will then display a chat screen. Lastly, the frontend will request that the backend save the chat transcript to the Lead that was created at the outset.

```javascript
import React, { useState } from 'react';
import { Chat, Channel, ChannelHeader, Thread, Window } from 'stream-chat-react';
import { MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import './App.css';

function App() {
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    function register() {
        fetch("http://localhost:8080/registrations", {
            method: "POST",
            body: JSON.stringify({
                firstName,
                lastName,
                email
            })
        })
            .then((res) => {
                // console.log("res", res.json())
                return res.json()
            })
            .then(({ userId, token, channelId }) => {
                const chatClient = new StreamChat('gx5a64bj4ptz');

                chatClient.setUser(
                    {
                        id: userId,
                        name: email,
                        image: 'https://getstream.io/random_svg/?id=bitter-unit-5&name=Bitter+unit'
                    },
                    token,
                );


                const channel = chatClient.channel('messaging', channelId);
                setChatClient(chatClient);
                setChannel(channel)
            })
    }

    if (chatClient && channel) {
        return (
            <div className="App">
                <Chat client={chatClient} theme={'messaging light'}>
                    <Channel channel={channel}>
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageInput />
                        </Window>
                        <Thread />
                    </Channel>
                </Chat>
            </div>
        )
    } else {
        return (
            <div className="App">
                <label for="firstName">First Name</label>
                <input type="text" name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <label for="lastName">Last Name</label>
                <input type="text" name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <label for="email">Enter Email address</label>
                <input type="text" name="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={() => register()}>Start chat</button>
            </div>
        );
    }
}

export default App;

```

And that does it! You now understand how to integrate Stream Chat with Zendesk Sell to create and modify Leads. Similar integrations can be configured with other Zendesk Objects like Contacts, Deals, Calendar, and Tasks.
([back to Overview](#overveiw))