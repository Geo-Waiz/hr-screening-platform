import { Router } from 'express';

const router = Router();

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes working!',
    timestamp: new Date().toISOString()
  });
});

router.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint ready for implementation',
    body: req.body
  });
});

export default router;
