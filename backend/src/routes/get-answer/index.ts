import { Router, Request, Response } from "express";

const router = Router();

router.get(
  "/get-answer",
  (_, response: Response<{ answer: string }, { pickedWord: string }>) => {
    response.json({ answer: response.locals.pickedWord });
  }
);

export default router;
