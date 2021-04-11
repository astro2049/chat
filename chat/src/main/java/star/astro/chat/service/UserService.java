package star.astro.chat.service;

import org.springframework.stereotype.Service;
import star.astro.chat.model.Chatroom;
import star.astro.chat.model.Friend;
import star.astro.chat.model.User;
import star.astro.chat.model.link.ChatroomUserLink;
import star.astro.chat.model.link.FriendLink;
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

    public List<Friend> getFriends(String username) {
        List<Friend> friends = new LinkedList<>();
        List<FriendLink> friendLinks = friendLinkRepository.findFriendLinkByUsername0(username);
        for (FriendLink friendLink: friendLinks) {
            String username1 = friendLink.getUsername1();
            User user = userRepository.findUserByName(username1);
            String chatroomId = friendLink.getId();
            Friend friend = new Friend(user, chatroomId);
            friends.add(friend);
        }
        return friends;
    }

    public List<Chatroom> getChatrooms(String username) {
        List<Chatroom> chatrooms = new LinkedList<>();
        List<ChatroomUserLink> chatroomUserLinks = chatroomUserLinkRepository.findChatroomUserLinkByUsername(username);
        for (ChatroomUserLink chatroomUserLink : chatroomUserLinks) {
            String chatroomId = chatroomUserLink.getId();
            Chatroom chatroom = chatroomRepository.findChatroomById(chatroomId);
            chatrooms.add(chatroom);
        }
        return chatrooms;
    }

}
