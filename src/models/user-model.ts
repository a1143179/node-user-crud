
// User schema
export interface IUser {
    id: number;
    name: string;
    email: string;
    dob: Date;
}


/**
 * Get a new User object.
 * 
 * @returns 
 */
function getNew(name: string, email: string, dob: Date): IUser {
    return {
        id: -1,
        email,
        name,
        dob,
    };
}


/**
 * Copy a user object.
 * 
 * @param user 
 * @returns 
 */
function copy(user: IUser): IUser {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        dob: user.dob,
    }
}


// Export default
export default {
    new: getNew,
    copy,
}