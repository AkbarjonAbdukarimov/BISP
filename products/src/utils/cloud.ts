import path from "path";
import stream from "stream";
import { google } from "googleapis";
import { NotFoundError } from "@akbar0102/common";

//    <img src="https://drive.google.com/uc?export=view&id=1wqhC-_4nsBf-8AeXxEgXug4n_jupSIRT"/>
const getDriveService = (fileName: string) => {
  const KEYFILEPATH = path.join(__dirname, fileName);
  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  const driveService = google.drive({ version: "v3", auth });
  return driveService.files;
};

const uploadFile: (
  file: Express.Multer.File
) => Promise<{ name: String; id: String } | null> = async (file) => {
  const DriveService = getDriveService("ecom.json");
  const bufferStream = new stream.PassThrough();

  bufferStream.end(file.buffer);
  //@ts-ignore
  const { data } = await DriveService.create({
    //@ts-ignore
    resource: {
      name: file.originalname,
      parents: ["1YqJxSED3eJ074-dFYbPcYrz6tDckgijI"],
    },

    media: {
      //@ts-ignore
      mimeType: file.mimeType,
      //@ts-ignore
      body: bufferStream,
    },
    fields: "id,name",
  });
  return data;
};

const deleteFiles: (fileId: String) => Promise<void> = async (fileId) => {
  const DriveService = getDriveService("ecom.json");
  //@ts-ignore
  await DriveService.delete({ fileId });
};
export { uploadFile, deleteFiles };
