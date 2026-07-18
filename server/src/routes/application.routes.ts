import { Router } from 'express';
import * as applicationController from '../controllers/application.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/stats', applicationController.stats);
router.get('/', applicationController.list);
router.get('/:id', applicationController.getOne);
router.post('/', applicationController.create);
router.put('/:id', applicationController.update);
router.delete('/:id', applicationController.remove);

export default router;
