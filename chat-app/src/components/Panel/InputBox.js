import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Paper, TextField } from "@material-ui/core";
import axios from "axios";
import { useTranslation } from "react-i18next";
import global from "../../utils/globalVars";
import displaySnackbar from "../Snackbar";

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: 14,
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
}));

export default function CustomizedInputBase(props) {
    const classes = useStyles();

    // i18n
    const { t, i18n } = useTranslation();

    const userId = props.userId;
    const activeOption = props.activeOption;
    const setChatrooms = props.setChatrooms;
    const pageIsReady = props.pageIsReady;
    const pleaseRerender = props.pleaseRerender;
    const [inputPlaceholder, setInputPlaceholder] = useState("");
    const [options] = useState({
        CREATE_CHATROOM: {
            inputText: "",
        },
        JOIN_CHATROOM: {
            inputText: "",
        },
        ADD_FRIEND: {
            inputText: "",
        },
    });

    const buttonDisabled = () => {
        if (!pageIsReady) {
            return true;
        }
        let inputText = options[`${activeOption}`].inputText;
        switch (activeOption) {
            case "CREATE_CHATROOM":
                return !(inputText.length >= 1 && inputText.length <= 21);
            case "JOIN_CHATROOM":
                let chatRoomId = Number(inputText);
                return !(Number.isInteger(chatRoomId) && chatRoomId > 0);
            case "ADD_FRIEND":
                return !(inputText.length >= 1 && inputText.length <= 21);
            default:
                return;
        }
    };

    useEffect(() => {
        switch (activeOption) {
            case "CREATE_CHATROOM":
                setInputPlaceholder(t("chat.panels.createChatroom.promptText"));
                break;
            case "JOIN_CHATROOM":
                setInputPlaceholder(t("chat.panels.joinChatroom.promptText"));
                break;
            case "ADD_FRIEND":
                setInputPlaceholder(t("chat.panels.newFriend.promptText"));
                break;
            default:
                break;
        }
    }, [activeOption, i18n.language]);

    const onSubmit = (e) => {
        e.preventDefault();
        let inputText = options[`${activeOption}`].inputText;
        if (inputText.length === 0) {
            return;
        }

        let route;
        let method = "POST";
        let data = {};
        let successMessage;
        let code404Message = t("operations.404");
        let failureMessage = t("operations.failure");
        switch (activeOption) {
            case "ADD_FRIEND":
                route = "/users/" + userId + "/friends/" + inputText;
                successMessage = t("operations.addFriend.success");
                break;
            case "JOIN_CHATROOM":
                route = "/chatRooms/" + inputText + "/members";
                successMessage = t("operations.joinGroupChat.success");
                break;
            case "CREATE_CHATROOM":
                route = "/chatRooms";
                data["name"] = inputText;
                successMessage = t("operations.createGroupChat.success");
                break;
            default:
                break;
        }
        axios
            .request({
                url: global.PROFILE_SERVER_ADDRESS + route,
                method: method,
                data: data,
            })
            .then(() => {
                options[`${activeOption}`].inputText = "";
                displaySnackbar(successMessage, "success");
                setChatrooms();
            })
            .catch((e) => {
                if (e.response.status === 403) {
                    displaySnackbar(
                        t(`operations.addFriend.${e.response.data.message}`),
                        "warning"
                    );
                } else if (e.response.status === 404) {
                    displaySnackbar(code404Message, "warning");
                } else {
                    displaySnackbar(failureMessage, "warning");
                }
            });
    };

    return (
        <div className={classes.container}>
            <Paper
                component="form"
                style={{
                    padding: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                }}
                elevation={0}
                onSubmit={(e) => onSubmit(e)}
            >
                <TextField
                    className={classes.input}
                    placeholder={inputPlaceholder}
                    value={options[`${activeOption}`].inputText}
                    onChange={(e) => {
                        options[`${activeOption}`].inputText = e.target.value;
                        pleaseRerender();
                    }}
                    disabled={!pageIsReady}
                />
                <IconButton
                    type="submit"
                    style={{ padding: 10 }}
                    aria-label="search"
                    disabled={buttonDisabled()}
                >
                    <ArrowForwardIcon />
                </IconButton>
            </Paper>
        </div>
    );
}
