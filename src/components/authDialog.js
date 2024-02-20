import React, { useState } from 'react';
import { getAuth, COnfirm, signInWithPhoneNumber, RecaptchaVerifier, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { ThreeDots } from 'react-loader-spinner';
import { showAuthModal } from '../state/chatState';
import { effect } from '@preact/signals-react';


export default function AuthDialog() {
    const [isLoading, setIsLoading] = useState();
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [err, setErr] = useState("");

    const handlePhoneLogin = () => {
        setIsLoading(true);
        setErr("");
        window.appVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha_placeholder",
            {
                size: "invisible"
            }
        );

        const appVerifier = window.appVerifier;

        if (appVerifier) {

            signInWithPhoneNumber(auth, "+91" + phoneNumber, appVerifier)
                .then(function (confirmationResult) {
                    console.log("Success");
                    window.confirmationResult = confirmationResult;
                    setIsLoading(false);
                    setIsOTPSent(true);
                    setErr("");
                })
                .catch(function (error) {
                    console.log("Error:" + error);
                    setErr(error)
                    setIsLoading(false)
                });
        }

    };

    const confirmVerificationCode = () => {
        setIsLoading(true);
        window.confirmationResult.confirm(otp).then((result) => {
            const user = result.user;
            console.log(user);
            setIsLoading(false);
            localStorage.setItem("token", result.user.accessToken)
            setErr("");
            getUser();
        }).catch((error) => {
            setIsLoading(false);
            console.log("ERROR :: " + error);
            setErr(error);
            localStorage.clear();
        });
    }

    const getUser = () => {
        fetch(`/secure/web/login`, {
            method: "POST",
            headers: {
                "token": localStorage.getItem('token'),
            }
        })
            .then(res => res.json())
            .then(json => {
                showAuthModal.value = false;
                window.location.reload();
                // localStorage.setItem("user", JSON.stringify(json))
            })
    }

    const handleLogin = () => {
        if (isOTPSent) {
            confirmVerificationCode();
        } else {
            handlePhoneLogin();
        }
    }

    const handleCloseAuthModal = () => {
        showAuthModal.value = false;
    }

    if (!showAuthModal.value) {
        return <></>
    }



    return (
        <div className={`fixed inset-x-0 inset-y-0 right-0 bottom-0 z-10 bg-black/80`}>


            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg w-2/6">
                <div className="absolute top-0 right-[-44px] bg-white rounded-full p-2 cursor-pointer" onClick={handleCloseAuthModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>

                <div className="flex flex-col">
                    <div className="bg-[#26c6da] flex items-center justify-center rounded-lg">
                        <img src="https://arivihan.com/wp-content/uploads/2023/05/cropped-arivihan-logo-1.png" alt="" className='h-20 w-64 object-contain self-center' />

                    </div>
                    <h2 className='text-3xl font-bold mt-2 ml-1'>Login</h2>
                    <p className='ml-1 mt-2 mb-1'>Enter your phone number to login</p>
                    <input type="tel" maxLength={10} onChange={(e) => { setPhoneNumber(e.target.value) }} className='border-2 py-2 px-2 rounded-lg  outline-none hover:border-gray-300' placeholder='Phone Number' />

                    {
                        isOTPSent
                            ?
                            <div className="flex flex-col mt-2">
                                <label htmlFor="" className='ml-1'>Enter OTP</label>
                                <input onChange={(e) => { setOtp(e.target.value) }} maxLength={6} type="text" className='border-2 py-2 px-2 rounded-lg outline-none hover:border-gray-300' placeholder='Enter OTP' />
                            </div>
                            : null
                    }

                    <button onClick={handleLogin} className='p-2 bg-[#26c6da] text-white rounded-lg mt-2 font-bold flex justify-center'>

                        {
                            isLoading
                                ?
                                <ThreeDots
                                    visible={true}
                                    height="30"
                                    width="30"
                                    color="white"
                                    radius="9"
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                                :
                                isOTPSent ? "Verify OTP" : "Send OTP"
                        }

                    </button>
                    {
                        err !== ""
                            ?
                            <p className='text-red text-center mt-1'>{err.toString()}</p>
                            :
                            null
                    }
                </div>
            </div>
        </div>
    )
}