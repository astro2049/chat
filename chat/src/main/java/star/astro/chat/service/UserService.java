package star.astro.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import star.astro.chat.exception.CustomException;
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
import star.astro.chat.util.BcryptUtil;
import star.astro.chat.util.JwtUtil;

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
    private JwtUtil jwtUtil;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private BcryptUtil bcryptUtil;

    @Transactional(rollbackFor = Exception.class)
    public void createUserByNickname(String name, String password) throws CustomException {
        if (userRepository.findUserByName(name) != null) {
            throw new CustomException("username already taken");
        } else {
            User user = new User(name, bcryptUtil.hashPassword(password));
            userRepository.save(user);
        }
    }

    public boolean login(String name, String password) {
        boolean granted = false;
        User user = userRepository.findUserByName(name);
        if (user != null) {
            if (bcryptUtil.checkPassword(password, user.getPassword())) {
                granted = true;
            }
        }
        return granted;
    }

    public String getToken(String name) {
        User user = userRepository.findUserByName(name);
        return jwtUtil.getToken(user);
    }

    @Transactional(rollbackFor = Exception.class)
    public void addFriend(String username, String friendName) throws CustomException {
        if (userRepository.findUserByName(friendName) == null) {
            throw new CustomException("target friend does not exist");
        }
        FriendLink friendLink = friendLinkRepository.findByHostAndGuest(username, friendName);
        if (friendLink != null) {
            throw new CustomException("already friends");
        }
        friendLink = new FriendLink();
        friendLink.setHostUsername(username);
        friendLink.setGuestUsername(friendName);
        friendLinkRepository.save(friendLink);
        notificationService.noticeUserOfNewChatroom(friendName);
    }

    @Transactional(rollbackFor = Exception.class)
    public void userOnline(String username) {
        User user = userRepository.findUserByName(username);
        user.setOnline();
        userRepository.save(user);
    }

    @Transactional(rollbackFor = Exception.class)
    public void userOffline(String username) {
        User user = userRepository.findUserByName(username);
        user.setOffline();
        userRepository.save(user);
    }

    public List<Chatroom> getUserChatrooms(String username) {
        List<Chatroom> chatrooms = new LinkedList<>();
        chatrooms.addAll(getPrivateChatrooms(username));
        chatrooms.addAll(getGroupChatrooms(username));
        return chatrooms;
    }

    public List<Chatroom> getPrivateChatrooms(String username) {
        List<Chatroom> chatrooms = new LinkedList<>();
        List<FriendLink> friendLinks = friendLinkRepository.findAllByName(username);
        for (FriendLink friendLink : friendLinks) {
            String hostUsername = friendLink.getHostUsername();
            String guestUsername = friendLink.getGuestUsername();
            String friendName;
            if (hostUsername.equals(username)) {
                friendName = guestUsername;
            } else {
                friendName = hostUsername;
            }
            String chatroomId = friendLink.getId();
            Chatroom chatroom = new Chatroom(chatroomId, friendName, ChatroomType.PRIVATECHAT.getValue());
            chatrooms.add(chatroom);
        }
        return chatrooms;
    }

    public List<Chatroom> getGroupChatrooms(String username) {
        List<Chatroom> chatrooms = new LinkedList<>();
        List<GroupChatUserLink> groupChatUserLinks = groupChatUserLinkRepository.findByUsername(username);
        for (GroupChatUserLink groupChatUserLink : groupChatUserLinks) {
            String chatroomId = groupChatUserLink.getChatroomId();
            GroupChat groupChat = groupChatRepository.findGroupChatById(chatroomId);
            String chatroomName = groupChat.getName();
            Chatroom chatroom = new Chatroom(chatroomId, chatroomName, ChatroomType.GROUPCHAT.getValue());
            chatrooms.add(chatroom);
        }
        return chatrooms;
    }

}
