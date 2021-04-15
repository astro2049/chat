import React from "react";
import Typography from "@material-ui/core/Typography";
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
        paddingBottom: 20,
        borderTop: "1px solid black",
        borderBottom: "1px solid black",
    },
    container: {
        width: panelsWidth,
        height: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    forBreadcrumb: {},
}));

function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
}

export default function SimpleBreadcrumbs() {
    const classes = useStyles();

    return (
        <div className={classes.outerContainer}>
            <div className={classes.container}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    className={classes.forBreadcrumb}
                >
                    <Link color="inherit" href="/" onClick={handleClick}>
                        Create Chatroom
                    </Link>
                    <Link
                        color="inherit"
                        href="/getting-started/installation/"
                        onClick={handleClick}
                    >
                        Join Chatroom
                    </Link>
                    <Typography color="textPrimary">New Friend</Typography>
                </Breadcrumbs>
            </div>
            <InputBox></InputBox>
        </div>
    );
}
