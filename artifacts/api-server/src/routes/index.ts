import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import categoriesRouter from "./categories";
import commentsRouter from "./comments";
import ebooksRouter from "./ebooks";
import leadsRouter from "./leads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(postsRouter);
router.use(commentsRouter);
router.use(ebooksRouter);
router.use(leadsRouter);

export default router;
