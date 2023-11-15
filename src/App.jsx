import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import Main from './modules/Main';
import NavBar from './modules/NavBar';

function App() {
    const [token, setToken] = useState("");
    const [user, setUser] = useState({})
    useEffect(() => {
        const firebaseConfig = {
            apiKey: "AIzaSyCRCUGrPPNUjLQKZOmh_G_Cc_AJcWeMIYc",
            authDomain: "dpp-e73dc.firebaseapp.com",
            projectId: "dpp-e73dc",
            storageBucket: "dpp-e73dc.appspot.com",
            messagingSenderId: "99618154270",
            appId: "1:99618154270:web:cd8850f97e28c02136cb0f",
            measurementId: "G-CV2RJ1CV8T"
        }

        initializeApp(firebaseConfig);
        const token = localStorage.getItem("token")
        if (token) {
            setToken(token);
            setUser(JSON.parse(localStorage.getItem("user")))
        }
    }, [])
    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth()
        const result = await signInWithPopup(auth, provider)
        const response = await axios.post('http://localhost:3000/api/sign-in',null, {
            headers: {
                'Authorization': 'Bearer ' + result.user.accessToken
            }
        })
        localStorage.setItem("token", result.user.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setToken(result.user.accessToken);
        setUser(response.data.data)
    }
    return (
        <div style={{ position: "absolute", height: "90%", width: "100%", top: "0%", left: "0%" }}>
            {token ? 
                 <>
                    <NavBar user={user} setToken={setToken} />
                    <Main token={token} setToken={setToken} /> 
                 </>
                : <div style={{ display: "flex", height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
                    <button className="gsi-material-button" onClick={signIn}>
                        <div className="gsi-material-button-state"></div>
                        <div className="gsi-material-button-content-wrapper" style={{display: "flex"}}>
                            <div className="gsi-material-button-icon">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: "block"}}>
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                    <path fill="none" d="M0 0h48v48H0z"></path>
                                </svg>
                            </div>
                            <span className="gsi-material-button-contents">Sign in with Google</span>
                            <span style={{display: "none"}}>Sign in with Google</span>
                        </div>
                    </button>
            </div>}

        </div>
    )
}

export default App
