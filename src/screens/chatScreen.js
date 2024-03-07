import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { Circles, CirclesWithBar, RotatingLines, ThreeDots } from 'react-loader-spinner';
import { effect, signal, useSignal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import AuthDialog from '../components/authDialog';
import { ReceiveBubble } from '../components/receiveBubble';
import { chatClear, chatIsWaitingForResponse, chatLoadingMessageId, chatReceiveChatMessage, chatSessionId, chatSessions, isGuestUser, showAuthModal, showSidebarMobile, subscriptionActive, userChatsCount } from '../state/chatState';
import { customFetchRequest } from '../utils/customRequest';
import ChatLimtExhausted from '../components/chatLimitExhaustCard';



const ChatScreen = () => {
    useSignals();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isShowExhaustCard, setIsShowExhaustCard] = useState(false);
    const [isShowWelcomeMessage, setIsShowWelcomeMessage] = useState(true);
    const [isLoadingSessionChat, setIsLoadingSessionChat] = useState(false);

    const handleSendMessage = () => {

        if (isGuestUser.value && userChatsCount.value >= 10 && !subscriptionActive.value) {
            setIsShowExhaustCard(true);
            setIsShowWelcomeMessage(false);
            return;
        }

        if (inputText.trim() !== '' && !chatIsWaitingForResponse.value) {

            if (messages.length === 0) {
                startChatSession(inputText)

                // const sessionObj = new Object();
                // sessionObj[chatSessionId.value] = inputText;
                chatSessions.value[chatSessionId.value] = inputText;
            }
            userChatsCount.value = userChatsCount.value + 1;

            setMessages(prev => [...prev, { text: inputText, sender: 'user', type: "send" }]);
            setInputText('');
            chatIsWaitingForResponse.value = true;
            requestChat(inputText)

            let id = Math.random();
            chatLoadingMessageId.value = id;
            setMessages(prev => [...prev, { text: "", sender: 'user', id: id, type: "receive" }]);
        }
    };

    const requestChat = (userPrompt) => {
        chatReceiveChatMessage.value = null;
        let body = {
            "prompt": userPrompt,
            "chatSessionId": chatSessionId.value,
        };

        customFetchRequest(`chat-request?chatSessionId=${body.chatSessionId}&prompt=${body.prompt}`, 'GET').then((res) => {
            chatReceiveChatMessage.value = res.output;
        })
    }


    const startChatSession = (userPrompt) => {
        chatReceiveChatMessage.value = null;
        let body = {
            "prompt": userPrompt,
            "chatSessionId": chatSessionId.value,
        };

        customFetchRequest(`start-session?chatSessionId=${body.chatSessionId}&prompt=${body.prompt}`, 'GET');
    }

    const getSessionChats = () => {
        setMessages([]);
        setIsLoadingSessionChat(true);
        if (chatSessionId) {
            customFetchRequest(`session-chats?sessionId=${chatSessionId.value}`, 'GET').then((res) => {
                res.forEach(chat => {
                    setMessages(prev => [...prev, { text: chat.request, sender: 'user', type: "send" }])
                    setMessages(prev => [...prev, { text: chat.response, sender: 'user', type: "receive", id: "notloading" }])
                })
                setIsLoadingSessionChat(false);
            })
        }
    }

    const handleShowAuthModal = () => {
        showAuthModal.value = true;
    }

    const initRequests = () => {
        let abortController = new AbortController();
        customFetchRequest(`user-chats-count`, 'GET').then((res) => {
            userChatsCount.value = res.count;
        })

        return () => {
            abortController.abort();
        }
    }

    let handleShowSidebarMobile = () => {
        showSidebarMobile.value = !showSidebarMobile.value;
    }


    // const getLoggedInUser = () => {
    //     customFetchRequest(`login`).then((res) => {
    //         localStorage.setItem('user', JSON.stringify(res))
    //     })
    // }

    useEffect(() => {
        // getLoggedInUser()
        initRequests();
    }, [])

    useEffect(() => {
        getSessionChats()
    }, [chatSessionId.value]);

    useEffect(() => {
        if (chatClear.value === true) {
            setMessages([]);
            chatClear.value = false;
        }

    }, [chatClear.value])


    return (
        <div className="flex flex-col h-screen">
            {showAuthModal.value}

            <div className="flex items-center h-[64px] px-6 py-2 shadow bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 cursor-pointer" onClick={handleShowSidebarMobile}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                {/* <h1 className="text-2xl font-bold">
                            </h1> */}
                <img src={require("../assets/logo-full.png")} alt="" className='h-9' />

                <nav className='ml-auto hidden sm:flex'>
                    <ul className='flex items-center text-sm'>
                        <li className='mx-2'>
                            <a href="https://arivihan.com/" className=''>Home</a>
                        </li>
                        <li className='mx-2'>
                            <a href="https://arivihan.com/contact/" className=''>Contact</a>
                        </li>
                        <li className='mx-2'>
                            <a href="https://arivihan.com/about/" className=''>About</a>
                        </li>
                        <li className='mx-2'>
                            <a href="#" className='text-[#26c6da] border-b-2 border-[#26c6da]'>Ask Doubt</a>
                        </li>

                    </ul>
                </nav>

            </div>

            <div className="flex" style={{ height: "calc(100vh - 64px)" }}>
                <Sidebar />
                <div className="flex-1 w-screen h-full">
                    <div className="mx-auto h-full">
                        <div className="w-full p-4 flex flex-col h-full" >

                            <div id="recaptcha_placeholder"></div>
                            <div className="mb-0 overflow-y-auto h-5/6 px-2 sm:px-20 py-2 flex flex-col" id='message_container'>

                                {
                                    messages.length === 0 && isShowWelcomeMessage && !isLoadingSessionChat
                                        ?
                                        <div className="w-full flex flex-col items-center justify-center">

                                            <div className="h-10 w-10 bg-[#26c6da] rounded-full">
                                                <img src={require("../assets/logo.png")} alt="" className='h-10 w-10 object-contain invert brightness-0' />
                                            </div>
                                            <p className='mt-4'>How <b>can I help</b> you <b>today?</b></p>
                                            <div className="relative flex flex-col sm:flex-row items-center justify-between w-full my-12">
                                                <img src={require("../assets/curv.png")} alt="" className='hidden sm:block absolute top-[84%] h-12 -left-[18%] -z-10' />
                                                <img src={require("../assets/curv.png")} alt="" className='hidden sm:block absolute -top-[42%] h-12 left-[10%] -z-10 rotate-180' />
                                                <img src={require("../assets/curv.png")} alt="" className='hidden sm:block absolute -top-[42%] h-12 left-[60%] -z-10 rotate-180' />
                                                <img src={require("../assets/curv.png")} alt="" className='hidden sm:block absolute top-[84%] h-12 left-[36%] -z-10' />
                                                <img src={require("../assets/curv.png")} alt="" className='hidden sm:block absolute top-[84%] h-12 -right-[0%] -z-10' />

                                                <div className="flex p-3 bg-[#E8FBFC] w-full sm:w-1/4 rounded-lg mr-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                                    </svg>
                                                    <div className="flex flex-col ml-2">
                                                        <div className="flex items-center justify-between">
                                                            <b className='text-xs'>Ask any doubt</b>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                            </svg>
                                                        </div>
                                                        <p className='text-xs text-gray-500 mt-1'>E.g. Define ‘activation energy’ of a
                                                            reaction.</p>
                                                    </div>
                                                </div>
                                                <div className="flex p-3 bg-[#E8FBFC] w-full sm:w-1/4 rounded-lg  my-2 sm:my-0 mr-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                                    </svg>

                                                    <div className="flex flex-col ml-2 w-full">
                                                        <div className="flex items-center justify-between">
                                                            <b className='text-xs'>Clear your concepts</b>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                            </svg>
                                                        </div>
                                                        <p className='text-xs text-gray-500 mt-1'>E.g. Explain when to apply Pseudo Force</p>
                                                    </div>
                                                </div>

                                                <div className="flex p-3 bg-[#E8FBFC] w-full sm:w-1/4 rounded-lg mr-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                                    </svg>

                                                    <div className="flex flex-col ml-2 w-full">
                                                        <div className="flex items-center justify-between">
                                                            <b className='text-xs'>Revise with us</b>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                            </svg>
                                                        </div>
                                                        <p className='text-xs text-gray-500 mt-1'>E.g. Which flower blooms once in 12 year</p>
                                                    </div>
                                                </div>

                                                <div className="flex p-3 bg-[#E8FBFC] w-full sm:w-1/4 min-h-auto sm:min-h-[75px] my-2 sm:my-0 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                                    </svg>

                                                    <div className="flex flex-col ml-2 w-full">
                                                        <div className="flex items-center justify-between">
                                                            <b className='text-xs'>Get deep insights</b>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                            </svg>
                                                        </div>
                                                        <p className='text-xs text-gray-500 mt-1'>E.g. When to use substitution</p>
                                                    </div>
                                                </div>


                                            </div>
                                            <div className="flex p-4 bg-[#F6F6F6] rounded-lg">
                                                <img src={require("../assets/bot.png")} alt="" className='h-8 w-8 mr-4' />
                                                <div className="flex flex-col text-xs">
                                                    <p>Welcome User,</p>
                                                    <p className='mt-2'>I am <b>Arivihan’s Tutor Bot</b> - Here to help you with your <b>JEE/NEET</b> and <b>Board</b> exam preparation. Consider me your personalized study companion, guiding you every step of the way.</p>
                                                    <p className='mt-2'>When you're ready, feel free to ask me any doubts to clarify your concepts. This marks the beginning of your learning journey, and the real magic is about to unfold! </p>
                                                    <p className='mt-2'>Let's start by answering your first query.</p>
                                                </div>
                                            </div>
                                            {/* <img src={require("../assets/chat.png")} alt="" className='h-60 w-96 object-contain' />
                                        <p className='text-center'>Ask your doubts and get response instantly...</p> */}


                                            {/* {
                                            isGuestUser.value
                                                ?
                                                <button className="bg-[#26c6da] rounded p-2 mt-2 text-white text-sm" onClick={handleShowAuthModal}>Login to Start</button>
                                                :
                                                null
                                        } */}

                                        </div>
                                        :
                                        null
                                }

                                {
                                    isLoadingSessionChat
                                        ?
                                        <div className="w-full h-full flex items-center justify-center">
                                            <RotatingLines
                                                visible={true}
                                                height="96"
                                                width="96"
                                                color="teal"
                                                strokeWidth="5"
                                                strokeColor="teal"
                                                animationDuration="0.75"
                                                ariaLabel="rotating-lines-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                                className="self-center"
                                            />
                                        </div>
                                        :
                                        null
                                }

                                {
                                    messages.map((message, index) => {
                                        if (message.type === "send") {
                                            return (<SendBubble key={index} message={message.text} />)
                                        } else {
                                            return (<ReceiveBubble key={index} id={message.id} message={message.text} />)
                                        }
                                    })
                                }

                                {
                                    isShowExhaustCard
                                        ?
                                        <ChatLimtExhausted />
                                        :
                                        null
                                }

                            </div>
                            <div className="w-full h-1/6  px-2 sm:px-20 flex items-center">
                                <div className="flex items-center flex-1 bg-[#F6F6F6] rounded-lg p-1">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        className="flex-1 mr-2 px-4 py-2 rounded-lg bg-transparent border-none focus:outline-none"
                                        placeholder="Ask me anything..."
                                        onKeyUp={(e) => { if (e.key === "Enter") { handleSendMessage() } }}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="px-2 py-2 bg-[#26c6da] text-white rounded-lg hover:bg-blue-600 min-h-[36px] min-w-[36px]"
                                    >

                                        {
                                            chatIsWaitingForResponse.value
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
                                                <img src={require("../assets/send.png")} alt="" className='h-6 w-6' />

                                            // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            //     <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                            // </svg>

                                        }

                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <AuthDialog />
        </div>
    );

}

const SendBubble = (props) => {

    useEffect(() => {
        document.getElementById("message_container").scrollBy({ top: 600, behavior: "smooth" })

    }, [])

    return (
        <div className={`text-right mb-3 bg-[#E8FBFC] ml-auto p-2 rounded-lg w-4/5 sm:w-3/5`}>
            <div className="flex items-center">
                <img src={require("../assets/user.png")} alt="" className="rounded-full bg-white h-9 w-9 object-contain" />
                <h4 className='font-bold ml-2'>You</h4>
            </div>
            <div className={`ml-12 text-gray-800 text-start text-sm`}>
                {props.message}
            </div>
        </div>
    )
}


export default ChatScreen;
