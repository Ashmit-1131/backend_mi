const express = require("express");
const postRouter = express.Router();
const jwt = require("jsonwebtoken");
const { PostModel } = require('../model/postModel');
const { postValidator } = require("../middleware/postValidator");
require('dotenv').config();

postRouter.get("/", async (req, res) => {
    try {
      const token = req.headers.authorization;
      const page = req.query.page || 0;
      const decoded = jwt.verify(token, process.env.key);
      const { userId: user } = decoded;
  
      const count = await PostModel.countDocuments({ user });
      const data = await PostModel.find({ user }).skip(page * 5).limit(5);
  
      res.send({
        message: "All cart data",
        status: 1,
        count: count,
        data: data,
        error: false,
      });
    } catch (error) {
      res.status(500).send({
        message: "Something went wrong: " + error.message,
        status: 0,
        error: true,
      });
    }
  });
  
  postRouter.get("/:pid", async (req, res) => {
    try {
      const token = req.headers.authorization;
      const { pid } = req.params;
      const decoded = jwt.verify(token, process.env.key);
      const { userId: user } = decoded;
  
      const data = await PostModel.find({ user, pid });
  
      if (data.length > 0) {
        res.send({
          message: "Item already in cart",
          status: 1,
          error: false,
        });
      } else {
        res.send({
          message: "Item not present in cart",
          status: 0,
          error: true,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: "Something went wrong: " + error.message,
        status: 0,
        error: true,
      });
    }
  });
  
  postRouter.patch("/:id", async (req, res) => {
    try {
      const { id: _id } = req.params;
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.key);
      const { userId: user } = decoded;
  
      await PostModel.updateOne({ _id, user }, req.body);
  
      res.send({
        message: "Item updated",
        status: 1,
        error: false,
      });
    } catch (error) {
      res.status(500).send({
        message: "Something went wrong: " + error.message,
        status: 0,
        error: true,
      });
    }
  });
  
  postRouter.delete("/:id", async (req, res) => {
    try {
      const { id: _id } = req.params;
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.key);
      const { userId: user } = decoded;
  
      await PostModel.deleteOne({ _id, user });
  
      res.send({
        message: "Item deleted",
        status: 1,
        error: false,
      });
    } catch (error) {
      res.status(500).send({
        message: "Something went wrong: " + error.message,
        status: 0,
        error: true,
      });
    }
  });
postRouter.use(postValidator);
postRouter.post("/add", async(req, res) => {

    try {
        //console.log(req.body)
        await PostModel.insertMany(req.body);
        res.send({
            message: "Item added in cart",
            status: 1,
            error: false,
        });
    } catch (error) {
        res.send({
            message: "Something went wrong: " + error.message,
            status: 0,
            error: true,
        });
    }
});

module.exports = {
    postRouter
}