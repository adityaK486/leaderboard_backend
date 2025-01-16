import express from "express";
import { allUsers, claimPoints, createUser, getHistory, getRank } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/create',createUser);
router.get('/all',allUsers);
router.post('/claim/:userId',claimPoints);
router.get('/ranks',getRank); 
router.get('/history/:userId',getHistory);

export default router;