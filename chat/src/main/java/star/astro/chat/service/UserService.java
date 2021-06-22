package star.astro.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import star.astro.chat.model.mongodb.GroupChat;
import star.astro.chat.model.mongodb.User;
import star.astro.chat.model.mongodb.link.FriendLink;
import star.astro.chat.model.mongodb.link.GroupChatUserLink;
import star.astro.chat.model.wrapper.Chatroom;
import star.astro.chat.model.wrapper.ChatroomType;
import star.astro.chat.repository.FriendLinkRepository;
import star.astro.chat.repository.GroupChatRepository;
import star.astro.chat.repository.GroupChatUserLinkRepository;
import star.astro.chat.repository.UserRepository;
import star.astro.chat.util.JwtTokenUtil;

import java.util.LinkedList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GroupChatRepository groupChatRepository;
    @Autowired
    private FriendLinkRepository friendLinkRepository;
    @Autowired
    private GroupChatUserLinkRepository groupChatUserLinkRepository;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public boolean createUserByName(String name, String password) {
        if (userRepository.findUserByName(name) != null) {
            return false;
        } else {
            User user = new User(name, password);
            userRepository.save(user);
            return true;
        }
    }

    public boolean login(String name, String password) {
        boolean granted = false;
        User user = userRepository.findUserByName(name);
        if (user != null) {
            if (password.equals(user.getPassword())) {
                granted = true;
            }
        }
        return granted;
    }

    public String getToken(String name) {
        User user = userRepository.findUserByName(name);
        return jwtTokenUtil.getToken(user);
    }

    public boolean addFriend(String username, String friendName) {
        if (userRepository.findUserByName(friendName) == null) {
            return false;
        }
        FriendLink friendLink = new FriendLink();
        friendLink.setUsername0(username);
        friendLink.setUsername1(friendName);
        friendLinkRepository.save(friendLink);
        return true;
    }

    public void userOnline(String username) {
        User user = userRepository.findUserByName(username);
        user.setOnline();
        userRepository.save(user);
    }

    public void userOffline(String username) {
        User user = userRepository.findUserByName(username);
        user.setOffline();
        userRepository.save(user);
    }

    public List<Chatroom> getPrivateChatrooms(String username) {
        List<Chatroom> chatrooms = new LinkedList<>();

        //get friends as user0
        List<FriendLink> friendLinks = friendLinkRepository.findFriendLinkByUsername0(username);
        for (FriendLink friendLink : friendLinks) {
            String username1 = friendLink.getUsername1();
            User user = userRepository.findUserByName(username1);
            String chatroomId = friendLink.getId();
            Chatroom chatroom = new Chatroom(chatroomId, user.getName(), ChatroomType.PRIVATECHAT.getValue());
            chatrooms.add(chatroom);
        }

        //get friends as user1
        friendLinks = friendLinkRepository.findFriendLinkByUsername1(username);
        for (FriendLink friendLink : friendLinks) {
            String username0 = friendLink.getUsername0();
            User user = userRepository.findUserByName(username0);
            String chatroomId = friendLink.getId();
            Chatroom chatroom = new Chatroom(chatroomId, user.getName(), ChatroomType.PRIVATECHAT.getValue());
            chatrooms.add(chatroom);
        }

        return chatrooms;
    }

    public List<Chatroom> getGroupChatrooms(String username) {
        List<Chatroom> chatrooms = new LinkedList<>();
        List<GroupChatUserLink> groupChatUserLinks = groupChatUserLinkRepository.findGroupChatUserLinkByUsername(username);
        for (GroupChatUserLink groupChatUserLink : groupChatUserLinks) {
            String chatroomId = groupChatUserLink.getChatroomId();
            GroupChat groupChat = groupChatRepository.findGroupChatById(chatroomId);
            String chatroomName = groupChat.getName();
            Chatroom chatroom = new Chatroom(chatroomId, chatroomName, ChatroomType.GROUPCHAT.getValue());
            chatrooms.add(chatroom);
        }
        return chatrooms;
    }

    public boolean createChatroom(String username, String chatroomName) {
        GroupChat groupChat = new GroupChat();
        groupChat.setName(chatroomName);
        groupChat = groupChatRepository.save(groupChat);
        String chatroomId = groupChat.getId();
        GroupChatUserLink groupChatUserLink = new GroupChatUserLink();
        groupChatUserLink.setChatroomId(chatroomId);
        groupChatUserLink.setUser(username);
        groupChatUserLinkRepository.save(groupChatUserLink);
        return true;
    }

    public boolean joinChatroom(String username, String chatroomId) {
        GroupChatUserLink groupChatUserLink = new GroupChatUserLink();
        groupChatUserLink.setChatroomId(chatroomId);
        groupChatUserLink.setUser(username);
        groupChatUserLinkRepository.save(groupChatUserLink);
        return true;
    }

    public List<Chatroom> getUserChatrooms(String username) {
        List<Chatroom> chatrooms = new LinkedList<>();
        chatrooms.addAll(getPrivateChatrooms(username));
        chatrooms.addAll(getGroupChatrooms(username));
        return chatrooms;
    }

}
