import React, { useEffect, useState } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core";
import InputBox from "./InputBox";
import { useTranslation } from "react-i18next";

const panelsWidth = "95%";

const useStyles = makeStyles((theme) => ({
    outerContainer: {
        width: "26%",
        position: "fixed",
        bottom: 110,
        left: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderTop: "1px solid lightgray",
        borderRight: "1px solid lightgray",
        borderBottom: "1px solid lightgray",
        backgroundColor: "white",
    },
    container: {
        width: panelsWidth,
        height: 70,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderBottom: "1px solid lightgray",
    },
    forBreadcrumb: {},
}));

export default function SimpleBreadcrumbs(props) {
    const classes = useStyles();

    // i18n
    const { t } = useTranslation();

    const setChatrooms = props.setChatrooms;
    const [activeOption, setActiveOption] = useState("");

    const createChatroomIsActive = activeOption === "Create Chatroom";
    const joinChatroomIsActive = activeOption === "Join Chatroom";
    const addNewFriendIsActive = activeOption === "New Friend";

    useEffect(() => {
        setActiveOption("New Friend");
    }, []);

    function handleSwitchOption(value) {
        setActiveOption(value);
    }

    return (
        <div className={classes.outerContainer}>
            <div className={classes.container}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    className={classes.forBreadcrumb}
                >
                    <Link
                        color={createChatroomIsActive ? "secondary" : "inherit"}
                        underline={createChatroomIsActive ? "none" : "hover"}
                        onClick={(e) => handleSwitchOption("Create Chatroom")}
                    >
                        {t("chat.panels.createChatroom.name")}
                    </Link>
                    <Link
                        color={joinChatroomIsActive ? "secondary" : "inherit"}
                        underline={joinChatroomIsActive ? "none" : "hover"}
                        onClick={(e) => handleSwitchOption("Join Chatroom")}
                    >
                        {t("chat.panels.joinChatroom.name")}
                    </Link>
                    <Link
                        color={addNewFriendIsActive ? "secondary" : "inherit"}
                        underline={addNewFriendIsActive ? "none" : "hover"}
                        onClick={(e) => handleSwitchOption("New Friend")}
                    >
                        {t("chat.panels.newFriend.name")}
                    </Link>
                </Breadcrumbs>
            </div>
            <InputBox
                activeOption={activeOption}
                username={props.username}
                setChatrooms={setChatrooms}
            ></InputBox>
        </div>
    );
}
