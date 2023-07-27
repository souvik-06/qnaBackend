import multer, { memoryStorage } from "multer";

export const storage = memoryStorage();
export const upload = multer({ storage: storage }).array("images");
