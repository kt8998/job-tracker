import { Request, Response, NextFunction } from 'express';
import {
  createApplicationSchema,
  updateApplicationSchema,
  listApplicationsQuerySchema,
} from '../validators/application.validator';
import * as applicationService from '../services/application.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createApplicationSchema.parse(req.body);
    const application = await applicationService.createApplication(req.userId!, input);
    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = listApplicationsQuerySchema.parse(req.query);
    const result = await applicationService.listApplications(req.userId!, query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const application = await applicationService.getApplicationById(req.userId!, req.params.id);
    res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updateApplicationSchema.parse(req.body);
    const application = await applicationService.updateApplication(
      req.userId!,
      req.params.id,
      input
    );
    res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await applicationService.deleteApplication(req.userId!, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const stats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await applicationService.getApplicationStats(req.userId!);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
