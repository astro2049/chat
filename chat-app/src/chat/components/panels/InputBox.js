import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Paper, TextField } from "@material-ui/core";

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

    const username = props.username;
    const activeOption = props.activeOption;
    const setChatrooms = props.setChatrooms;
    const [inputPlaceholder, setInputPlaceholder] = useState("");
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        switch (activeOption) {
            case "Create Chatroom":
                setInputPlaceholder("the new chatroom will be...");
                break;
            case "Join Chatroom":
                setInputPlaceholder("chatroom id goes here...");
                break;
            case "New Friend":
                setInputPlaceholder("add a new friend...");
                break;
            default:
                console.log("check parameter");
        }
        setInputText("");
    }, [activeOption]);

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
        formData.append("username", username);
        let requestAddress;
        let requestMethod;
        switch (type) {
            case "new friend!":
                formData.append("friendName", guest);
                requestAddress = "/user/friend";
                requestMethod = "POST";
                break;
            case "join chatroom!":
                formData.append("chatroomId", guest);
                requestAddress = "/user/chatroom";
                requestMethod = "PUT";
                break;
            case "new chatroom!":
                formData.append("chatroomName", guest);
                requestAddress = "/chatroom";
                requestMethod = "POST";
                break;
            default:
                console.log("check parameter");
        }
        fetch(REACT_APP_SERVER_ADDRESS + requestAddress, {
            method: requestMethod,
            body: formData,
        }).then((response) => {
            response.json().then((data) => {
                if (data.success === true) {
                    setChatrooms();
                } else {
                    console.log("nope");
                }
            });
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
