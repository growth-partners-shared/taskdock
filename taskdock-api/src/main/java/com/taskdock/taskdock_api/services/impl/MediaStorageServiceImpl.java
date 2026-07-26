package com.taskdock.taskdock_api.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.taskdock.taskdock_api.dtos.media.MediaUploadResponse;
import com.taskdock.taskdock_api.services.MediaStorageService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class MediaStorageServiceImpl implements MediaStorageService {

  private final Cloudinary cloudinary;

  @Override
  public MediaUploadResponse upload(MultipartFile file, String folderName) {
    try {
      if (file == null || file.isEmpty()) {
        throw new RuntimeException("File is empty");
      }

      if (!file.getContentType().startsWith("image")) {
        throw new RuntimeException("Only image files are allowed");
      }

      Map uploadResult =
          cloudinary
              .uploader()
              .upload(
                  file.getBytes(),
                  ObjectUtils.asMap("folder", folderName, "resource_type", "image"));

      String imageUrl = uploadResult.get("secure_url").toString();
      String publicId = uploadResult.get("public_id").toString();

      return new MediaUploadResponse(imageUrl, publicId);
    } catch (Exception e) {
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image to Cloudinary");
    }
  }

  @Override
  public void delete(String publicId) {
    try {
      Map result =
          cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
      String deletionResult = result.get("result").toString();

      if (!"ok".equals(deletionResult) && !"not found".equals(deletionResult)) {
        throw new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete old image from Cloudinary");
      }

    } catch (ResponseStatusException e) {
      throw e;
    } catch (Exception e) {
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Unexpected Error, Failed to delete image from Cloudinary");
    }
  }
}
