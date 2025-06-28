const db = require("../models");
const Cdn = db.cdn;
const serverConfig = require("../config/server.config");
const logs = require("../services/log");
const fs = require("fs");
const path = require("path");
const config = require("../config/cdn.config");

const BASE_UPLOAD_DIR =
  config.cdnFolder || path.resolve(__dirname, "../images");

exports.uploadImg = async (req, res) => {
  try {
    if (req.file) {
      const imageUrl = `https://${serverConfig.host}/${req.params.folder}/${req.file.filename}`;
      const cdn = await Cdn.create({
        folder: req.params.folder,
        filename: req.file.filename,
        url: imageUrl,
        type: "img",
      });
      res.send({
        message: "Upload réussi",
        url: imageUrl,
        id: cdn.id,
        filename: req.file.filename,
      });
    } else {
      res.status(400).send({ message: "Aucune image fournie" });
    }
  } catch (e) {
    const message = `Impossible d'envoyer l'image. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "uploadImg");
    res.status(500).send({ message: message });
  }
};

exports.updateImg = async (req, res) => {
  try {
    if (req.file) {
      const imageUrl = `https://${serverConfig.host}/${req.params.folder}/${req.file.filename}`;
      await Cdn.update(
        {
          url: imageUrl,
          filename: req.file.filename,
        },
        {
          where: { filename: req.params.filename },
        }
      );

      res.status(200).send({ message: "Image remplacée avec succès" });
    } else {
      res.status(400).json({ error: "Aucun fichier reçu." });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const folder = req.params.folder;
    const filename = req.params.filename;
    const filePath = path.join(BASE_UPLOAD_DIR, folder, filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: "Fichier non trouvé." });
      }

      fs.unlink(filePath, async (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Erreur lors de la suppression." });
        }
        await Cdn.destroy({
          where: { filename: filename },
        });
        res.status(200).json({ message: "Image supprimée avec succès." });
      });
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

exports.getAll = async (page = 1, pageSize = 10, type) => {
  try {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await Cdn.findAndCountAll({
      limit: pageSize,
      offset: offset,
      ...(type && { where: { type: type } }),
    });
    return {
      totalItems: parseInt(count),
      totalPages: Math.ceil(parseInt(count) / parseInt(pageSize)),
      currentPage: parseInt(page),
      data: rows,
    };
  } catch (e) {
    const message = `Impossible d'envoyer l'image. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "uploadImg");
    throw message;
  }
};

exports.getAllApi = async (req, res) => {
  try {
    const { page, pageSize, type } = req.query;
    const cdn = await this.getAll(page, pageSize, type);
    res.status(200).send(cdn);
  } catch (e) {
    res.status(500).send({ message: e });
  }
};
