import { initializeApp } from "firebase/app";
import { getAuth,browserSessionPersistence,browserPopupRedirectResolver } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyAQHRxInJIv2j6tTUDHajtgz8wygTCOW4o",
//   authDomain: "XXXXXXXXXXXXXXXXXXXXXXXX",
//   projectId: "XXXXXXXXX",
//   storageBucket: "XXXXXXXXXXXXXXXXXX",
//   messagingSenderId: "XXXXXXXXXXXX",
//   appId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
// };

const firebaseConfig = {
    apiKey: "AIzaSyCnN6oKfaHpqOf3Ci3PNJsyihypPMLHhI4",
    authDomain: "doubtbuzzzter.firebaseapp.com",
    databaseURL: "https://doubtbuzzzter.firebaseio.com",
    projectId: "doubtbuzzzter",
    storageBucket: "doubtbuzzzter.appspot.com",
    messagingSenderId: "79905208794",
    appId: "1:79905208794:web:a9924f83d8e0d8e03428e3",
    measurementId: "G-K6K6KD371P",
    persistence: browserSessionPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export default app;