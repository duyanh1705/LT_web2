package com.nguyenduyanh.example05.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nguyenduyanh.example05.service.FileService;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public String uploadImage(String path, MultipartFile file) throws IOException {

        String originalFileName = file.getOriginalFilename();

        String fileName = UUID.randomUUID().toString()
                + originalFileName.substring(originalFileName.lastIndexOf('.'));

        String filePath = path + File.separator + fileName;

        File folder = new File(path);
        if (!folder.exists()) {
            folder.mkdirs(); // ✅ mkdirs cho chắc
        }

        Files.copy(file.getInputStream(), Paths.get(filePath));

        return fileName;
    }

    @Override
    public InputStream getResource(String path, String fileName) throws FileNotFoundException {
        String filePath = path + File.separator + fileName;
        return new FileInputStream(filePath);
    }

    // 🔥 THÊM HÀM XOÁ ẢNH
    @Override
    public void deleteImage(String path, String fileName) throws IOException {
        String filePath = path + File.separator + fileName;
        File file = new File(filePath);
        if (file.exists()) {
            file.delete();
        }
    }
}
