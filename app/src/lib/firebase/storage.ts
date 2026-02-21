// ============================================
// FIREBASE STORAGE SERVICE
// ============================================

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  type UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './config';

// ============================================
// UPLOAD CONFIGURATION
// ============================================

export interface UploadOptions {
  path: string;
  file: File | Blob;
  metadata?: Record<string, string>;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size?: number;
  contentType: string | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// ============================================
// VALIDATION
// ============================================

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum size: 10MB' };
  }
  return { valid: true };
};

export const validateDocumentFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Allowed: PDF, DOC, DOCX' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum size: 10MB' };
  }
  return { valid: true };
};

// ============================================
// UPLOAD FUNCTIONS
// ============================================

export const uploadFile = async (options: UploadOptions): Promise<UploadResult> => {
  const { path, file, metadata, onProgress } = options;
  
  const storageRef = ref(storage, path);
  const uploadMetadata = metadata ? { customMetadata: metadata } : undefined;
  
  if (onProgress) {
    // Use resumable upload for progress tracking
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file, uploadMetadata);
      
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url,
            path: uploadTask.snapshot.ref.fullPath,
            name: uploadTask.snapshot.ref.name,
            size: uploadTask.snapshot.totalBytes,
            contentType: uploadTask.snapshot.metadata.contentType || null,
          });
        }
      );
    });
  } else {
    // Simple upload without progress tracking
    const snapshot = await uploadBytes(storageRef, file, uploadMetadata);
    const url = await getDownloadURL(snapshot.ref);
    
    return {
      url,
      path: snapshot.ref.fullPath,
      name: snapshot.ref.name,
      size: file.size,
      contentType: snapshot.metadata.contentType || null,
    };
  }
};

export const uploadProductImage = async (
  productId: string,
  file: File,
  index: number,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  const extension = file.name.split('.').pop() || 'jpg';
  const path = `products/${productId}/image_${index}.${extension}`;
  
  return uploadFile({
    path,
    file,
    metadata: { productId, type: 'product_image' },
    onProgress,
  });
};

export const uploadVendorLogo = async (
  vendorId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  const extension = file.name.split('.').pop() || 'jpg';
  const path = `vendors/${vendorId}/logo.${extension}`;
  
  return uploadFile({
    path,
    file,
    metadata: { vendorId, type: 'vendor_logo' },
    onProgress,
  });
};

export const uploadVendorBanner = async (
  vendorId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  const extension = file.name.split('.').pop() || 'jpg';
  const path = `vendors/${vendorId}/banner.${extension}`;
  
  return uploadFile({
    path,
    file,
    metadata: { vendorId, type: 'vendor_banner' },
    onProgress,
  });
};

export const uploadUserAvatar = async (
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  const extension = file.name.split('.').pop() || 'jpg';
  const path = `users/${userId}/avatar.${extension}`;
  
  return uploadFile({
    path,
    file,
    metadata: { userId, type: 'user_avatar' },
    onProgress,
  });
};

export const uploadVendorDocument = async (
  vendorId: string,
  file: File,
  documentType: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const validation = validateDocumentFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  const extension = file.name.split('.').pop() || 'pdf';
  const path = `vendors/${vendorId}/documents/${documentType}.${extension}`;
  
  return uploadFile({
    path,
    file,
    metadata: { vendorId, type: 'vendor_document', documentType },
    onProgress,
  });
};

// ============================================
// DOWNLOAD & URL FUNCTIONS
// ============================================

export const getFileUrl = async (path: string): Promise<string> => {
  const fileRef = ref(storage, path);
  return getDownloadURL(fileRef);
};

// ============================================
// DELETE FUNCTIONS
// ============================================

export const deleteFile = async (path: string): Promise<void> => {
  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
};

export const deleteProductImages = async (productId: string): Promise<void> => {
  const productRef = ref(storage, `products/${productId}`);
  const listResult = await listAll(productRef);
  
  const deletePromises = listResult.items.map((item) => deleteObject(item));
  await Promise.all(deletePromises);
};

export const deleteVendorFiles = async (vendorId: string): Promise<void> => {
  const vendorRef = ref(storage, `vendors/${vendorId}`);
  const listResult = await listAll(vendorRef);
  
  // Delete all files in the vendor folder
  const deletePromises = listResult.items.map((item) => deleteObject(item));
  await Promise.all(deletePromises);
  
  // Recursively delete subdirectories
  const subdirPromises = listResult.prefixes.map(async (prefix) => {
    const subList = await listAll(prefix);
    const subDeletePromises = subList.items.map((item) => deleteObject(item));
    await Promise.all(subDeletePromises);
  });
  await Promise.all(subdirPromises);
};

// ============================================
// BATCH UPLOAD
// ============================================

export const uploadMultipleFiles = async (
  files: { path: string; file: File | Blob; metadata?: Record<string, string> }[]
): Promise<UploadResult[]> => {
  const uploadPromises = files.map(({ path, file, metadata }) =>
    uploadFile({ path, file, metadata })
  );
  
  return Promise.all(uploadPromises);
};

export const uploadProductImages = async (
  productId: string,
  files: File[],
  onProgress?: (index: number, progress: number) => void
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file, index) =>
    uploadProductImage(productId, file, index, (progress) => {
      onProgress?.(index, progress);
    })
  );
  
  return Promise.all(uploadPromises);
};
