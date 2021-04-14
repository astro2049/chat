import React from "react";
import SignIn from "./sign-in/SignIn";
import Chat from "./chat/Chat";
import SignUp from "./sign-up/SignUp";

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
                if (displaySignUpPage) {
                    return <SignUp setPage={props.setPage}></SignUp>;
                }
                if (displaySignInPage) {
                    return (
                        <SignIn
                            user={props.user}
                            setUser={props.setUser}
                            setPage={props.setPage}
                        ></SignIn>
                    );
                }
            } else {
                return <Chat user={props.user}></Chat>;
            }
        }

        return (
            <Main
                online={online}
                user={user}
                setUser={this.setUserOnline}
                setPage={this.setPageOnDisplay}
            ></Main>
        );
    }
}

export default App;
