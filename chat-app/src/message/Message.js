import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 500,
        marginTop: 20,
    },
}));

export default function ChatMessage(props) {
    const classes = useStyles();

    const username = props.username;
    const content = props.content;

    return (
        <Card className={classes.container}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {username}:
                </Typography>
                <Typography variant="body1">{content}</Typography>
            </CardContent>
        </Card>
    );
}
