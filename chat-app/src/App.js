import React from "react";
import SignIn from "./sign-in/SignIn";
import Chat from "./chat/Chat";

class App extends React.Component {
  props = {};

  state = {
    user: {
      name: "",
    },
    friends: [],
    chatrooms: [],
    online: false,
  };

  setUserOnline = (user) => {
    this.setState({
      user: user,
      online: true,
    });
    console.log(user);
  };

  render() {
    const { user, online } = this.state;

    function Main(props) {
      if (props.online === false) {
        return <SignIn user={props.user} setUser={props.setUser}></SignIn>;
      } else {
        return <Chat user={props.user}></Chat>;
      }
    }

    return (
      <Main online={online} user={user} setUser={this.setUserOnline}></Main>
    );
  }
}

export default App;
