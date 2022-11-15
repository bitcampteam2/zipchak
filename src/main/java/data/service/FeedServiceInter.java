package data.service;

import data.dto.FeedDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FeedServiceInter {
    public void upload(MultipartFile file);
    public void insertFeed(FeedDto dto);
    public List<FeedDto> getAllFeeds(String search_col,String search_word,String order_col);
    public FeedDto getFeedByNum(int fd_num);
    public void deleteFeed(int fd_num);
    public void updateFeed(FeedDto dto);
}
