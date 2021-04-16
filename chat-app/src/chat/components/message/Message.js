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
    },
    messageOnRightSide: {
        alignSelf: "flex-end",
        display: "flex",
        flexDirection: "row-reverse",
        backgroundColor: "lightpink",
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
            <CardContent>
                <Typography variant="h6" hidden>
                    {username}:
                </Typography>
                <Typography variant="body1" style={{ wordWrap: "break-word" }}>
                    {content}
                </Typography>
            </CardContent>
        </Card>
    );
}
