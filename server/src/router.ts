import { Router } from "express";
import journalRouter from "./routes/journal";

const router: Router = Router();

router.use("/journals", journalRouter);

export default router;
