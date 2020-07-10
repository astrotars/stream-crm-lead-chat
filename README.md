# Generate Zendesk Leads from custom Chat application
This post will demonstrate how to configure a Lead creation in Zendesk from a customer inquiry via a Chat bot interaction. A later post will explain how to append the chat transcript to the Lead.

#### Process Flow of the Application
* The user initiates an inquiry chat,
* User provides basic information via a form,
* The form information is passed to the 
backend, which sends a request to Zendesk to create the Lead and gets a secure frontend token from Stream
* The frontend will then display the chat screen.

## Overview
The application described in this post is composed of a React.js frontend and a Node.js with Express backend. The backend also leverages Stream's JavaScript library to generate a frontend token, and Axios to load data into Zendesk via the Zendesk Sell API. All the code required for this tutorial is available in github.

The steps we will take to configure this application are:
1. [Create an Access Token in Zendesk](#create-an-access-token-in-zendesk)
3. [Configure the security token keys in the backend and start the backend](#configure-the-security-token-keys-in-the-backend-and-start-the-backend)
2. [Create a Stream Chat Session](#create-a-stream-chat-session)
4. [Setup the frontend form and chat bot](#setup-the-frontend-form-and-chat-bot)

### Prerequisites

To follow along with the post, you will need a free [Stream](https://getstream.io/get_started/?signup=#flat_feed) account and a Zendesk Sell account. For this post, we used a Trial version of [Zendesk Sell](https://www.zendesk.com/register/?source=zendesk_sell#step-1).

This post requires basic knowledge of [Node.js](https://nodejs.org/en/ "node website"), [Axios](https://github.com/axios/axios "Axois documentation on Github"), and the code is intended to run locally. A basic understanding of [Zendesk Sell API](https://developer.zendesk.com/rest_api/docs/sell-api/apis) is also needed to configure the secure communication between the app and Zendesk (though the specific steps needed are provided in the post).

### Create an Access Token in Zendesk
([back to Overview](#overview))

While Stream is capable of integrating into all of Zendesk's API, the purpose of this post is not to explain Zendesk configuration in detail. The code snippets shown will allow you to create and update Leads in your Zendesk system. The first step for any Zendesk Sell integration is to configure the OAuth security settings from your Zendesk Sell Settings panel with the following steps: 

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

You will update the backend with this Zendesk OAuth Token as explained in the next section.

### Configure the security token keys in the backend and start the backend
([back to Overview](#overview))

The React.js is already configured to present the user form and to interact with the backend. No code modifications are required. The frontend application code is composed in the [App.js](frontend/App.js).

There are three references that you need to provide in a .env file to make the application function:
- STREAM_API_KEY
- STREAM_API_SECRET
- ZENDESK_CRM_TOKEN

You can create an .env file from the .env.example and provide the credentials and/or tokens that are required.

1. Your Stream Key and Secret.
If haven't set up your Stream credentials, you will need to create them.
- Navigate to your [Stream.io Dashboard](https://getstream.io/dashboard/), and then click on the Create App button and complete the form like in the following screenshot.

![](images/stream-dashboard-button.png)


![](images/stream-create-app-button.png)

Give your app a name and select "Development" and click `Submit`

![](images/stream-create-new-app-button.png)

- Once you have created a Stream app, Stream will generate a Key and Secret for your app. You need to copy these copy the Key and Secret and update the backend file, "FILENAME/LOCATION"

![](images/stream-key-secret-copy.png)

When the .env file has been created, you can start the backend by `npm start` command from the backend folder.

### Create a Stream Chat Session
([back to Overview](#overview))

The code that creates a Lead in Zendesk and creates a Stream Chat session can be found at [backend/routes/index.js](backend/routes/index.js)

### Setup the frontend form and chat bot
([back to Overview](#overview))

The code that first presents the CRM inquiry form and then instantiates a Stream Chat can be found at [frontend/src/App.js](frontend/src/App.js)

For the purposes of this post, we will send the minimum level of information in order to create a CRM Lead, your requirements may differ, and can easily be added using the Zendesk API documentation.

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
([back to Overview](#overview))