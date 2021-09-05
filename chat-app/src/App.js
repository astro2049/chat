import React, { Suspense, useEffect, useState } from "react";
import Loader from "./pages/loader/index";
import SignIn from "./pages/sign-in/index";
import Chat from "./pages/main/index";
import SignUp from "./pages/sign-up/index";
import axios from "axios";

export default function App() {
    const [user, setUser] = useState({
        name: null,
    });
    const [online, setOnline] = useState(false);
    const [token, setToken] = useState(null);
    const [pageOnDisplay, setPageOnDisplay] = useState("sign-in");
    const displaySignInPage = pageOnDisplay === "sign-in";
    const displaySignUpPage = pageOnDisplay === "sign-up";

    useEffect(() => {
        if (user.name !== null && token != null) {
            axios.defaults.headers.common["token"] = token;
            setOnline(true);
        }
    }, [user, token]);

    function Main(props) {
        if (props.online === false) {
            if (displaySignInPage) {
                return (
                    <SignIn
                        user={props.user}
                        setUser={props.setUser}
                        token={props.token}
                        setToken={props.setToken}
                        setPage={props.setPage}
                    ></SignIn>
                );
            }
            if (displaySignUpPage) {
                return <SignUp setPage={props.setPage}></SignUp>;
            }
        } else {
            return <Chat user={props.user}></Chat>;
        }
    }

    return (
        <Suspense fallback={<Loader />}>
            <Main
                online={online}
                user={user}
                setUser={setUser}
                setPage={setPageOnDisplay}
                token={token}
                setToken={setToken}
            ></Main>
        </Suspense>
    );
}
