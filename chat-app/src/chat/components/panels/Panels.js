import React, { useState } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core";
import InputBox from "./InputBox";

const panelsWidth = "95%";

const useStyles = makeStyles((theme) => ({
    outerContainer: {
        width: "25%",
        position: "fixed",
        bottom: 110,
        left: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 28,
        borderTop: "1px solid black",
        borderBottom: "1px solid black",
    },
    container: {
        width: panelsWidth,
        height: 62,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    forBreadcrumb: {},
}));

export default function SimpleBreadcrumbs() {
    const classes = useStyles();

    const [activeOption, setActiveOption] = useState("");

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
                        color="inherit"
                        onClick={(e) => handleSwitchOption("Create Chatroom")}
                    >
                        Create Chatroom
                    </Link>
                    <Link
                        color="inherit"
                        onClick={(e) => handleSwitchOption("Join Chatroom")}
                    >
                        Join Chatroom
                    </Link>
                    <Link
                        color="inherit"
                        onClick={(e) => handleSwitchOption("New Friend")}
                    >
                        New Friend
                    </Link>
                </Breadcrumbs>
            </div>
            <InputBox activeOption={activeOption}></InputBox>
        </div>
    );
}
