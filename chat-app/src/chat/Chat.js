import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Button, List, ListItem, TextField } from "@material-ui/core";
import MessageBox from "./components/message/Message";
import Panels from "./components/panels/Panels";

const appBarHeight = 80;
const drawerWidth = "25%";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        width: `calc(100% - ${drawerWidth})`,
        height: appBarHeight,
        marginLeft: drawerWidth,
    },
    chatroomName: {
        height: 80,
        display: "flex",
        alignItems: "center",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    titleContainer: {
        height: 80,
        display: "flex",
        alignItems: "center",
        borderTop: "1px solid black",
    },
    title: {
        marginLeft: 40,
        fontSize: 40,
    },
    panelsContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 20,
    },
    friendCard: {
        width: "100%",
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "none",
    },
    userInfo: {
        zIndex: 1250,
        position: "fixed",
        bottom: 40,
        left: 40,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    containerOnRight: {
        height: "900px",
    },
    inputContainer: {
        zIndex: 1300,
        position: "fixed",
        bottom: 0,
        right: 0,
        width: `calc(100% - ${drawerWidth})`,
        height: 250,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 12,
        borderTop: "1px solid lightgray",
        backgroundColor: "white",
    },
    forTextField: {},
}));

var stompClient = null;

export default function Chat(props) {
    const classes = useStyles();

    const username = props.user.name;
    const [chatText, setChatText] = useState("");
    const [rooms, setRooms] = useState([]);
    const [activeChat, setActiveChat] = useState({
        friend: "",
        chatroomId: "",
    });
    const [currentChatroomMessages, setCurrentChatroomMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);

    useEffect(() => {
        setChatrooms();
    }, [username]);

    const setChatrooms = () => {
        fetch("http://localhost:8080/user/room?username=" + username, {
            method: "GET",
        }).then((response) => {
            response.json().then((data) => {
                setRooms(data);
            });
        });
    };

    useEffect(() => {
        if (rooms === undefined) {
            return;
        } else {
            if (rooms.length > 0) {
                if (activeChat.chatroomId === "") {
                    setActiveChat(rooms[0]);
                }
            }
            connect();
        }
    }, [rooms]);

    useEffect(() => {
        refreshChatroomMessages();
    }, [activeChat]);

    useEffect(() => {
        refreshChatroomMessages();
    }, [receivedMessages]);

    const refreshChatroomMessages = () => {
        let messages = findChatMessages(activeChat.friend);
        setCurrentChatroomMessages(messages);
    };

    const findChatMessages = () => {
        let messages = [];
        for (let i = 0; i < receivedMessages.length; i++) {
            let message = receivedMessages[i];
            if (
                message.sender === activeChat.friend ||
                message.receiver === activeChat.friend
            ) {
                messages.push(message);
            }
        }
        return messages;
    };

    const connect = () => {
        const Stomp = require("stompjs");
        var SockJS = require("sockjs-client");
        SockJS = new SockJS("http://localhost:8080/chat");
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        console.log("connected");
        subscribeChatrooms();
    };

    const subscribeChatrooms = () => {
        rooms.map((room) =>
            stompClient.subscribe(
                "/topic/private." + room.chatroomId,
                onMessageReceived
            )
        );
    };

    const onMessageReceived = (msg) => {
        let message = JSON.parse(msg.body);
        setReceivedMessages((messages) => [...messages, message]);
    };

    const onError = (err) => {
        console.log(err);
    };

    const sendChatMessage = () => {
        setChatText("");
        let msg = chatText;
        if (msg.trim() !== "") {
            let friendName = activeChat.friend;
            let chatroomId = activeChat.chatroomId;
            const message = {
                sender: username,
                receiver: friendName,
                content: msg,
                time: new Date(),
            };
            stompClient.send(
                "/app/private/" + chatroomId,
                {},
                JSON.stringify(message)
            );
        }
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <div className={classes.chatroomName}>
                        <Typography variant="h4" noWrap>
                            {activeChat.friend}
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar}>
                    <div className={classes.titleContainer}>
                        <div className={classes.title}>Chat!</div>
                    </div>
                </div>
                <Divider />

                <List>
                    {rooms.map((room) => (
                        <ListItem>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setActiveChat(room)}
                                className={classes.friendCard}
                            >
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    align="center"
                                >
                                    {room.friend}
                                </Typography>
                            </Button>
                        </ListItem>
                    ))}
                </List>

                <div className={classes.panelsContainer}>
                    <Panels
                        username={username}
                        setChatrooms={setChatrooms}
                    ></Panels>
                </div>

                <div className={classes.userInfo}>
                    <Typography variant="h4">{username}</Typography>
                </div>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.containerOnRight}>
                    <div>
                        {currentChatroomMessages.map((message) => (
                            <MessageBox
                                username={message.sender}
                                content={message.content}
                            ></MessageBox>
                        ))}
                    </div>
                </div>
            </main>
            <div className={classes.inputContainer}>
                <TextField
                    variant="outlined"
                    fullWidth
                    multiline
                    rows="8"
                    className={classes.forTextField}
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                ></TextField>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={sendChatMessage}
                >
                    Send
                </Button>
            </div>
        </div>
    );
}
