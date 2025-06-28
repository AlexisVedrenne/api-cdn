const db = require("../models");
const Cdn = db.cdn;
const serverConfig = require("../config/server.config");
const logs = require("../services/log");


exports.uploadImg = async (req,res)=>{
  try{
    if(req.file){
      const imageUrl = `https://${serverConfig.host}/${req.params.folder}/${req.file.filename}`
      const cdn = await Cdn.create({
        folder: req.params.folder,
        filename: req.file.filename,
        url: imageUrl
      })
      res.send({ message: 'Upload réussi', url: imageUrl, id: cdn.id })
    }else{
      res.status(400).send({ message: 'Aucune image fournie' })
    }
  }catch(e){
    const message = `Impossible d'envoyer l'image. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "uploadImg");
    res.status(500).send({ message: message });
  }
}