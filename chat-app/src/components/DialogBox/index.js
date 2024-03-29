import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import {
    Button,
    Chip,
    Divider,
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
import displaySnackbar from "../Snackbar";
import dayjs from "dayjs";

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
        width: 330,
        height: "100%",
        paddingBottom: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    dialogContainer: {
        width: "100%",
        height: "100%",
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 25,
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
    },
}));

export default function DialogBox(props) {
    const classes = useStyles();

    // i18n
    const { t, i18n } = useTranslation();

    const activeChat = props.activeChat;
    const userId = props.userId;
    const setChatrooms = props.setChatrooms;
    const setActiveChat = props.setActiveChat;

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

    const deleteGroupChat = () => {
        let successMessage =
            t("operations.disbandGroupChat.success") + activeChat.name;
        axios
            .request({
                url:
                    global.PROFILE_SERVER_ADDRESS +
                    "/chatRooms/" +
                    activeChat.id,
                method: "DELETE",
            })
            .then((response) => {
                displaySnackbar(successMessage, "success");
                setActiveChat(undefined);
                setChatrooms();
            })
            .catch(() => {
                displaySnackbar(t("operations.failure"), "warning");
            });
    };

    const deleteChat = () => {
        let route;
        let successMessage;
        switch (activeChat.type) {
            case global.CHAT_TYPE_FRIEND:
                route = "/users/" + userId + "/friends/" + activeChat.name;
                successMessage =
                    t("operations.deleteFriend.success") + activeChat.name;
                break;
            case global.CHAT_TYPE_GROUP_CHAT:
                route = "/chatRooms/" + activeChat.id + "/members";
                successMessage =
                    t("operations.leaveGroupChat.success") + activeChat.name;
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
                displaySnackbar(successMessage, "success");
                setActiveChat(undefined);
                setChatrooms();
            })
            .catch(() => {
                displaySnackbar(t("operations.failure"), "warning");
            });
    };

    const chatInfo = () => {
        return (
            <div className={classes.outerInfoContainer}>
                <Paper className={classes.innerInfoContainer}>
                    <List
                        subheader={
                            <ListSubheader component="div">
                                {t("DialogBox.chatInfo.header")}
                            </ListSubheader>
                        }
                    >
                        <ListItem>
                            <ListItemIcon>
                                <Typography variant="body1">
                                    {t("DialogBox.chatInfo.type")}
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
                                <Typography variant="body1">ID</Typography>
                            </ListItemIcon>
                            <Typography variant="body1">
                                {activeChat.id}
                            </Typography>
                        </ListItem>
                    </List>
                    <div>
                        {activeChat.type === global.CHAT_TYPE_GROUP_CHAT &&
                            activeChat.creator_id === userId && (
                                <div>
                                    <List
                                        subheader={
                                            <ListSubheader component="div">
                                                {t(
                                                    "DialogBox.chatInfo.creatorAbilities.title"
                                                )}
                                            </ListSubheader>
                                        }
                                    >
                                        <ListItem
                                            secondaryAction={
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{
                                                        textTransform: "none",
                                                    }}
                                                    onClick={() =>
                                                        deleteGroupChat()
                                                    }
                                                >
                                                    {t(
                                                        "DialogBox.chatInfo.dangerZone.group_chat.disband.buttonText"
                                                    ) +
                                                        " " +
                                                        activeChat.name}
                                                </Button>
                                            }
                                        >
                                            <ListItemIcon>
                                                <Typography variant="body1">
                                                    {t(
                                                        "DialogBox.chatInfo.dangerZone.group_chat.disband.title"
                                                    )}
                                                </Typography>
                                            </ListItemIcon>
                                        </ListItem>
                                    </List>
                                    <Divider sx={{ mt: 1 }} variant="middle" />
                                </div>
                            )}
                        <List
                            subheader={
                                <ListSubheader component="div">
                                    {t("DialogBox.chatInfo.dangerZone.title")}
                                </ListSubheader>
                            }
                        >
                            <ListItem
                                secondaryAction={
                                    <Button
                                        variant="outlined"
                                        color={
                                            activeChat.type ===
                                            global.CHAT_TYPE_FRIEND
                                                ? "error"
                                                : "warning"
                                        }
                                        sx={{ textTransform: "none" }}
                                        onClick={() => deleteChat()}
                                    >
                                        {t(
                                            `DialogBox.chatInfo.dangerZone.${
                                                activeChat.type ===
                                                global.CHAT_TYPE_FRIEND
                                                    ? "friend.delete.buttonText"
                                                    : "group_chat.leave"
                                            }`
                                        ) +
                                            " " +
                                            activeChat.name}
                                    </Button>
                                }
                            >
                                <ListItemIcon>
                                    <Typography variant="body1">
                                        {t(
                                            `DialogBox.chatInfo.dangerZone.${
                                                activeChat.type ===
                                                global.CHAT_TYPE_FRIEND
                                                    ? "friend.delete.title"
                                                    : "group_chat.leave"
                                            }`
                                        )}
                                    </Typography>
                                </ListItemIcon>
                            </ListItem>
                        </List>
                    </div>
                </Paper>
            </div>
        );
    };

    const dialogBox = () => {
        let dialog = [];
        if (activeChat) {
            for (let i = 0; i < activeChat.messages.length; i++) {
                let message = activeChat.messages[i];
                let addTimeChip = false;
                if (i === 0) {
                    addTimeChip = true;
                } else {
                    let previousMessage = activeChat.messages[i - 1];
                    if (
                        new dayjs(previousMessage.time).isBefore(
                            new dayjs(message.time).subtract(3, "minute")
                        )
                    ) {
                        addTimeChip = true;
                    }
                }
                if (addTimeChip) {
                    dialog.push(
                        <div style={{ alignSelf: "center", marginTop: 10 }}>
                            <Chip
                                label={message.time.substring(16, 21)}
                                size="small"
                                variant="outlined"
                                color="secondary"
                            />
                        </div>
                    );
                }
                dialog.push(
                    <MessageBox
                        key={i}
                        username={message.sender}
                        content={message.content}
                        time={message.time}
                        mine={message.mine}
                    />
                );
            }
        }
        return (
            <div id="dialogBox" className={classes.dialogContainer}>
                {dialog}
            </div>
        );
    };

    return (
        <div className={classes.container}>
            {activeChat && activeChat.display_info === true
                ? chatInfo()
                : dialogBox()}
        </div>
    );
}
