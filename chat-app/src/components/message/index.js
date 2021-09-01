import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 500,
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
    },
    containerOnLeftSide: {
        alignSelf: "flex-start",
        alignItems: "flex-start",
    },
    containerOnRightSide: {
        alignSelf: "flex-end",
        alignItems: "flex-end",
    },
    messageCard: {
        display: "flex",
        flexDirection: "column",
        paddingTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
    },
    myMessage: {
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
    const time = props.time.substring(16, 21);
    const mine = props.mine;

    const containerClass = mine
        ? classes.containerOnRightSide
        : classes.containerOnLeftSide;

    const cardClass = mine ? classes.myMessage : "";

    return (
        <div className={[classes.container, containerClass].join(" ")}>
            <Typography
                variant="subtitle1"
                color="textSecondary"
                className={classes.time}
            >
                {time}
            </Typography>
            <Card className={[classes.messageCard, cardClass].join(" ")}>
                <Typography variant="h6" className={classes.username} hidden>
                    {username}
                </Typography>
                <Typography variant="h6" style={{ wordWrap: "break-word" }}>
                    {content}
                </Typography>
            </Card>
        </div>
    );
}
