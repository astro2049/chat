import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "tdesign-react";
import {
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Divider,
    TextField,
    Popover,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import MessageBox from "../../components/Message/index";
import Panels from "../../components/Panels/index";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ChatProfileCards from "../../components/ChatProfileCards";

const appBarHeight = 80;
const menuWidth = "26%";
const inputContainerHeight = 258;

const useStyles = makeStyles(() => ({
    appBar: {
        zIndex: "1300",
        width: "100%",
        height: appBarHeight,
        backgroundColor: "LightSalmon",
        borderTop: "2px solid black",
    },
    appBarContentContainer: {
        height: appBarHeight,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    chatroomName: {
        display: "flex",
        alignItems: "center",
    },
    activeChatButton: {
        textTransform: "none",
    },
    chatRoomInfo: {
        padding: "10px",
    },
    chatRoomInfoTitle: {
        marginBottom: "5px",
        paddingRight: "20px",
        borderBottom: "2px solid black",
    },
    drawerOnLeft: {
        width: menuWidth,
        flexShrink: 0,
    },
    drawerPaperOnLeft: {
        width: menuWidth,
    },
    drawerOnRight: {
        width: `calc(100% - ${menuWidth})`,
        flexShrink: 0,
    },
    drawerPaperOnRight: {
        width: `calc(100% - ${menuWidth})`,
    },
    logoContainer: {
        height: 80,
        display: "flex",
        alignItems: "center",
        borderTop: "2px solid black",
    },
    logo: {
        marginLeft: 20,
        width: 200,
        height: 50,
    },
    chatRooms: {
        width: "100%",
        height: `calc(100% - ${appBarHeight}px - ${inputContainerHeight}px)`,
        overflowY: "auto",
    },
    // make sure contents are below app bar!
    toolbar: {
        height: appBarHeight,
    },
    languageSelector: {
        justifySelf: "flex-end",
    },
    messagesArea: {
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
    inputContainer: {
        width: "100%",
        height: inputContainerHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
        padding: 12,
        borderTop: "1px solid lightgray",
    },
}));

const { REACT_APP_PROFILE_SERVER_ADDRESS, REACT_APP_CHAT_SERVER_ADDRESS } =
    process.env;

var stompClient = null;

const findChatMessages = (receivedMessages, activeChat) => {
    let messages = [];
    for (let i = 0; i < receivedMessages.length; i++) {
        let message = receivedMessages[i];
        if (
            message.chatId === activeChat.id &&
            message.type === activeChat.type
        ) {
            messages.push(message);
        }
    }
    return messages;
};

export default function Chat(props) {
    const classes = useStyles();

    // i18n
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    //

    const [language, setLanguage] = useState(i18n.language);
    const handleChangeLanguage = (e) => {
        let language = e.target.value;
        setLanguage(language);
        changeLanguage(language);
    };

    const userId = props.user.id;
    const username = props.user.name;
    const [chatText, setChatText] = useState("");
    const [rooms, setRooms] = useState();
    const [activeChat, setActiveChat] = useState({
        id: "",
        name: "",
        type: "",
    });
    const [currentChatroomMessages, setCurrentChatroomMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [StompCommunicationInitialized, setStompCommunicationInitialized] =
        useState(false);
    const [notificationsSubscribed, setNotificationsSubscribed] =
        useState(false);
    const [subscribedChatrooms, setSubscribedChatrooms] = useState([]);

    const setChatrooms = () => {
        axios
            .get(REACT_APP_PROFILE_SERVER_ADDRESS + "/users/me")
            .then((response) => {
                let rooms = [];
                for (const friend of response.data.friends) {
                    rooms.push({
                        id: friend.pivot.duet_id,
                        name: friend.name,
                        type: "private",
                    });
                }
                for (const chatRoom of response.data.chat_rooms) {
                    rooms.push({
                        id: chatRoom.id,
                        name: chatRoom.name,
                        type: "group",
                    });
                }
                setRooms(rooms);
            });
    };

    useEffect(setChatrooms, [username]); // set chatrooms after entering the chat page

    useEffect(() => {
        if (rooms === undefined) {
            return;
        }
        if (rooms.length > 0) {
            if (activeChat.id === "") {
                setActiveChat(rooms[0]);
            }
        }
        if (!StompCommunicationInitialized) {
            initializeStompCommunication();
            setStompCommunicationInitialized(true); // not perfect
        } else {
            subscribeStuffs();
        }
    }, [rooms]);

    useEffect(() => {
        function refreshChatroomMessages(receivedMessages, activeChat) {
            let messages = findChatMessages(receivedMessages, activeChat);
            setCurrentChatroomMessages(messages);
        }
        refreshChatroomMessages(receivedMessages, activeChat);
    }, [activeChat, receivedMessages]);

    const initializeStompCommunication = () => {
        const Stomp = require("stompjs");
        var SockJS = require("sockjs-client");
        SockJS = new SockJS(REACT_APP_CHAT_SERVER_ADDRESS + "/chat");
        stompClient = Stomp.over(SockJS);
        stompClient.connect({ username: username }, onConnected, onError);
    };

    const subscribeStuffs = () => {
        subscribeNotifications();
        subscribeChatrooms();
    };

    const onConnected = () => {
        console.log("connected");
        subscribeStuffs();
    };

    const subscribeNotifications = () => {
        if (notificationsSubscribed) {
            return;
        }
        stompClient.subscribe("/topic/notice." + username, onNoticeReceived);
        setNotificationsSubscribed(true);
    };

    const onNoticeReceived = (ntc) => {
        let notice = JSON.parse(ntc.body);
        if (notice.type === 1) {
            setChatrooms();
        }
    };

    const subscribeChatrooms = () => {
        rooms.forEach((room) => {
            let id = room.id;
            let type = room.type;
            if (
                subscribedChatrooms.some(
                    (chatRoom) =>
                        chatRoom["id"] === id && chatRoom["type"] === type
                )
            ) {
                return;
            }

            if (type === "private") {
                stompClient.subscribe(
                    "/topic/friends." + id,
                    onMessageReceived
                );
            } else if (type === "group") {
                stompClient.subscribe(
                    "/topic/chatrooms." + id,
                    onMessageReceived
                );
            }

            setSubscribedChatrooms((subscribedChatrooms) => [
                ...subscribedChatrooms,
                {
                    id: id,
                    type: type,
                },
            ]);
        });
    };

    const onMessageReceived = (msg) => {
        let message = JSON.parse(msg.body);
        message.time = new Date(message.time).toString();
        if (message.sender === username) {
            message.mine = true;
        } else {
            message.mine = false;
        }
        setReceivedMessages((messages) => [...messages, message]);
    };

    const onError = (err) => {
        console.log(err);
    };

    useEffect(() => {
        var element = document.getElementById("dialogBox");
        element.scrollTop = element.scrollHeight;
    }, [currentChatroomMessages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendChatMessage();
        }
    };

    async function sendChatMessage() {
        let response = await axios.get(REACT_APP_CHAT_SERVER_ADDRESS + "/time");
        sendMessage(response.data.UTCTime.UnixTime);
    }

    const sendMessage = (time) => {
        setChatText("");
        let msg = chatText;
        if (msg.trim() !== "") {
            let id = activeChat.id;
            let type = activeChat.type;
            let guestName = activeChat.name;
            const message = {
                chatId: id,
                type: type,
                sender: username,
                receiver: guestName,
                content: msg,
                time: new Date(time),
            };

            if (activeChat.type === "private") {
                stompClient.send(
                    "/app/friends/" + id,
                    {},
                    JSON.stringify(message)
                );
            } else if (activeChat.type === "group") {
                stompClient.send(
                    "/app/chatrooms/" + id,
                    {},
                    JSON.stringify(message)
                );
            }
        }
    };

    // for popover
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    //

    return (
        <div>
            <CssBaseline />
            <Drawer
                className={classes.drawerOnLeft}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaperOnLeft,
                }}
                anchor="left"
            >
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div className={classes.toolbar}>
                        <div className={classes.logoContainer}>
                            <div
                                className={classes.logo}
                                style={{
                                    backgroundImage: "url(/images/logo.png)",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                }}
                            />
                        </div>
                    </div>
                    <Divider />

                    <div className={classes.chatRooms}>
                        <ChatProfileCards
                            chats={rooms}
                            activeChat={activeChat}
                            setActiveChat={setActiveChat}
                        ></ChatProfileCards>
                    </div>

                    <Panels
                        userId={userId}
                        username={username}
                        setChatrooms={setChatrooms}
                    ></Panels>

                    <div
                        style={{
                            height: "110px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                marginLeft: "40px",
                            }}
                        >
                            <Typography variant="h4">{username}</Typography>
                        </div>
                    </div>
                </div>
            </Drawer>

            <CssBaseline />
            <Drawer
                className={classes.drawerOnRight}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaperOnRight,
                }}
                anchor="right"
            >
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <AppBar position="sticky" className={classes.appBar}>
                        <Toolbar
                            className={classes.appBarContentContainer}
                            style={{
                                backgroundImage:
                                    "url(/images/Purple-Moon-Vaporwave-Music-Album-Cover-Art.png)",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className={classes.chatroomName}>
                                <Button
                                    theme="default"
                                    variant="text"
                                    size="large"
                                    className={classes.activeChatButton}
                                    onClick={handleClick}
                                >
                                    <Typography
                                        variant="h4"
                                        noWrap
                                        style={{ color: "#FFCF36" }}
                                    >
                                        {activeChat.name}
                                    </Typography>
                                </Button>
                                <Popover
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: "center",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "center",
                                        horizontal: "left",
                                    }}
                                >
                                    <div className={classes.chatRoomInfo}>
                                        <Typography
                                            variant="h6"
                                            className={
                                                classes.chatRoomInfoTitle
                                            }
                                        >
                                            {t("chat.chatRoomInfo")}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            ID: {activeChat.id}
                                        </Typography>
                                    </div>
                                </Popover>
                            </div>
                            <FormControl className={classes.languageSelector}>
                                <InputLabel style={{ color: "#FFCF36" }}>
                                    {t("chat.languageIndicator")}
                                </InputLabel>
                                <Select
                                    value={language}
                                    onChange={(e) => handleChangeLanguage(e)}
                                    style={{ color: "#FFCF36" }}
                                >
                                    <MenuItem value="en">English</MenuItem>
                                    <MenuItem value="zh-CN">中文</MenuItem>
                                </Select>
                            </FormControl>
                        </Toolbar>
                    </AppBar>

                    <div id="dialogBox" className={classes.messagesArea}>
                        {currentChatroomMessages.map((message) => (
                            <MessageBox
                                username={message.sender}
                                content={message.content}
                                time={message.time}
                                mine={message.mine}
                            ></MessageBox>
                        ))}
                    </div>

                    <div className={classes.inputContainer}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows="8"
                            value={chatText}
                            onChange={(e) => setChatText(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e)}
                        ></TextField>
                        <Button
                            theme="primary"
                            variant="outline"
                            onClick={sendChatMessage}
                        >
                            {t("chat.sendButton")}
                        </Button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}
