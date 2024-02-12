import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import React, { useState } from 'react';

const clearChat = signal(false)

const Sidebar = ({ onCreateNewChat }) => {
    useSignals();
    const [newChatTitle, setNewChatTitle] = useState('');
    const [chats, setChats] = useState([
        {
            title: "test"
        }
    ])

    const handleCreateNewChat = () => {
        clearChat.value = "twd";
        if (newChatTitle.trim() !== '') {
            onCreateNewChat(newChatTitle);
            setNewChatTitle('');
        }
    };

    const onSelectChat = () => {

    }

    return (
        <div className="bg-[#26c6da] text-white w-72 hidden flex-col h-full md:flex">
            <div className="p-4 ">
                <div className='flex items-center hover:bg-white/20 rounded-lg p-2 cursor-pointer' onClick={handleCreateNewChat}>
                    <img className='w-11 h-11 object-contain bg-white rounded-full' src={require("../assets/logo.png")} alt="" />
                    <h1 className="font-bold ml-2">New Chat</h1>
                    <button

                        className="text-white ml-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                </div>
                <div className="mt-4">
                    <h1 className="text-sm p-2 font-bold">Chats</h1>
                    <hr />
                    {chats.map((chat, index) => (
                        <div key={index} className="my-1 hover:bg-white/20 rounded p-2 cursor-pointer flex items-center" onClick={() => onSelectChat(chat)}>
                            <span className="">{chat.title}</span>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>

                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center mt-auto bg-white/20 p-4">
                <img src={require("../assets/logo.png")} alt="" className="h-10 w-10 rounded-full bg-white" />
                <h2 className='font-bold text-lg ml-4'>User Name</h2>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 ml-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

            </div>
        </div>
    );
};

export default Sidebar;
