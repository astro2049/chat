import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Paper, TextField } from "@material-ui/core";
import axios from "axios";
import { useTranslation } from "react-i18next";

const panelsWidth = "95%";

const useStyles = makeStyles((theme) => ({
    container: {
        width: panelsWidth,
        marginTop: 14,
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
    },
    root: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

const { REACT_APP_SERVER_ADDRESS } = process.env;

export default function CustomizedInputBase(props) {
    const classes = useStyles();

    // i18n
    const { t, i18n } = useTranslation();

    const username = props.username;
    const activeOption = props.activeOption;
    const setChatrooms = props.setChatrooms;
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
        let formData = new FormData();
        let requestAddress;
        switch (type) {
            case "new friend!":
                requestAddress = "/users/" + username + "/friends/" + guest;
                break;
            case "join chatroom!":
                requestAddress = "/chatrooms/" + guest + "/users/" + username;
                break;
            case "new chatroom!":
                formData.append("username", username);
                formData.append("chatroomName", guest);
                requestAddress = "/chatrooms";
                break;
            default:
                console.log("check parameter");
        }
        axios
            .request({
                url: REACT_APP_SERVER_ADDRESS + requestAddress,
                method: "POST",
                data: formData,
            })
            .then((response) => {
                if (response.status === 201) {
                    setChatrooms();
                }
            });
    };

    return (
        <div className={classes.container}>
            <Paper
                component="form"
                className={classes.root}
                elevation={0}
                onSubmit={(e) => onSubmit(e)}
            >
                <TextField
                    className={classes.input}
                    placeholder={inputPlaceholder}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <IconButton
                    type="submit"
                    className={classes.iconButton}
                    aria-label="search"
                >
                    <ArrowForwardIcon />
                </IconButton>
            </Paper>
        </div>
    );
}
