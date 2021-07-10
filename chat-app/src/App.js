import React, { Suspense } from "react";
import SignIn from "./sign-in/SignIn";
import Chat from "./chat/Chat";
import SignUp from "./sign-up/SignUp";
import axios from "axios";

// axios
// https://stackoverflow.com/questions/43051291/attach-authorization-header-for-all-axios-requests
(function () {
    let token = localStorage.getItem("token");
    if (token) {
        axios.defaults.headers.common["token"] = token;
    } else {
        axios.defaults.headers.common["token"] = null;
    }
})();

class App extends React.Component {
    props = {};

    state = {
        user: {
            name: "",
        },
        friends: [],
        chatrooms: [],
        online: false,
        pageOnDisplay: "sign-in",
    };

    setPageOnDisplay = (pageToDisplay) => {
        this.setState({
            pageOnDisplay: pageToDisplay,
        });
    };

    setUserOnline = (user) => {
        this.setState({
            user: user,
            online: true,
        });
    };

    render() {
        const { user, online, pageOnDisplay } = this.state;
        const displaySignInPage = pageOnDisplay === "sign-in";
        const displaySignUpPage = pageOnDisplay === "sign-up";

        function Main(props) {
            if (props.online === false) {
                if (displaySignInPage) {
                    return (
                        <SignIn
                            setUser={props.setUser}
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

        // loading component for suspense fallback
        function Loader() {
            return (
                <div className="App">
                    <div>loading...</div>
                </div>
            );
        }

        return (
            <Suspense fallback={<Loader />}>
                <Main
                    online={online}
                    user={user}
                    setUser={this.setUserOnline}
                    setPage={this.setPageOnDisplay}
                ></Main>
            </Suspense>
        );
    }
}

export default App;
