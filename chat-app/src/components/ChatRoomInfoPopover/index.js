import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import {
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    Popover,
    Typography,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    chatRoomInfo: {
        width: 183,
        paddingTop: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingBottom: "2px",
    },
    chatRoomInfoTitle: {
        paddingRight: "20px",
        borderBottom: "2px solid black",
    },
}));

export default function ChatRoomInfoPopOver(props) {
    const classes = useStyles();

    // i18n
    const { t, i18n } = useTranslation();

    const activeChat = props.activeChat;

    const anchorEl = props.anchorEl;
    const handleClose = props.handleClose;
    const open = Boolean(anchorEl);

    const typeText = {
        en: {
            private: "Friend",
            group: "Group Chat",
        },
        "zh-CN": {
            private: "好友",
            group: "聊天组",
        },
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "center",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "left",
            }}
        >
            <div className={classes.chatRoomInfo}>
                <Typography variant="h6" className={classes.chatRoomInfoTitle}>
                    {t("chat.chatRoomInfo.title")}
                </Typography>
                <List disablePadding>
                    <ListItem disableGutters>
                        <Grid container>
                            <Grid
                                item
                                xs={6}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Typography variant="subtitle1">
                                    {t("chat.chatRoomInfo.type")}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Chip
                                    variant="outlined"
                                    label={
                                        typeText[`${i18n.language}`][
                                            `${activeChat.type}`
                                        ]
                                    }
                                    color={
                                        activeChat.type === "private"
                                            ? "primary"
                                            : "secondary"
                                    }
                                />
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    <ListItem disableGutters>
                        <Grid container>
                            <Grid
                                item
                                xs={6}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Typography variant="subtitle1">ID</Typography>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Typography variant="h6">
                                    {activeChat.id}
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
            </div>
        </Popover>
    );
}
