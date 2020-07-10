import React, { useState } from 'react';
import { Channel, ChannelHeader, Chat, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import './App.css';
import 'stream-chat-react/dist/css/index.css';

function App() {
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    async function register() {
        const response = await fetch("http://localhost:8080/registrations", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email
            })
        })
        const { userId, token, channelId, apiKey } = await response.json();

        const chatClient = new StreamChat(apiKey);
        await chatClient.setUser(
            {
                id: userId,
                name: email,
                image: `https://getstream.io/random_svg/?id=${userId}`
            },
            token,
        );


        const channel = chatClient.channel('messaging', channelId);
        setChatClient(chatClient);
        setChannel(channel)
    }

    if (chatClient && channel) {
        return (
            <div className="App">
                <Chat client={chatClient} theme={'messaging light'}>
                    <Channel channel={channel}>
                        <Window>
                            <ChannelHeader/>
                            <MessageList/>
                            <MessageInput/>
                        </Window>
                        <Thread/>
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
