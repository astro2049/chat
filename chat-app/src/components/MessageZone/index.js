import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import {
    Button,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListSubheader,
    Paper,
    Typography,
} from "@mui/material";
import axios from "axios";
import MessageBox from "../Message";
import global from "../../utils/globalVars";

const appBarHeight = 80;
const inputContainerHeight = 258;

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        height: `calc(100% - ${appBarHeight}px - ${inputContainerHeight}px)`,
    },
    outerInfoContainer: {
        width: "100%",
        height: "100%",
        padding: 20,
        backgroundColor: "rgba(25, 118, 210, 0.08)",
    },
    innerInfoContainer: {
        marginLeft: 20,
        width: 300,
        height: "100%",
        paddingBottom: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
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

    // i18n
    const { t, i18n } = useTranslation();

    const activeChat = props.activeChat;
    const displayActiveChatInfo = props.displayActiveChatInfo;
    const userId = props.userId;
    const setChatrooms = props.setChatrooms;

    const typeText = {
        en: {
            friend: "Friend",
            group_chat: "Group Chat",
        },
        "zh-CN": {
            friend: "好友",
            group_chat: "聊天组",
        },
    };

    const deleteChat = () => {
        let route;
        switch (activeChat.type) {
            case global.CHAT_TYPE_FRIEND:
                route = "/users/" + userId + "/friends/" + activeChat.name;
                break;
            case global.CHAT_TYPE_GROUP_CHAT:
                route = "/chatRooms/" + activeChat.id + "/members";
                break;
            default:
                break;
        }
        axios
            .request({
                url: global.PROFILE_SERVER_ADDRESS + route,
                method: "DELETE",
            })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    setChatrooms();
                }
            });
    };

    const chatInfo = () => {
        return (
            <div className={classes.outerInfoContainer}>
                <Paper className={classes.innerInfoContainer}>
                    <List
                        subheader={
                            <ListSubheader component="div">
                                {t("MessageZone.chatInfo.header")}
                            </ListSubheader>
                        }
                    >
                        <ListItem>
                            <ListItemIcon>
                                <Typography body1>
                                    {t("MessageZone.chatInfo.type")}
                                </Typography>
                            </ListItemIcon>
                            <Chip
                                variant="outlined"
                                label={
                                    typeText[`${i18n.language}`][
                                        `${activeChat.type}`
                                    ]
                                }
                                color={
                                    activeChat.type === global.CHAT_TYPE_FRIEND
                                        ? "primary"
                                        : "secondary"
                                }
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Typography body1>ID</Typography>
                            </ListItemIcon>
                            <Typography variant="body1">
                                {activeChat.id}
                            </Typography>
                        </ListItem>
                    </List>
                    <List
                        subheader={
                            <ListSubheader component="div">
                                {t("MessageZone.chatInfo.dangerZone.header")}
                            </ListSubheader>
                        }
                    >
                        <ListItem
                            secondaryAction={
                                <Button
                                    variant="outlined"
                                    color="error"
                                    sx={{ textTransform: "none" }}
                                    onClick={() => deleteChat()}
                                >
                                    {t(
                                        `MessageZone.chatInfo.dangerZone.${
                                            activeChat.type ===
                                            global.CHAT_TYPE_FRIEND
                                                ? "delete"
                                                : "leave"
                                        }`
                                    ) +
                                        " " +
                                        activeChat.name}
                                </Button>
                            }
                        >
                            <ListItemIcon>
                                <Typography body1>
                                    {t(
                                        `MessageZone.chatInfo.dangerZone.${
                                            activeChat.type ===
                                            global.CHAT_TYPE_FRIEND
                                                ? "delete"
                                                : "leave"
                                        }`
                                    )}
                                </Typography>
                            </ListItemIcon>
                        </ListItem>
                    </List>
                </Paper>
            </div>
        );
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
            {displayActiveChatInfo === true ? chatInfo() : dialogBox()}
        </div>
    );
}
