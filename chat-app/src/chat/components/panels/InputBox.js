import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const panelsWidth = "95%";

const useStyles = makeStyles((theme) => ({
    container: {
        width: panelsWidth,
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

export default function CustomizedInputBase(props) {
    const classes = useStyles();

    const activeOption = props.activeOption;
    const [inputPlaceholder, setInputPlaceholder] = useState("");

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

    return (
        <div className={classes.container}>
            <Paper component="form" className={classes.root}>
                <InputBase
                    className={classes.input}
                    placeholder={inputPlaceholder}
                    inputProps={{ "aria-label": "search google maps" }}
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
