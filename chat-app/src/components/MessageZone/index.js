import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MessageBox from "../Message";

const appBarHeight = 80;
const inputContainerHeight = 258;

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        height: `calc(100% - ${appBarHeight}px - ${inputContainerHeight}px)`,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 25,
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
    },
}));

export default function MessageZone(props) {
    const classes = useStyles();

    const activeChat = props.activeChat;

    return (
        <div id="dialogBox" className={classes.container}>
            {activeChat &&
                activeChat.messages.map((message, index) => (
                    <MessageBox
                        key={index}
                        username={message.sender}
                        content={message.content}
                        time={message.time}
                        mine={message.mine}
                    ></MessageBox>
                ))}
        </div>
    );
}
