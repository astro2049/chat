import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Button, List, ListItem, TextField } from "@material-ui/core";
import SockJsClient from "react-stomp";

const appBarHeight = 80;
const drawerWidth = "25%";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        width: `calc(100% - ${drawerWidth})`,
        height: appBarHeight,
        marginLeft: drawerWidth,
    },
    chatroomName: {
        height: 80,
        display: "flex",
        alignItems: "center",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        border: "1px solid blue",
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    titleContainer: {
        height: 80,
        display: "flex",
        alignItems: "center",
    },
    title: {
        marginLeft: 40,
        fontSize: 40,
    },
    friendCard: {
        width: "100%",
        height: 120,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    userInfo: {
        zIndex: 1250,
        position: "fixed",
        bottom: 40,
        left: 40,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    containerOnRight: {
        height: "900px",
    },
    inputContainer: {
        zIndex: 1300,
        position: "fixed",
        bottom: 10,
        right: 0,
        width: `calc(100% - ${drawerWidth})`,
        height: 240,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderTop: "2px solid vanilla",
    },
    forTextField: {},
}));

export default function Chat(props) {
    const classes = useStyles();

    const username = props.user.name;
    const [rooms, setRooms] = useState([]);
    const [currentChatroom, setCurrentChatroom] = useState("");
    const [chatText, setChatText] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/user/room?username=" + username, {
            method: "GET",
        }).then((response) => {
            response.json().then((data) => {
                setRooms(data);
            });
        });
    }, [username]);

    const switchChatroom = (e) => {
        let friend = e.target.firstChild.data;
        console.log(friend);
    };

    const sendChatMessage = () => {};

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <div className={classes.chatroomName}>
                        <Typography variant="h4" noWrap>
                            {currentChatroom}
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar}>
                    <div className={classes.titleContainer}>
                        <div className={classes.title}>Chat!</div>
                    </div>
                </div>
                <Divider />

                <List>
                    {rooms.map((room) => (
                        <ListItem>
                            <Button
                                onClick={switchChatroom}
                                className={classes.friendCard}
                            >
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    align="center"
                                >
                                    {room.friend}
                                </Typography>
                            </Button>
                        </ListItem>
                    ))}
                </List>
                <div className={classes.userInfo}>
                    <Typography variant="h4">{username}</Typography>
                </div>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.containerOnRight}>
                    <div>
                        <Typography paragraph>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Rhoncus dolor purus non enim
                            praesent elementum facilisis leo vel. Risus at
                            ultrices mi tempus imperdiet. Semper risus in
                            hendrerit gravida rutrum quisque non tellus.
                            Convallis convallis tellus id interdum velit laoreet
                            id donec ultrices. Odio morbi quis commodo odio
                            aenean sed adipiscing. Amet nisl suscipit adipiscing
                            bibendum est ultricies integer quis. Cursus euismod
                            quis viverra nibh cras. Metus vulputate eu
                            scelerisque felis imperdiet proin fermentum leo.
                            Mauris commodo quis imperdiet massa tincidunt. Cras
                            tincidunt lobortis feugiat vivamus at augue. At
                            augue eget arcu dictum varius duis at consectetur
                            lorem. Velit sed ullamcorper morbi tincidunt. Lorem
                            donec massa sapien faucibus et molestie ac.
                        </Typography>
                        <Typography paragraph>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Rhoncus dolor purus non enim
                            praesent elementum facilisis leo vel. Risus at
                            ultrices mi tempus imperdiet. Semper risus in
                            hendrerit gravida rutrum quisque non tellus.
                            Convallis convallis tellus id interdum velit laoreet
                            id donec ultrices. Odio morbi quis commodo odio
                            aenean sed adipiscing. Amet nisl suscipit adipiscing
                            bibendum est ultricies integer quis. Cursus euismod
                            quis viverra nibh cras. Metus vulputate eu
                            scelerisque felis imperdiet proin fermentum leo.
                            Mauris commodo quis imperdiet massa tincidunt. Cras
                            tincidunt lobortis feugiat vivamus at augue. At
                            augue eget arcu dictum varius duis at consectetur
                            lorem. Velit sed ullamcorper morbi tincidunt. Lorem
                            donec massa sapien faucibus et molestie ac.
                        </Typography>
                    </div>
                </div>
            </main>
            <div className={classes.inputContainer}>
                <TextField
                    variant="outlined"
                    fullWidth="true"
                    multiline="true"
                    rows="8"
                    className={classes.forTextField}
                    onChange={(e) => setChatText(e.target.value)}
                ></TextField>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={sendChatMessage}
                >
                    Send
                </Button>
            </div>
        </div>
    );
}
