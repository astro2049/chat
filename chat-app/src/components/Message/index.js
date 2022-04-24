import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Card, Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 500,
        marginTop: 10,
    },
    containerOnLeftSide: {
        alignSelf: "flex-start",
    },
    containerOnRightSide: {
        alignSelf: "flex-end",
    },
    messageCard: {
        display: "flex",
        flexDirection: "column",
        paddingTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
    },
    username: {
        marginBottom: 5,
    },
}));

const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let r = (hash & 0xff0000) >> 16;
    let g = (hash & 0x00ff00) >> 8;
    let b = hash & 0x0000ff;
    return `rgba(${r},${g},${b},0.75)`;
};

const getNameAbbreviation = (name) => {
    if (!name) {
        return "";
    } else {
        return name.charAt(0);
    }
};

export default function ChatMessage(props) {
    const classes = useStyles();

    const username = props.username;
    const content = props.content;
    const time = props.time.substring(16, 21);
    const mine = props.mine;

    const containerClass = mine
        ? classes.containerOnRightSide
        : classes.containerOnLeftSide;

    return (
        <div className={[classes.container, containerClass].join(" ")}>
            <div style={{ display: "flex" }}>
                {!mine && (
                    <Avatar
                        sx={{
                            bgcolor: stringToColor(username),
                        }}
                        alt={username}
                    >
                        {getNameAbbreviation(username)}
                    </Avatar>
                )}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "10px",
                        marginRight: "10px",
                    }}
                >
                    {!mine && (
                        <Typography
                            variant="caption"
                            className={classes.username}
                            style={{
                                alignSelf: `${
                                    mine ? "flex-end" : "flex-start"
                                }`,
                            }}
                        >
                            {username}
                        </Typography>
                    )}
                    <Card
                        className={classes.messageCard}
                        sx={{ bgcolor: `${mine ? "lightpink" : ""}` }}
                    >
                        <Typography
                            variant="h6"
                            style={{ wordWrap: "break-word" }}
                        >
                            {content}
                        </Typography>
                    </Card>
                </div>
                {mine && (
                    <Avatar
                        sx={{
                            bgcolor: stringToColor(username),
                        }}
                        alt={username}
                    >
                        {getNameAbbreviation(username)}
                    </Avatar>
                )}
            </div>
        </div>
    );
}
