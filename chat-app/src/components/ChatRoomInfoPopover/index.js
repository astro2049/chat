import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { Popover, Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    chatRoomInfo: {
        padding: "10px",
    },
    chatRoomInfoTitle: {
        paddingRight: "20px",
        borderBottom: "2px solid black",
    },
}));

export default function ChatRoomInfoPopOver(props) {
    const classes = useStyles();

    // i18n
    const { t, i18n } = useTranslation();

    const activeChat = props.activeChat;

    const anchorEl = props.anchorEl;
    const handleClose = props.handleClose;
    const open = Boolean(anchorEl);

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

    return (
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
                <Typography variant="h6" className={classes.chatRoomInfoTitle}>
                    {t("chat.chatRoomInfo.title")}
                </Typography>
                <Typography style={{ marginTop: 5 }} variant="subtitle1">
                    {t("chat.chatRoomInfo.type")}:{" "}
                    {typeText[`${i18n.language}`][`${activeChat.type}`]}
                </Typography>
                <Typography variant="subtitle1">ID: {activeChat.id}</Typography>
            </div>
        </Popover>
    );
}
