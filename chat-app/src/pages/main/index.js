import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "tdesign-react";
import {
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton,
} from "@mui/material";
import Panel from "../../components/Panel/index";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ChatCards from "../../components/ChatCards";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContentInput from "../../components/ContentInput";
import DialogBox from "../../components/DialogBox";
import global from "../../utils/globalVars";

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
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    chatroomName: {
        display: "flex",
        alignItems: "center",
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
        minWidth: 200,
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
}));

var stompClient = null;

const getComeAndGoChats = (chats, incomingChats, type) => {
    let comeAndGoChats = [];
    if (type === "friends") {
        comeAndGoChats.comers = incomingChats.filter(
            (incomingChat) =>
                !chats.some((chat) => chat.id === incomingChat.pivot.duet_id)
        );
        comeAndGoChats.goers = chats.filter(
            (chat) =>
                !incomingChats.some(
                    (incomingChat) => incomingChat.pivot.duet_id === chat.id
                )
        );
        return comeAndGoChats;
    } else if (type === "group chats") {
        comeAndGoChats.comers = incomingChats.filter(
            (incomingChat) => !chats.some((chat) => chat.id === incomingChat.id)
        );
        comeAndGoChats.goers = chats.filter(
            (chat) =>
                !incomingChats.some(
                    (incomingChat) => incomingChat.id === chat.id
                )
        );
        return comeAndGoChats;
    } else {
        return;
    }
};

const scrollToDialogBoxBottom = () => {
    let element = document.getElementById("dialogBox");
    if (!element) {
        return;
    }
    element.scrollTop = element.scrollHeight;
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
    const [rooms, setRooms] = useState();
    const roomsRef = useRef();
    roomsRef.current = rooms;
    const [roomsIndexMapForChatList] = useState([]);
    const roomsIndexMapForChatListRef = useRef();
    roomsIndexMapForChatListRef.current = roomsIndexMapForChatList;
    const [roomsCount, setRoomsCount] = useState();
    const [activeChat, setActiveChat] = useState();
    const activeChatRef = useRef();
    activeChatRef.current = activeChat;
    const [StompCommunicationInitialized, setStompCommunicationInitialized] =
        useState(false);
    const [notificationsSubscribed, setNotificationsSubscribed] =
        useState(false);
    const [pageIsReady, setPageIsReady] = useState(false);
    const [skeletonsCount, setSkeletonsCount] = useState();

    const [rerender, setRerender] = useState(false);
    const rerenderRef = useRef();
    rerenderRef.current = rerender;

    const pleaseRerender = () => {
        setRerender(!rerenderRef.current);
    };

    useEffect(() => {
        let height = window.innerHeight - appBarHeight - inputContainerHeight;
        setSkeletonsCount(height / 86 - 1);
    }, []);

    const setChatrooms = () => {
        axios
            .get(global.PROFILE_SERVER_ADDRESS + "/users/me")
            .then((response) => {
                let currentRooms =
                    roomsRef.current === undefined ? [] : roomsRef.current;

                let currentFriends = currentRooms.filter(
                    (room) => room.type === global.CHAT_TYPE_FRIEND
                );
                let currentGroupChats = currentRooms.filter(
                    (room) => room.type === global.CHAT_TYPE_GROUP_CHAT
                );

                let comeAndGoFriends = getComeAndGoChats(
                    currentFriends,
                    response.data.friends,
                    "friends"
                );
                let comeAndGoGroupChats = getComeAndGoChats(
                    currentGroupChats,
                    response.data.chat_rooms,
                    "group chats"
                );

                let comers = [];
                for (const friend of comeAndGoFriends.comers) {
                    comers.push({
                        id: friend.pivot.duet_id,
                        name: friend.name,
                        type: global.CHAT_TYPE_FRIEND,
                        display_info: false,
                        messages: [],
                        chatText: "",
                        unreadMessagesCount: 0,
                        subscribed: false,
                        subscription: null,
                    });
                }
                for (const groupChat of comeAndGoGroupChats.comers) {
                    comers.push({
                        id: groupChat.id,
                        name: groupChat.name,
                        creator_id: groupChat.creator_id,
                        type: global.CHAT_TYPE_GROUP_CHAT,
                        display_info: false,
                        messages: [],
                        chatText: "",
                        unreadMessagesCount: 0,
                        subscribed: false,
                        subscription: null,
                    });
                }

                let goers = [
                    ...comeAndGoFriends.goers,
                    ...comeAndGoGroupChats.goers,
                ];
                unsubscribeChats(goers);

                let survivors = [...currentRooms].filter(
                    (room) =>
                        !goers.some(
                            (goer) =>
                                goer.id === room.id && goer.type && room.type
                        )
                );

                removeLeaversFromChatsIndexMap(goers);
                addComersToChatsIndexMap(comers);

                setRooms([...survivors, ...comers]);
            });
    };

    const addComersToChatsIndexMap = (comers) => {
        comers.forEach(() => {
            roomsIndexMapForChatList.unshift(
                roomsIndexMapForChatListRef.current.length
            );
        });
    };

    const removeLeaversFromChatsIndexMap = (leavers) => {
        let roomsIndexMap = roomsIndexMapForChatListRef.current;
        let minus = new Array(roomsIndexMap.length).fill(0);
        let roomsIndexMapLeaverIndexes = [];

        leavers.forEach((leaver) => {
            let roomIndex = roomsRef.current.findIndex((room) => {
                return room.id === leaver.id && room.type === leaver.type;
            });

            for (let i = 0; i < roomsIndexMap.length; i++) {
                if (roomsIndexMap[i] < roomIndex) {
                    continue;
                } else if (roomsIndexMap[i] > roomIndex) {
                    minus[i]++;
                } else {
                    roomsIndexMapLeaverIndexes.push(i);
                }
            }
        });

        for (let i = 0; i < roomsIndexMap.length; i++) {
            roomsIndexMapForChatList[i] -= minus[i];
        }
        for (const index of roomsIndexMapLeaverIndexes) {
            roomsIndexMapForChatList.splice(index, 1);
        }
    };

    const unsubscribeChats = (leavers) => {
        for (const leaver of leavers) {
            leaver.subscription.unsubscribe();
        }
    };

    useEffect(setChatrooms, [username]); // set chatrooms after entering the chat page

    useEffect(() => {
        if (rooms === undefined) {
            // return if rooms[] is undefined
            return;
        } else {
            if (rooms.length === roomsCount) {
                // return if the length of rooms[] is not changed
                return;
            }
            setRoomsCount(rooms.length);
        }
        if (rooms.length > 0) {
            if (!activeChat) {
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

    const initializeStompCommunication = () => {
        const Stomp = require("stompjs");
        var SockJS = require("sockjs-client");
        SockJS = new SockJS(global.CHAT_SERVER_ADDRESS + "/chat");
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
        if (notice.type === 0) {
            setPageIsReady(true);
        } else if (notice.type === 1) {
            setChatrooms();
        } else if (notice.type === 2) {
            let content = JSON.parse(notice.content);
            if (content.friend_name === activeChatRef.current.name) {
                // if the ended friendship is the current one
                setActiveChat(undefined);
            }
            setChatrooms();
        } else if (notice.type === 3) {
            let content = JSON.parse(notice.content);
            if (content.id === activeChatRef.current.id) {
                // if the current group chat is disbanded
                setActiveChat(undefined);
            }
            setChatrooms();
        }
    };

    const subscribeChatrooms = () => {
        rooms.forEach((room) => {
            let id = room.id;
            let type = room.type;
            if (room.subscribed) {
                return;
            }

            let topic;
            if (type === global.CHAT_TYPE_FRIEND) {
                topic = "/topic/friends." + id;
            } else if (type === global.CHAT_TYPE_GROUP_CHAT) {
                topic = "/topic/chatrooms." + id;
            }
            let subscription = stompClient.subscribe(topic, onMessageReceived);
            room.subscribed = true;
            room.subscription = subscription;
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
        deliverMessageToChat(message);
    };

    const deliverMessageToChat = (message) => {
        let roomIndex = 0;
        for (const room of roomsRef.current) {
            if (message.chatId === room.id && message.type === room.type) {
                room.messages.push(message);
                moveThisRoomToTheFront(roomIndex);
                pleaseRerender();
                if (
                    room.id === activeChatRef.current.id &&
                    room.type === activeChatRef.current.type
                ) {
                    if (!activeChatRef.current.display_info) {
                        scrollToDialogBoxBottom();
                    }
                } else {
                    room.unreadMessagesCount++;
                    pleaseRerender();
                }
                break;
            }
            roomIndex++;
        }
    };

    const moveThisRoomToTheFront = (roomIndex) => {
        roomsIndexMapForChatList.splice(
            roomsIndexMapForChatList.indexOf(roomIndex),
            1
        );
        roomsIndexMapForChatList.unshift(roomIndex);
    };

    const onError = (err) => {
        console.log(err);
    };

    async function sendChatMessage() {
        let response = await axios.get(global.CHAT_SERVER_ADDRESS + "/time");
        sendMessage(response.data.UTCTime.UnixTime);
    }

    const sendMessage = (time) => {
        let msg = activeChat.chatText;
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

            if (activeChat.type === global.CHAT_TYPE_FRIEND) {
                stompClient.send(
                    "/app/friends/" + id,
                    {},
                    JSON.stringify(message)
                );
            } else if (activeChat.type === global.CHAT_TYPE_GROUP_CHAT) {
                stompClient.send(
                    "/app/chatrooms/" + id,
                    {},
                    JSON.stringify(message)
                );
            }

            activeChat.chatText = "";
        }
    };

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
                        <ChatCards
                            chats={rooms}
                            chatsIndexMap={roomsIndexMapForChatList}
                            activeChat={activeChat}
                            setActiveChat={setActiveChat}
                            pageIsReady={pageIsReady}
                            skeletonsCount={skeletonsCount}
                        />
                    </div>

                    <Panel
                        userId={userId}
                        setChatrooms={setChatrooms}
                        pageIsReady={pageIsReady}
                        pleaseRerender={pleaseRerender}
                    />

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
                                {!pageIsReady ? (
                                    <Skeleton
                                        sx={{
                                            marginLeft: 2,
                                            width: 130,
                                            height: 60,
                                        }}
                                        variant="text"
                                        animation="wave"
                                    />
                                ) : (
                                    <div>
                                        {activeChat && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography
                                                    variant="h4"
                                                    noWrap
                                                    sx={{
                                                        marginLeft: 2,
                                                        marginRight: 1,
                                                    }}
                                                    style={{ color: "#FFCF36" }}
                                                >
                                                    {activeChat.name}
                                                </Typography>
                                                <Button
                                                    variant="text"
                                                    shape="square"
                                                    icon={
                                                        activeChat.display_info ? (
                                                            <ChatIcon
                                                                sx={{
                                                                    color: "#FFCF36",
                                                                }}
                                                            />
                                                        ) : (
                                                            <MoreVertIcon
                                                                sx={{
                                                                    color: "#FFCF36",
                                                                }}
                                                            />
                                                        )
                                                    }
                                                    onClick={() => {
                                                        activeChat.display_info =
                                                            !activeChat.display_info;
                                                        pleaseRerender();
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <FormControl
                                variant="standard"
                                className={classes.languageSelector}
                            >
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

                    <DialogBox
                        activeChat={activeChat}
                        userId={userId}
                        setChatrooms={setChatrooms}
                        setActiveChat={setActiveChat}
                    />

                    <ContentInput
                        activeChat={activeChat}
                        setActiveChat={setActiveChat}
                        pageIsReady={pageIsReady}
                        sendChatMessage={sendChatMessage}
                        pleaseRerender={pleaseRerender}
                    />
                </div>
            </Drawer>
        </div>
    );
}
