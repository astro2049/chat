package star.astro.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import star.astro.chat.exception.CustomException;
import star.astro.chat.model.mongodb.GroupChat;
import star.astro.chat.model.mongodb.link.GroupChatUserLink;
import star.astro.chat.repository.GroupChatRepository;
import star.astro.chat.repository.GroupChatUserLinkRepository;

@Service
public class ChatroomService {

    @Autowired
    private GroupChatRepository groupChatRepository;
    @Autowired
    private GroupChatUserLinkRepository groupChatUserLinkRepository;

    @Transactional(rollbackFor = Exception.class)
    public void createChatroom(String username, String chatroomName) {
        GroupChat groupChat = new GroupChat();
        groupChat.setName(chatroomName);
        groupChat = groupChatRepository.save(groupChat);
        String chatroomId = groupChat.getId();
        GroupChatUserLink groupChatUserLink = new GroupChatUserLink();
        groupChatUserLink.setChatroomId(chatroomId);
        groupChatUserLink.setUser(username);
        groupChatUserLinkRepository.save(groupChatUserLink);
    }

    @Transactional(rollbackFor = Exception.class)
    public void addUser(String username, String chatroomId) throws CustomException {
        GroupChatUserLink groupChatUserLink = groupChatUserLinkRepository.findByUsernameAndChatroomId(username, chatroomId);
        if (groupChatUserLink != null) {
            throw new CustomException("user already in this chat room");
        }
        groupChatUserLink = new GroupChatUserLink();
        groupChatUserLink.setChatroomId(chatroomId);
        groupChatUserLink.setUser(username);
        groupChatUserLinkRepository.save(groupChatUserLink);
    }

}
