import { Router, Request, Response } from "express";

const router = Router();

router.get("/check-connection", (_, response: Response) => {
  response.status(200).json({ message: "OK" });
});

export default router;
