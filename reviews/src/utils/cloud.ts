import ImageKit from "imagekit";
import { Multer } from "multer";
var imagekit = new ImageKit({
  publicKey: "public_2l80tUnD99sZdu//s8IpOj8f1tQ=",
  privateKey: "private_i9fi/GfZoQAtR65kGTVynH+vU5c=",
  urlEndpoint: "https://ik.imagekit.io/epvjvvihm",
});
const uploadFile = async (
  file: Express.Multer.File
): Promise<{ name: string; fileId: string }> => {
  try {
    const res = await imagekit.upload({
      file: file.buffer.toString("base64"), //required
      fileName: file.originalname, //required
      useUniqueFileName: true,
      extensions: [
        {
          name: "google-auto-tagging",
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const uploadedFile = (file: Express.Multer.File) => {
  imagekit.upload(
    {
      file: file.buffer.toString("base64"), //required
      fileName: file.originalname, //required
      useUniqueFileName: true,
      extensions: [
        {
          name: "google-auto-tagging",
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    },
    function (error, result) {
      if (error) console.log(error);
      else {
        console.log(result);
        return result;
      }
    }
  );
};
const deletefiles = async (file: { name: string; fileId: string }) => {
  await imagekit.deleteFile(file.fileId);
};

export { uploadFile, deletefiles };
