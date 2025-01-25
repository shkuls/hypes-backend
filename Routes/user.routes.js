import express from "express";
import multer from "multer";
import path from "path"
import User from "../Models/user.model.js";
import { protectRoute } from "../Middleware/protectRoute.js";
import { ReportHandler  , getReports , getHistory} from "../Controllers/user.controllers.js";
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./utils/tempReportUploads"); // Folder where PDFs will be saved
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // Get the file extension
      cb(null, `${file.fieldname}-${Date.now()}${ext}`); // Custom filename
    }
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      // Ensure only PDFs are accepted
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only PDF files are allowed!"), false);
      }
    }
});

router.post("/uploadReport",protectRoute, upload.single("report")  ,  ReportHandler)
router.get("/count" , protectRoute , async (req , res)=>{
  const user  = await User.findbyId(req.user._id)
  res.send(user.reports.length);

})
router.post("getAllReports" , protectRoute ,  getReports)
router.get("/getHistory/:name" , protectRoute ,  getHistory)
export default router