import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import {
    Chip,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListSubheader,
    Paper,
    Typography,
} from "@mui/material";
import MessageBox from "../Message";

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
    const displayActivechatInfo = props.displayActivechatInfo;

    const typeText = {
        en: {
            private: "Friend",
            group: "Group Chat",
        },
        "zh-CN": {
            private: "好友",
            group: "聊天组",
        },
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
                                    activeChat.type === "private"
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
            {displayActivechatInfo === true ? chatInfo() : dialogBox()}
        </div>
    );
}
