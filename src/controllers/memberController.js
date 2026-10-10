import { MemberModel } from "../models/memberModel.js";

export const MemberController = {
  async getAll(req, res) {
    try {
      res.json(await MemberModel.getAll());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      res.json(await MemberModel.getById(req.params.id));
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      res.status(201).json(await MemberModel.create(req.body));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      res.json(await MemberModel.update(req.params.id, req.body));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      res.json(await MemberModel.remove(req.params.id));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
