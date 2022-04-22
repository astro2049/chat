import React, { useEffect, useState } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core";
import InputBox from "./InputBox";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    outerContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderTop: "1px solid lightgray",
        borderBottom: "1px solid lightgray",
    },
    container: {
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
    const pageIsReady = props.pageIsReady;
    const [activeOption, setActiveOption] = useState("ADD_FRIEND");

    const createChatroomIsActive = activeOption === "CREATE_CHATROOM";
    const joinChatroomIsActive = activeOption === "JOIN_CHATROOM";
    const addNewFriendIsActive = activeOption === "ADD_FRIEND";

    function handleSwitchOption(value) {
        setActiveOption(value);
    }

    return (
        <div className={classes.outerContainer}>
            <div style={{ width: "95%" }}>
                <div className={classes.container}>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        className={classes.forBreadcrumb}
                    >
                        <Link
                            color={
                                createChatroomIsActive ? "secondary" : "inherit"
                            }
                            underline={
                                createChatroomIsActive ? "none" : "hover"
                            }
                            onClick={(e) =>
                                handleSwitchOption("CREATE_CHATROOM")
                            }
                        >
                            {t("chat.panels.createChatroom.name")}
                        </Link>
                        <Link
                            color={
                                joinChatroomIsActive ? "secondary" : "inherit"
                            }
                            underline={joinChatroomIsActive ? "none" : "hover"}
                            onClick={(e) => handleSwitchOption("JOIN_CHATROOM")}
                        >
                            {t("chat.panels.joinChatroom.name")}
                        </Link>
                        <Link
                            color={
                                addNewFriendIsActive ? "secondary" : "inherit"
                            }
                            underline={addNewFriendIsActive ? "none" : "hover"}
                            onClick={(e) => handleSwitchOption("ADD_FRIEND")}
                        >
                            {t("chat.panels.newFriend.name")}
                        </Link>
                    </Breadcrumbs>
                </div>

                <InputBox
                    activeOption={activeOption}
                    userId={props.userId}
                    setChatrooms={setChatrooms}
                    pageIsReady={pageIsReady}
                    pleaseRerender={props.pleaseRerender}
                />
            </div>
        </div>
    );
}
