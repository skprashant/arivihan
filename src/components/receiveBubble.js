import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { Circles, CirclesWithBar, ThreeDots } from 'react-loader-spinner';
import { effect, signal, useSignal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { chatIsWaitingForResponse, chatLoadingMessageId, chatReceiveChatMessage } from '../state/chatState';


export const ReceiveBubble = (props) => {
    useSignals();
    const responseMessage = chatReceiveChatMessage.value === null ? "" : chatReceiveChatMessage.value;
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
            chatIsWaitingForResponse.value = false;
        }
    }

    useEffect(() => {
        if (counter > 0 && props.id === chatLoadingMessageId.value) {
            typingEffect(responseMessage);
        }
    }, [counter])

    useEffect(() => {
        if(props.id === "notloading"){
            setText(props.message);
            setIsLoading(false);
            setTimeout(()=>{
                document.getElementById("message_container").scrollBy({ top: 6000, behavior: "smooth" });
            },200)
        }else{
            if (chatReceiveChatMessage.value !== null) {
                setTimeout(() => {
                    setCounter(responseMessage.length);
                    setIsLoading(false);
                }, 3000)
            }
        }
    }, [chatReceiveChatMessage.value])

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
                    <div className={`ml-12 text-gray-800 text-start word`} id="typer">
                        <pre className='text-wrap whitespace-break-spaces'>
                            {text}
                        </pre>
                    </div>

            }
        </div>
    )
}
