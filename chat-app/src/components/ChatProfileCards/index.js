import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Avatar,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Typography,
} from "@mui/material";

const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = "#";
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xff;
        colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
};

const getNameAbbreviation = (name) => {
    if (!name) {
        return "";
    } else {
        let splits = name.split(" ");
        if (splits.length === 1) {
            // only one word
            return splits[0][0];
        } else {
            // several words
            return `${splits[0][0]}${splits[1][0]}`;
        }
    }
};

const useStyles = makeStyles((theme) => ({}));

export default function ChatProfileCards(props) {
    const classes = useStyles();

    const chats = props.chats;
    const activeChat = props.activeChat;
    const setActiveChat = props.setActiveChat;

    return (
        <List disablePadding>
            {chats === undefined
                ? []
                : chats.map((chat, index) => (
                      <ListItem key={index} disablePadding divider>
                          <ListItemButton
                              style={{
                                  width: "100%",
                              }}
                              alignItems="flex-start"
                              onClick={() => setActiveChat(chat)}
                              selected={
                                  activeChat.id === chat.id &&
                                  activeChat.type === chat.type
                              }
                          >
                              <ListItemAvatar>
                                  <Avatar
                                      sx={{
                                          bgcolor: stringToColor(chat.name),
                                      }}
                                      alt={chat.name}
                                  >
                                      {getNameAbbreviation(chat.name)}
                                  </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                  disableTypography
                                  primary={
                                      <React.Fragment>
                                          <Typography variant="h5" noWrap>
                                              {chat.name}
                                          </Typography>
                                      </React.Fragment>
                                  }
                                  secondary={
                                      <React.Fragment>
                                          <Typography
                                              noWrap
                                              sx={{ color: "gray" }}
                                          >
                                              * Preview of the most recent
                                              message here *
                                          </Typography>
                                      </React.Fragment>
                                  }
                              />
                          </ListItemButton>
                      </ListItem>
                  ))}
        </List>
    );
}
