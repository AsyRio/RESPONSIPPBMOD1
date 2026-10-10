import { LoanModel } from "../models/loanModel.js";

const VALID_STATUS = ["Dipinjam", "Dikembalikan", "Terlambat"];
const STATUS_ERROR = `status harus salah satu dari: ${VALID_STATUS.join(", ")}`;

export const LoanController = {
  async getAll(req, res) {
    try {
      const { status, member_id, book_id } = req.query;
      if (status && !VALID_STATUS.includes(status)) {
        return res.status(400).json({ error: STATUS_ERROR });
      }
      res.json(await LoanModel.getAll({ status, member_id, book_id }));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      res.json(await LoanModel.getById(req.params.id));
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { member_id, book_id, due_date, status } = req.body;
      if (!member_id || !book_id || !due_date) {
        return res
          .status(400)
          .json({ error: "member_id, book_id, dan due_date wajib diisi" });
      }
      if (status && !VALID_STATUS.includes(status)) {
        return res.status(400).json({ error: STATUS_ERROR });
      }
      res.status(201).json(await LoanModel.create(req.body));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      if (req.body.status && !VALID_STATUS.includes(req.body.status)) {
        return res.status(400).json({ error: STATUS_ERROR });
      }
      res.json(await LoanModel.update(req.params.id, req.body));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      res.json(await LoanModel.remove(req.params.id));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
