import { Request, Response, NextFunction } from 'express';
import { ClassBookingService } from './class-booking.service';
import { sendSuccess } from '../../shared/utils/apiResponse';

const service = new ClassBookingService();

export class ClassBookingController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.create(req.user!.id, req.body);
      sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.confirm(req.user!.id, req.params.id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async listForConsultant(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.listForConsultant(req.user!.id, req.query as Record<string, string>);
      sendSuccess(res, result.data, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async listForTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.listForTutor(req.user!.id, req.query as Record<string, string>);
      sendSuccess(res, result.data, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async listForParent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.listForParent(req.user!.id, req.query as Record<string, string>);
      sendSuccess(res, result.data, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getById(req.user!.id, req.user!.role, req.params.id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.update(req.user!.id, req.params.id, req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.updateStatus(req.user!.id, req.user!.role, req.params.id, req.body.status);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.cancel(req.user!.id, req.user!.role, req.params.id, req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.listAll(req.query as Record<string, string>);
      sendSuccess(res, result.data, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }
}
