import { Router } from 'express';
import { PostgresUserRepository } from '@infrastructure/db/repositories/PostgresUserRepository';
import { GetUsers } from '@application/use-cases/GetUsers';

const router = Router();

router.get('/', async (req, res) => {
  const { limite, pagina, filtros } = req.body;
  const repo = new PostgresUserRepository();
  const useCase = new GetUsers(repo);
  const users = await useCase.getAll({ limite, pagina, filtros });
  res.json(users);
});

export default router;
