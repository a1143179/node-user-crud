
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


// Export default
export default {
    new: getNew,
}
