const fs = require('fs');
const mkdirp = require('mkdirp-promise');
const appRoot = require('app-root-path');
const logger = require('../classes/logger.class');
const path = require('path');
const folderUploadName = 'uploads';
const base64 = require('is-base64');

const readFileAsString = (path) => {
  try {
    return fs.readFileSync(path, { encoding: 'utf8' });
  } catch (e) {
    logger.error(e, { 'function': 'fileHelper.readFileAsString' });
  }
  return '';
};

// const saveTmpBase64File = (tmpFilePath = '', base64Uri = '') => {
//   const base64data = base64Uri.split(';base64,').pop();
//   return new Promise((resolve, reject) => {
//     try {
//       fs.writeFile(tmpFilePath, base64data, 'base64', (err) => {
//         if (err) {
//           console.log('saveTmpBase64File.writeFile.error:', err);
//           resolve(null);
//         }
//         resolve(tmpFilePath);
//       });
//     } catch (error) {
//       console.log('saveTmpBase64File.error:', error);
//       resolve(null);
//     }
//   });
// };

// const uploadAvatar = async (uid, extention, base64) => {
//   try {
//     const fileName = `${ uuid() }.${ extention }`.toLowerCase();
//     const filePath = path.normalize(path.format({ dir: `profile/${uid}`, base: fileName }));
//     const tmpFilePath = path.join(os.tmpdir(), filePath);
//     const tempLocalDir = path.dirname(tmpFilePath);
//
//     // create localDir to save image
//     await mkdirp(tempLocalDir);
//
//     // save tmp file to localDir
//     const localFilePath = await saveTmpBase64File(tmpFilePath, base64);
//
//     return localFilePath;
//   } catch (error) {
//     console.log('error: ', error);
//   }
//   console.log('Failed to upload file');
//   return null;
// };

const saveTmpBase64File = (pathFile, base64) => {
  try {
    const base64data = base64.split(';base64,').pop();
    fs.writeFileSync(pathFile, base64data, { encoding: 'base64' });

    return pathFile;
  } catch (e) {
    return null;
  }
};

const getPathStorage = () => {
  return 'D:\\TrungNC6\\Quick-Solution-Team-main\\Program\\Admin\\Portal\\public';
};

const getPathUpload = () => {
  return getPathStorage() + `/${folderUploadName}`;
};

/**
 * Save base64 to file
 *
 * @param folderPath
 * @param base64
 * @param fileName
 * @returns {Promise<*>}
 */
const saveBase64 = async (folderPath, base64, fileName) => {
  try {
    let pathFolder = getPathUpload() + `/${folderPath}`;
    console.log(pathFolder);
    pathFolder = path.normalize(pathFolder);

    // Check folder exists
    if (!fs.existsSync(pathFolder)) {
      await mkdirp(pathFolder);
    }

    let pathFile = `${pathFolder}/${fileName}`;
    pathFile = path.normalize(pathFile);

    // save file
    saveTmpBase64File(pathFile, base64);

    return path.normalize(`/${folderUploadName}/${folderPath}/${fileName}`);
  } catch (e) {
    logger.error(e, { 'function': 'fileHelper.saveBase64' });

    return null;
  }
};

const getExtensionFromBase64 = (base64,extentions) => {
  if(!extentions || extentions.length === 0)
    extentions = ['.jpeg', '.jpg', '.png', '.gif', '.xls', '.xlsx', '.ods', '.mp3', '.mp4', '.doc', '.docx', '.odt', '.pdf', '.txt', '.ppt', '.pptx'];
  const extention = base64.substring(base64.indexOf('/') + 1, base64.indexOf(';base64'));
  if(extentions.includes('.' + extention))
    return extention;
  return null;
};

function isBase64(strBase64) {
  return base64(strBase64, {allowEmpty: false, allowMime: true});
}

const getExtensionFromFileName = (fileName,extentions) =>{
  if(!extentions || extentions.length === 0)
    extentions = ['.jpeg', '.jpg', '.png', '.gif', '.xls', '.xlsx', '.ods', '.mp3', '.mp4', '.doc', '.docx', '.odt', '.pdf', '.txt', '.ppt', '.pptx'];
  var arrName = fileName.split('.');
  const extention = arrName.length >1 ? arrName[arrName.length -1]:'';
  if(extentions.includes('.' + extention))
    return extention;
  return null;
};

module.exports = {
  readFileAsString,
  saveBase64,
  getExtensionFromBase64,
  isBase64,
  getExtensionFromFileName,
};
