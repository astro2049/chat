import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 500,
        marginTop: 20,
    },
    messageOnLeftSide: {
        alignSelf: "flex-start",
        flexDirection: "column",
        alignItems: "flex-start",
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 20,
        paddingBottom: 10,
    },
    messageOnRightSide: {
        alignSelf: "flex-end",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        paddingTop: 5,
        paddingLeft: 20,
        paddingRight: 10,
        paddingBottom: 10,
        backgroundColor: "lightpink",
    },
    username: {
        marginBottom: 5,
    },
}));

export default function ChatMessage(props) {
    const classes = useStyles();

    const username = props.username;
    const content = props.content;
    const mine = props.mine;

    const messageClass = mine
        ? classes.messageOnRightSide
        : classes.messageOnLeftSide;

    return (
        <Card className={[classes.container, messageClass].join(" ")}>
            <Typography variant="h6" className={classes.username} hidden>
                {username}
            </Typography>
            <Typography variant="h6" style={{ wordWrap: "break-word" }}>
                {content}
            </Typography>
        </Card>
    );
}
