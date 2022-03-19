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
    Chip,
    Skeleton,
} from "@mui/material";
import { useTranslation } from "react-i18next";

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

    // i18n
    const { t } = useTranslation();

    const chats = props.chats;
    const activeChat = props.activeChat;
    const setActiveChat = props.setActiveChat;
    const pageIsReady = props.pageIsReady;
    const skeletonsCount = props.skeletonsCount;

    const renderChatList = chats && pageIsReady;

    const skeletons = () => {
        let chatSkeletons = [];
        for (let i = 0; i < skeletonsCount; i++) {
            chatSkeletons.push(
                <ListItem sx={{ height: 86 }} key={i} disablePadding>
                    <ListItemButton
                        sx={{ height: "100%" }}
                        alignItems="space-between"
                    >
                        <div style={{ marginRight: 20 }}>
                            <Skeleton
                                sx={{
                                    marginLeft: 1,
                                    paddingLeft: "3px",
                                    paddingRight: "3px",
                                }}
                                variant="circular"
                                width={40}
                                height={40}
                            />
                        </div>
                        <ListItemText
                            disableTypography
                            primary={
                                <React.Fragment>
                                    <div>
                                        <Skeleton
                                            variant="text"
                                            width={130}
                                            height={46}
                                        />
                                    </div>
                                </React.Fragment>
                            }
                            secondary={
                                <React.Fragment>
                                    <div>
                                        <Skeleton
                                            variant="text"
                                            width={186}
                                            height={32}
                                        />
                                    </div>
                                </React.Fragment>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            );
        }
        return chatSkeletons;
    };

    return (
        <List disablePadding>
            {!renderChatList
                ? skeletons()
                : chats.map((chat, index) => (
                      <ListItem
                          sx={{ height: 82 }}
                          key={index}
                          disablePadding
                          divider
                      >
                          <ListItemButton
                              sx={{ height: "100%" }}
                              alignItems="space-between"
                              onClick={() => setActiveChat(chat)}
                              selected={
                                  activeChat &&
                                  activeChat.id === chat.id &&
                                  activeChat.type === chat.type
                              }
                          >
                              <ListItemAvatar
                                  sx={{
                                      marginLeft: 1,
                                      paddingLeft: "3px",
                                      paddingRight: "3px",
                                  }}
                              >
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
                                          <div
                                              style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                              }}
                                          >
                                              <Typography variant="h5" noWrap>
                                                  {chat.name}
                                              </Typography>
                                              <Chip
                                                  variant="outlined"
                                                  label={
                                                      chat.type === "private"
                                                          ? t(
                                                                "ChatProfileCards.chatRoomType.private"
                                                            )
                                                          : t(
                                                                "ChatProfileCards.chatRoomType.group"
                                                            )
                                                  }
                                                  color={
                                                      chat.type === "private"
                                                          ? "primary"
                                                          : "secondary"
                                                  }
                                                  sx={{ ml: 1 }}
                                                  size="small"
                                              />
                                          </div>
                                      </React.Fragment>
                                  }
                                  secondary={
                                      <React.Fragment>
                                          <div style={{ height: "30px" }}>
                                              {chat.messages.length > 0 ? (
                                                  <Typography
                                                      noWrap
                                                      sx={{
                                                          color: "gray",
                                                          lineHeight: "30px",
                                                      }}
                                                  >
                                                      {
                                                          chat.messages.at(
                                                              chat.messages
                                                                  .length - 1
                                                          ).content
                                                      }
                                                  </Typography>
                                              ) : (
                                                  <Typography
                                                      noWrap
                                                      sx={{
                                                          color: "gray",
                                                          fontStyle: "italic",
                                                      }}
                                                      variant="caption"
                                                  >
                                                      {t(
                                                          "ChatProfileCards.noMessages"
                                                      )}
                                                  </Typography>
                                              )}
                                          </div>
                                      </React.Fragment>
                                  }
                              />
                          </ListItemButton>
                      </ListItem>
                  ))}
        </List>
    );
}
