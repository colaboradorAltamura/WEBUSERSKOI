/* eslint-disable no-console */

import axios from 'axios';

import { getHttpBearerConfig, listArgsToQueryString } from 'src/services/httpServices';
import { getUserWithToken } from 'src/@core/coreHelper';

import { API_URL_ATTACHMENTS } from 'src/configs/appConfig';

import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// uuid is a library for generating unique id
import { v4 as uuidv4 } from 'uuid';
import { IAttachment } from 'src/types/@autogenerated';

export const listAttachments = () => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      const qs = '';

      axios
        .get(`${API_URL_ATTACHMENTS}${qs}`, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }
          resolve(response.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const getAttachment = (id: string) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .get(`${API_URL_ATTACHMENTS}/${id}`, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }
          resolve(response.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const getStoredFileDownloadUrl = (refPath: string) => {
  return new Promise(function (resolve, reject) {
    const storage = getStorage();

    const storageRef = ref(storage, refPath);

    getDownloadURL(storageRef)
      .then((downloadURL) => {
        resolve(downloadURL);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const createAttachment = async ({
  attachment,
  isPublic,
}: {
  attachment: any;
  isPublic: boolean;
}): Promise<IAttachment> => {
  return new Promise((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const file = attachment;
      const extension = `.${file.name.split('.').pop()}`;

      const storage = getStorage();

      let isImage = false;
      if (extension === 'jpg' || extension === 'jpeg' || extension === 'gif' || extension === 'png') {
        isImage = true;
      }
      let refPath = '';

      if (isPublic) {
        if (isImage) {
          // images/imagesId/imageName
          refPath = `images/${uuidv4()}/${uuidv4() + extension}`;
        } else {
          refPath = `uploads/${uwt.user.uid}/public/${uuidv4() + extension}`;
        }
      } else {
        // const refPath = `uploads/${uwt.user.uid}/${collectionName}/${entityId}`;
        refPath = `uploads/${uwt.user.uid}/private/${uuidv4() + extension}`;
      }

      console.log(`Creating storage ${refPath}`);
      console.log('Creating file');
      const storageRef = ref(storage, refPath);

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          if (isPublic) {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                resolve({
                  downloadURL,
                  refPath,
                  path: file.path,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  extension,
                });
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            resolve({
              // downloadURL,
              refPath,
              path: file.path,
              name: file.name,
              size: file.size,
              type: file.type,
              extension,
            });
          }
        }
      );

      // 'file' comes from the Blob or File API
      // uploadBytes(storageRef, attachments[0])
      //   .then((snapshot) => {
      //     console.log('Uploaded a blob or file!');
      //     resolve();

      //   })
      //   .catch((e) => {
      //     reject(e);

      //   });
    });
  });

  // return new Promise(function (resolve, reject) {
  //   getUserWithToken().then((uwt) => {
  //     const config = getHttpBearerFormDataConfig(uwt.token);

  //     // config.withCredentials = true;

  //     // const form = {};
  //     const form = new FormData();

  //     form.append('files', attachments);
  //     form.append('id', entityId);
  //     form.append('collectionName', collectionName);

  //     axios
  //       .post(`${API_URL_ATTACHMENTS}`, form, config)
  //       .then((response) => {
  //         if (!response) {
  //           console.error('Invalid response');
  //           throw new Error('Invalid response');
  //         }
  //         resolve(response.data);
  //       })
  //       .catch((e) => {
  //         reject(e);
  //       });
  //   });
  // });
};

export const updateAttachment = (id: string, itemData: any) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .patch(`${API_URL_ATTACHMENTS}/${id}`, itemData, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }
          resolve(response.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};
