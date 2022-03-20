import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { Button } from "tdesign-react";
import { TextField } from "@mui/material";

const inputContainerHeight = 258;

const useStyles = makeStyles((theme) => ({
    container: {
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

export default function ContentInput(props) {
    const classes = useStyles();

    // i18n
    const { t } = useTranslation();

    const activeChat = props.activeChat;
    const setActiveChat = props.setActiveChat;
    const pageIsReady = props.pageIsReady;
    const displayActiveChatInfo = props.displayActiveChatInfo;
    const sendChatMessage = props.sendChatMessage;

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendChatMessage();
        }
    };

    return (
        <div className={classes.container}>
            <TextField
                variant="outlined"
                fullWidth
                multiline
                rows="7"
                value={activeChat ? activeChat.chatText : ""}
                onChange={(e) => {
                    setActiveChat((prevState) => {
                        return {
                            ...prevState,
                            chatText: e.target.value,
                        };
                    });
                }}
                onKeyDown={(e) => handleKeyDown(e)}
                disabled={!pageIsReady || displayActiveChatInfo}
            />
            <Button
                theme="primary"
                variant="outline"
                onClick={sendChatMessage}
                disabled={!pageIsReady || displayActiveChatInfo}
            >
                {t("chat.sendButton")}
            </Button>
        </div>
    );
}
