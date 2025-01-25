import fs from "fs";
import axios from "axios";
import Report from "../Models/report.model.js";
import FormData from "form-data";
import User from "../Models/user.model.js";
export const getReports =async (req , res) =>{
    try {
        //get omoongo code 
        //get all reports 
        //show first 7 tests
        //return to users



        //make a function for sorting categories 
    } catch (error) {
        
    }
}

export const ReportHandler  = async(req,res)=>{
    try {

        const user = await User.findById(req.user._id)
        console.log(user)
        const filePath = req.file?.path;
        const fileStream =await fs.createReadStream(filePath)
        let reportData = new FormData();
        reportData.append('file', fileStream);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://main.d3mrc6r70azp2w.amplifyapp.com/pdf',
            headers: { 
              ...reportData.getHeaders()
            },
            data : reportData
          };
          
            const response = await axios.request(config)
            const report = response.data;
            report.user = req.user._id;
            const newReport = new Report(report)
            user.reports.push(newReport._id)
            await newReport.save()
            await user.save()
            fs.unlinkSync(filePath)
            res.status(200).send(response.data)


    } catch (error) {
        console.log(error)
        res.status(500).send({error : "Error at Report Handler"})
    }
}

export const getHistory = async(req,res)=>{
    try {
        const name = req.params.name
        const reports = await Report.find({name : name})
        res.status(200).send(reports)
    } catch (error) {
        res.status(500).send({error : "Error at getHistory"})
    }
}