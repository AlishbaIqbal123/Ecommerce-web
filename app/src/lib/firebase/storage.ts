import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './config';
import { FORCE_MOCK_DATA } from './firestore';

/**
 * Upload an image to Firebase Storage
 * @param file The file object from input change event
 * @param path The storage path (e.g., 'products/{productId}')
 * @returns A promise that resolves to the download URL
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  if (!file) throw new Error('No file provided');
  
  if (FORCE_MOCK_DATA) {
    // Return a local blob URL for the demo
    return URL.createObjectURL(file);
  }
  const imageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(imageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress can be handled in UI if needed
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error('Upload failed:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

/**
 * Delete an image from Firebase Storage
 * @param path The full path or URL of the image
 */
export const deleteImage = async (path: string): Promise<void> => {
  // Implementation for deletion if needed
};
