import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { Circles, CirclesWithBar, ThreeDots } from 'react-loader-spinner';
import { effect, signal, useSignal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';


const isWaitingForResponse = signal(false);
const loadingMessageId = signal("");
const clearChat = signal("Test");

const ChatScreen = () => {
    useSignals();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const handleSendMessage = () => {
        if (inputText.trim() !== '' && !isWaitingForResponse.value) {
            setMessages(prev => [...prev, { text: inputText, sender: 'user', type: "send" }]);
            setInputText('');
            isWaitingForResponse.value = true;


            let id = Math.random();
            loadingMessageId.value = id;
            setMessages(prev => [...prev, { text: "", sender: 'user', type: "receive" }]);
        }
    };


    return (
        <div className="flex h-screen">
            <Sidebar />

            {/* Chat Panel */}
            <div className="flex-1 w-screen">
                <div className="mx-auto h-full">
                    <div className="w-full bg-gray-100 p-4 rounded-lg flex flex-col h-screen">
                        <div className="w-full h-16 px-5 bg-white rounded-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 block sm:hidden cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>

                            <h1 className="text-2xl font-bold">ArivihanGPT {clearChat.value.toString()}</h1>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                            </svg>

                        </div>
                        <div className="mb-4 overflow-y-auto h-5/6 px-2 sm:px-20 py-2 flex flex-col" id='message_container'>

                            {
                                messages.length === 0
                                    ?
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <img src={require("../assets/chat.png")} alt="" className='h-60 w-96 object-contain' />
                                        <p className='text-center'>Ask your doubts and get response instantly...</p>
                                    </div>
                                    :
                                    null
                            }

                            {
                                messages.map((message, index) => {
                                    if (message.type === "send") {
                                        return (<SendBubble key={index} message={message.text} />)
                                    } else {
                                        return (<ReceiveBubble key={index} message={message.text} />)
                                    }
                                })
                            }
                        </div>
                        <div className="w-full h-1/6  px-2 sm:px-20 flex items-center">
                            <div className="flex items-center w-full border-2 rounded-lg bg-white p-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="flex-1 mr-2 px-4 py-2 rounded-lg border-none focus:outline-none"
                                    placeholder="Type your question..."
                                    onKeyUp={(e) => { if (e.key === "Enter") { handleSendMessage() } }}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="px-2 py-2 bg-[#26c6da] text-white rounded-lg hover:bg-blue-600"
                                >

                                    {
                                        isWaitingForResponse.value
                                            ?
                                            <Circles
                                                height="26"
                                                width="26"
                                                color="white"
                                                ariaLabel="circles-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                                visible={true}
                                            />
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                            </svg>

                                    }

                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

const SendBubble = (props) => {

    useEffect(() => {
        document.getElementById("message_container").scrollBy({ top: 600, behavior: "smooth" })

    }, [])

    return (
        <div className={`text-right mb-3 bg-gray-200 ml-auto p-2 rounded w-4/5 sm:w-3/5`}>
            <div className="flex items-center">
                <img src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png" alt="" className="rounded-full bg-white h-9 w-9 object-contain" />
                <h4 className='font-bold ml-2'>You</h4>
            </div>
            <div className={`ml-12 text-gray-800 text-start`}>
                {props.message}
            </div>
        </div>
    )
}

const ReceiveBubble = (props) => {
    useSignals();
    const responseMessage = "Consectetur sunt voluptate sint ex fugiat exercitation est veniam ex non.Qui quis id velit ut in ad enim deserunt eiusmod sunt id excepteur.";
    const [counter, setCounter] = useState(0);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const typingEffect = (msg) => {
        setTimeout(() => {
            setText(text + msg[msg.length - counter])
            setCounter(counter - 1)
        }, 20)

        document.getElementById("message_container").scrollBy({ top: 600, behavior: "smooth" })

        if (counter <= 1) {
            isWaitingForResponse.value = false;
        }
    }

    useEffect(() => {
        if (counter > 0) {
            typingEffect(responseMessage);
        }
    }, [counter])

    useEffect(() => {
        setTimeout(() => {
            setCounter(responseMessage.length);
            setIsLoading(false);
        }, 3000)
    }, [])

    return (
        <div className={`text-right mb-3 bg-gray-200 mr-auto p-2 rounded w-4/5 sm:w-3/5`}>
            <div className="flex items-center">
                <img src={require("../assets/logo.png")} alt="" className="rounded-full bg-white h-9 w-9 object-contain" />
                <h4 className='font-bold ml-2 text-lg'>Arivihan Bot</h4>
            </div>
            {
                isLoading
                    ?
                    <div className="ml-12">
                        <ThreeDots
                            visible={true}
                            height="40"
                            width="40"
                            color="teal"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                    :
                    <div className={`ml-12 text-gray-800 text-start`} id="typer">
                        {text}
                    </div>

            }
        </div>
    )
}



export default ChatScreen;
