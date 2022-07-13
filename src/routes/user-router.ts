import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import userService from '@services/user-service';
import { ParamMissingError } from '@shared/errors';



// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    get: '/',
    add: '/',
    delete: '/:id',
    getOne: '/:id',
} as const;

router.get(p.getOne, async(req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.getOne(parseInt(id));
    return res.status(OK).json(user);
});

/**
 * Get all users.
 */
router.get(p.get, async (_: Request, res: Response) => {
    const users = await userService.getAll();
    return res.status(OK).json({users});
});


/**
 * Add one user.
 */
router.post(p.add, async (req: Request, res: Response) => {
    const user = req.body;
    if (!('email' in user)) {
        throw new ParamMissingError();
    }
    await userService.addOne(user);
    return res.status(CREATED).end();
});

/**
 * Delete one user.
 */
router.delete(p.delete, async (req: Request, res: Response) => {
    const { id } = req.params;
    // Check param
    if (!id) {
        throw new ParamMissingError();
    }
    // Fetch data
    await userService.delete(Number(id));
    return res.status(OK).end();
});


// Export default
export default router;
