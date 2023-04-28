import { Multer } from "multer";
declare const uploadFile: (file: Express.Multer.File) => Promise<{
    name: string;
    fileId: string;
}>;
declare const deletefiles: (file: {
    name: string;
    fileId: string;
}) => Promise<void>;
export { uploadFile, deletefiles };
