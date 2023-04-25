import path from "path";
import stream from "stream";
import { google } from "googleapis";
import fs from "node:fs/promises";
import { NotFoundError } from "@akbar0102/common";

//    <img src="https://drive.google.com/uc?export=view&id=1wqhC-_4nsBf-8AeXxEgXug4n_jupSIRT"/>
const getDriveService = async (fileName: string) => {
  await fs.writeFile(
    fileName,
    JSON.parse(`{
      type: "service_account",
      project_id: "ecommerce-376316",
      private_key_id: "459f47d1ac8ab22cae520fc4991d0d5b23df791b",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCUAIEuSH5FWsuX\nfkHEXZB0AKCNoEo4lLZkJGKVL7W0zqnCQNy3oM4A7HTgsVg0ycWN84vC4taccbtx\nbp2c20bERyTNPq8NKa2O2E++qpceFmb4WwJrmYCkSfbAZ5ySnj8RRR3lePn2CUn2\nhj/BLO79xzoWN103Gwuuj6oMKRr+ArWAP/m/hsfImBMEgmyN5ztOrqmumwtJfHlK\nTsJ0dJfS3YyxW7Se9z5kikt0w35F1OxXWrPJZSZrAygCnhQI3JCB5lNnAeze88Jl\nzyPnFh6as6OHEPAsSH00R7MFbP1w0hwHsB6/u1ODMt9sYGeb+hWOuiCGGyc1Mhhm\naiX14wmhAgMBAAECggEABibs0VcZsJmKlvYcY743HMTqtGUyUJ6V4+nDRn8TzYhw\n2m55yxERhX/oVKK3XB8uNnomMbURXxidkwrnEFGCsPJhuQpfANJ3sKIubNC7tJHe\nOK3UluzSW4HoX0avTBG55QAVGXUC5u0R68zYZf5Cw1fLT7sZ0j2UkCGdDu5Y43zg\nwENcsw9M7HNXO3Ve/WWQqq7Tq8zPLWuIR51WzfDTqkIdyPt6pxX7avAdjKjHQx08\nNK3ffnTTaEbmBek3mR5V1t2Mml74cP9awi389haiuYMjRVBtFPBnsMrgiR1CopKb\n8AkvNbDeJeaFCfTpmlMJjOolsfJ7edyDs/tBJWzsVQKBgQDIHt1BAWELU4+bltRi\n8G7+jAAfwKYuHwUwcywFJaJq6N00mp8RNJAEtb7634Dhandl5BPDVdh87xCkfacP\nWoP4DpwKr7XUcwvBA6TyAisojINVicTfjPfjLpHln5hhNAxkFQ6+yESFLXVdIRuk\nPr3PX6YN00JAmKVtRr77cU8EewKBgQC9VBGIa4bZVIM0ptCYm1TSkSZDneJkG5IF\nDbaTRp+nvzoO1lwRoULZJJXuHvlvLXNaZ23dfo1B6rGDT89tQn2bGa3VBkY2KE2E\nyDSJlQqcIOvDPlX4UwUQUK87I8SolRCV400nAyDRRRT7+zVknhw9xLraxq1268m8\nMusOL+I1kwKBgBny9pmhRiYj1bFFI5EYwCu9l56GaoX8e73GkWSxdpgKTfSuQAYJ\nHMufjX4WUS3pkkXiBzYDAalhjnTl3i29fPNDYbR5CEjeCh4jDNZctZ/yaG1FCgQ6\n0UHiHgT6ZtXj2992Y40Vht0GAfvreRwZDp+/NVcBl8usf3bl/4m3LZnVAoGBALUC\nKBUWQIGN5Dc1eV89urXqYfvpeeWd2lgMiU57Ce81y0seND4CwEecS9+yK2XYvV1k\nX0yRTnoD6R0S88yQ8keUIHb3Ha9vjtVxF5GmNdOZQe6TrVvR+5him3XeN4m5ona7\nLysqOXj6JBrZTG3bIEMJ0F+T7Yox2didkc8phosTAoGABuE4O/0lcR5Se6w4n0JE\nUHEVRF4KgHX/xq9lYTN0h/vf6WKOY06IK+JzvkwFaW+MeSobdiL1QbjUQSgW5HoE\na3h7axrYxhik3f2+rLuwWUx2aMSIwkEI1Ni+zbxs6ibBmjxVesDYRGqS4hPq2b1n\nW5JlFqXE06YXTHuN4PS5QvE=\n-----END PRIVATE KEY-----\n",
      client_email: "ecoomerceapp@ecommerce-376316.iam.gserviceaccount.com",
      client_id: "105260119016200056671",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/ecoomerceapp%40ecommerce-376316.iam.gserviceaccount.com",
    }`),
    (err) => {
      // error checking
      if (err) throw err;

      console.log("New data added");
    }
  );
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
