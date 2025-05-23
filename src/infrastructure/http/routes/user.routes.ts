import { Router } from 'express';
import { PostgresUserRepository } from '@infrastructure/db/repositories/PostgresUserRepository';
import { Users } from '@application/use-cases/Users';
import { parametersSaveUser } from '@domain/dto/parametersSaveUser';
import { errorResponse, successResponse } from '@infrastructure/helpers/httpResponse';

const router = Router();

router.get('/', async (req, res) => {
  const { limite, pagina, filtros } = req.body;
  const repo = new PostgresUserRepository();
  const useCase = new Users(repo);
  const users = await useCase.getAll({ limite, pagina, filtros });
  res.json(users);
});


router.post('/save', async (req, res) => {
  const params : parametersSaveUser = req.body;
  try {
    const repo = new PostgresUserRepository();
    const useCase = new Users(repo);
    const users: any = await useCase.save(params);
    res.json(successResponse(users));
  } catch (error: any) {
    return res.json(errorResponse(error));
  }
});


export default router;
