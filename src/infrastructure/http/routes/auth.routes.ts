import { Router } from 'express';
import { AuthUseCases } from '../../../application/use-cases/AuthUseCases';
import { AuthServiceImpl } from '../../auth/authServiceImpl';
import { PostgresAuthRepository } from '../../../infrastructure/db/repositories/PostgresAuthRepository';

const router = Router();

router.post('/register', (req, res) => {
    try {
        const { username, password } = req.body;
        const authService = new AuthServiceImpl();
        const authUseCases = new AuthUseCases(authService);
        const token = authUseCases.register(username, password, PostgresAuthRepository);
        res.json({ token });
    } catch (e : any) {
      res.status(400).json({ message: e.message });
    }
});

router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const authService = new AuthServiceImpl();
        const authUseCases = new AuthUseCases(authService);
        const token = authUseCases.login(username, password, PostgresAuthRepository);
        res.json({ token });
    } catch (e : any) {
      res.status(400).json({ message: e.message });
    }
});

export default router;
