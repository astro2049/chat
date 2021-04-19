package star.astro.chat.service;

import org.springframework.stereotype.Service;
import star.astro.chat.model.mongodb.GroupChat;
import star.astro.chat.model.mongodb.User;
import star.astro.chat.model.mongodb.link.FriendLink;
import star.astro.chat.model.mongodb.link.GroupChatUserLink;
import star.astro.chat.model.wrapper.Chatroom;
import star.astro.chat.repository.ChatroomRepository;
import star.astro.chat.repository.ChatroomUserLinkRepository;
import star.astro.chat.repository.FriendLinkRepository;
import star.astro.chat.repository.UserRepository;

import java.util.LinkedList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final ChatroomRepository chatroomRepository;

    private final FriendLinkRepository friendLinkRepository;

    private final ChatroomUserLinkRepository chatroomUserLinkRepository;

    public UserService(UserRepository userRepository, ChatroomRepository chatroomRepository, FriendLinkRepository friendLinkRepository, ChatroomUserLinkRepository chatroomUserLinkRepository) {
        this.userRepository = userRepository;
        this.chatroomRepository = chatroomRepository;
        this.friendLinkRepository = friendLinkRepository;
        this.chatroomUserLinkRepository = chatroomUserLinkRepository;
    }

    public boolean createUserByName(String name, String password) {
        if (userRepository.findUserByName(name) != null) {
            return false;
        } else {
            User user = new User(name, password);
            userRepository.save(user);
            return true;
        }
    }

    public User retrieveUserByName(String name) {
        return userRepository.findUserByName(name);
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
            Chatroom chatroom = new Chatroom(chatroomId, user.getName());
            chatrooms.add(chatroom);
        }

        //get friends as user1
        friendLinks = friendLinkRepository.findFriendLinkByUsername1(username);
        for (FriendLink friendLink : friendLinks) {
            String username0 = friendLink.getUsername0();
            User user = userRepository.findUserByName(username0);
            String chatroomId = friendLink.getId();
            Chatroom chatroom = new Chatroom(chatroomId, user.getName());
            chatrooms.add(chatroom);
        }

        return chatrooms;
    }

    public List<GroupChat> getGroupChatrooms(String username) {
        List<GroupChat> groupChats = new LinkedList<>();
        List<GroupChatUserLink> groupChatUserLinks = chatroomUserLinkRepository.findChatroomUserLinkByUsername(username);
        for (GroupChatUserLink groupChatUserLink : groupChatUserLinks) {
            String chatroomId = groupChatUserLink.getId();
            GroupChat groupChat = chatroomRepository.findChatroomById(chatroomId);
            groupChats.add(groupChat);
        }
        return groupChats;
    }

    public boolean createChatroom(String username, String chatroomName) {
        GroupChat groupChat = new GroupChat();
        groupChat.setName(chatroomName);
        groupChat = chatroomRepository.save(groupChat);
        String chatroomId = groupChat.getId();
        GroupChatUserLink groupChatUserLink = new GroupChatUserLink();
        groupChatUserLink.setChatroom(chatroomId);
        groupChatUserLink.setUser(username);
        chatroomUserLinkRepository.save(groupChatUserLink);
        return true;
    }

    public boolean joinChatroom(String username, String chatroomId) {
        GroupChatUserLink groupChatUserLink = new GroupChatUserLink();
        groupChatUserLink.setChatroom(chatroomId);
        groupChatUserLink.setUser(username);
        chatroomUserLinkRepository.save(groupChatUserLink);
        return true;
    }

}
