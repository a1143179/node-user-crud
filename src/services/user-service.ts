import userRepo from '@repos/user-repo';
import { IUser } from '@models/user-model';
import { UserNotFoundError } from '@shared/errors';



/**
 * Get all users.
 * 
 * @returns 
 */
function getAll(): Promise<IUser[]> {
    return userRepo.getAll();
}


function getOne(id: number): Promise<IUser|null> {
    return userRepo.getOne(id);
}

/**
 * Add one user.
 * 
 * @param user 
 * @returns 
 */
function addOne(user: IUser): Promise<void> {
    return userRepo.add(user);
}

/**
 * Delete a user by their id.
 * 
 * @param id 
 * @returns 
 */
async function deleteOne(id: number): Promise<void> {
    const persists = await userRepo.persists(id);
    if (!persists) {
        throw new UserNotFoundError();
    }
    return userRepo.delete(id);
}


// Export default
export default {
    getOne, 
    getAll,
    addOne,
    delete: deleteOne,
} as const;
