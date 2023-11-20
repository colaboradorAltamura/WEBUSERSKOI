import { createAttachment } from 'src/services/attachmentsServices';

async function dropZoneFormValuesHandler({ itemValues, form }) {
  const dropZoneValues = [];

  const keys = Object.keys(itemValues);
  keys.forEach((key) => {
    if (
      itemValues[key] &&
      form.formFields[key] &&
      (form.formFields[key].fieldType === 'dropzone' || form.formFields[key].fieldType === 'dropzone-single-image')
    ) {
      dropZoneValues.push({ key, files: itemValues[key].attachments, field: form.formFields[key] });
    }
  });

  const dropZonePromises = [];

  if (dropZoneValues)
    dropZoneValues.forEach((val) => {
      if (val && val.files)
        val.files.forEach((file) => {
          dropZonePromises.push(
            new Promise((resolve, reject) => {
              // console.log('To save dropzone: ', dropZoneValues);
              createAttachment({
                attachment: file,
                isPublic: val.field && val.field.fieldExtensions && val.field.fieldExtensions.isPublic,
              })
                .then((storedFile) => {
                  resolve({ key: val.key, storedFile });
                })
                .catch((e) => {
                  reject(e);
                });
            })
          );
        });
    });

  const newValues = { ...itemValues };

  if (dropZonePromises || dropZonePromises.length) {
    const storedFilesWithKey = await Promise.all(dropZonePromises);

    const filesGroupedByKey = {};

    storedFilesWithKey.forEach((storedFileWithKey) => {
      if (filesGroupedByKey[storedFileWithKey.key]) {
        filesGroupedByKey[storedFileWithKey.key].push(storedFileWithKey.storedFile);
      } else {
        filesGroupedByKey[storedFileWithKey.key] = [storedFileWithKey.storedFile];
      }
    });

    const kk = Object.keys(filesGroupedByKey);

    kk.forEach((key) => {
      // persisto los objetos stored, joined con los nuevos attachments
      const currentValues = newValues[key] && newValues[key].stored ? newValues[key].stored : [];

      // updateValues[key] = currentValues.concat(filesGroupedByKey[key]);

      // para que se actualice la actual tabla
      itemValues[key].stored = currentValues.concat(filesGroupedByKey[key]);

      // para que si vuelve a submitir, en el edit form, no vuelva a mandar los attachments
      itemValues[key].attachments = [];
    });
  }

  const newKeys = Object.keys(newValues);
  newKeys.forEach((key) => {
    if (
      newValues[key] &&
      form.formFields[key] &&
      (form.formFields[key].fieldType === 'dropzone' || form.formFields[key].fieldType === 'dropzone-single-image')
    ) {
      if (newValues[key].stored) newValues[key] = newValues[key].stored;
    }
  });

  return newValues;
}

export default dropZoneFormValuesHandler;
