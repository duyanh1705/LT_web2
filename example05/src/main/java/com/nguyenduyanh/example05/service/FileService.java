package com.nguyenduyanh.example05.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.criteria.CriteriaBuilder.In;

public interface FileService {
    String uploadImage(String path, MultipartFile file) throws IOException;
    void deleteImage(String path, String fileName) throws IOException;
    InputStream getResource(String path, String fileName) throws FileNotFoundException;
}
