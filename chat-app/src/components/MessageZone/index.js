import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MessageBox from "../Message";

const appBarHeight = 80;
const inputContainerHeight = 258;

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        height: `calc(100% - ${appBarHeight}px - ${inputContainerHeight}px)`,
    },
    infoContainer: {
        width: "100%",
        height: "100%",
    },
    dialogContainer: {
        width: "100%",
        height: "100%",
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
    const displayActivechatInfo = props.displayActivechatInfo;

    const chatInfo = () => {
        return <div className={classes.infoContainer}>233</div>;
    };

    const dialogBox = () => {
        return (
            <div id="dialogBox" className={classes.dialogContainer}>
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
    };

    return (
        <div className={classes.container}>
            {displayActivechatInfo === true ? chatInfo() : dialogBox()}
        </div>
    );
}
