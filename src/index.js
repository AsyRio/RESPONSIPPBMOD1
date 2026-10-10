import express from "express";
import dotenv from "dotenv";
import memberRoutes from "./routes/memberRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Perpustakaan Loan API",
    endpoints: ["/api/members", "/api/books", "/api/loans"],
  });
});

app.use("/api/members", memberRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/loans", loanRoutes);

// Di Vercel, app diekspor sebagai handler; listen hanya dipakai saat lokal.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
