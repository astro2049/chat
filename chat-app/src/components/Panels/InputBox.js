import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Paper, TextField } from "@material-ui/core";
import axios from "axios";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: 14,
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
}));

const { REACT_APP_PROFILE_SERVER_ADDRESS } = process.env;

export default function CustomizedInputBase(props) {
    const classes = useStyles();

    // i18n
    const { t, i18n } = useTranslation();

    const userId = props.userId;
    const username = props.username;
    const activeOption = props.activeOption;
    const setChatrooms = props.setChatrooms;
    const pageIsReady = props.pageIsReady;
    const [inputPlaceholder, setInputPlaceholder] = useState("");
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        switch (activeOption) {
            case "Create Chatroom":
                setInputPlaceholder(t("chat.panels.createChatroom.promptText"));
                break;
            case "Join Chatroom":
                setInputPlaceholder(t("chat.panels.joinChatroom.promptText"));
                break;
            case "New Friend":
                setInputPlaceholder(t("chat.panels.newFriend.promptText"));
                break;
            default:
                break;
        }
        setInputText("");
    }, [activeOption, i18n.language, t]);

    const onSubmit = (e) => {
        e.preventDefault();
        switch (activeOption) {
            case "New Friend":
                launchCommand(username, inputText, "new friend!");
                break;
            case "Join Chatroom":
                launchCommand(username, inputText, "join chatroom!");
                break;
            case "Create Chatroom":
                launchCommand(username, inputText, "new chatroom!");
                break;
            default:
                console.log("check parameter");
        }
        setInputText("");
    };

    const launchCommand = (username, guest, type) => {
        let requestAddress;
        let method = "";
        let data = {};
        switch (type) {
            case "new friend!":
                requestAddress = "/users/" + userId;
                method = "PATCH";
                data["newFriend"] = guest;
                break;
            case "join chatroom!":
                requestAddress = "/chatRooms/" + guest;
                method = "PATCH";
                break;
            case "new chatroom!":
                requestAddress = "/chatRooms";
                method = "POST";
                data["name"] = guest;
                break;
            default:
        }
        axios
            .request({
                url: REACT_APP_PROFILE_SERVER_ADDRESS + requestAddress,
                method: method,
                data: data,
            })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    setChatrooms();
                }
            });
    };

    return (
        <div className={classes.container}>
            <Paper
                component="form"
                style={{
                    padding: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                }}
                elevation={0}
                onSubmit={(e) => onSubmit(e)}
            >
                <TextField
                    className={classes.input}
                    placeholder={inputPlaceholder}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={!pageIsReady}
                />
                <IconButton
                    type="submit"
                    style={{ padding: 10 }}
                    aria-label="search"
                    disabled={!pageIsReady}
                >
                    <ArrowForwardIcon />
                </IconButton>
            </Paper>
        </div>
    );
}
