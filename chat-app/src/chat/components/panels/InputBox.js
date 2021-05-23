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
        width: 400,
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
        if (activeOption === "Create Chatroom") {
            setInputPlaceholder("create a new chatroom...");
        }
        if (activeOption === "Join Chatroom") {
            setInputPlaceholder("join a chatroom...");
        }
        if (activeOption === "New Friend") {
            setInputPlaceholder("add a new friend...");
        }
    }, [activeOption]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (activeOption === "New Friend") {
            addANewFriend(username, inputText);
        }
        if (activeOption === "Join Chatroom") {
            joinAChatroom(username, inputText);
        }
        if (activeOption === "Create Chatroom") {
            createAChatroom(username, inputText);
        }
    };

    const addANewFriend = (username, friendName) => {
        let formData = new FormData();
        formData.append("username", username);
        formData.append("friendName", friendName);
        fetch(REACT_APP_SERVER_ADDRESS + "/user/friend", {
            method: "POST",
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

    const joinAChatroom = (username, chatroomId) => {
        let formData = new FormData();
        formData.append("username", username);
        formData.append("chatroomId", chatroomId);
        fetch(REACT_APP_SERVER_ADDRESS + "/user/chatroom", {
            method: "PUT",
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

    const createAChatroom = (username, chatroomName) => {
        let formData = new FormData();
        formData.append("username", username);
        formData.append("chatroomName", chatroomName);
        fetch(REACT_APP_SERVER_ADDRESS + "/chatroom", {
            method: "POST",
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
