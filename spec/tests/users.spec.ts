import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import userRepo from '@repos/user-repo';
import User, { IUser } from '@models/user-model';
import { pErr } from '@shared/functions';
import { p as userPaths } from '@routes/user-router';
import { ParamMissingError, UserNotFoundError } from '@shared/errors';

type TReqBody = string | object | undefined;


describe('user-router', () => {

    const usersPath = '/users';
    const getUsersPath = `${usersPath}${userPaths.get}`;
    const addUsersPath = `${usersPath}${userPaths.add}`;
    const deleteUserPath = `${usersPath}${userPaths.delete}`;

    const { BAD_REQUEST, CREATED, OK } = StatusCodes;
    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });


    /***********************************************************************************
     *                                    Test Get
     **********************************************************************************/

    describe(`"GET:${getUsersPath}"`, () => {

        it(`should return a JSON object with all the users and a status code of "${OK}" if the
            request was successful.`, (done) => {
            // Setup spy
            const users = [
                User.new('Sean Maxwell', 'sean.maxwell@gmail.com', new Date('2020-01-01')),
                User.new('John Smith', 'john.smith@gmail.com', new Date('1999-01-01')),
            ];
            spyOn(userRepo, 'getAll').and.returnValue(Promise.resolve(users));
            // Call API
            agent.get(getUsersPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    const respUsers = res.body.users;
                    expect(respUsers).toEqual(
                        [
                            {
                                id: -1,
                                email: 'sean.maxwell@gmail.com',
                                name: 'Sean Maxwell',
                                dob: '2020-01-01T00:00:00.000Z',
                            },
                            {
                                id: -1,
                                email: 'john.smith@gmail.com',
                                name: 'John Smith',
                                dob: '1999-01-01T00:00:00.000Z',
                            }

                        ]
                    );
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not fetch users.';
            spyOn(userRepo, 'getAll').and.throwError(errMsg);
            // Call API
            agent.get(getUsersPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    console.log(res.body)
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    /***********************************************************************************
     *                                    Test Post
     **********************************************************************************/

    describe(`"POST:${addUsersPath}"`, () => {

        const callApi = (reqBody: TReqBody) => {
            return agent.post(addUsersPath).type('form').send(reqBody);
        };
        const userData = {
            'name': 'Gordan Freeman',
            'email': 'gordan.freeman@gmail.com',
            'dob': new Date('2020-01-01'),
        };

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            // Setup Spy
            spyOn(userRepo, 'add').and.returnValue(Promise.resolve());
            // Call API
            agent.post(addUsersPath).type('form').send(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a status
            code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
            // Call API
            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(ParamMissingError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not add user.';
            spyOn(userRepo, 'add').and.throwError(errMsg);
            // Call API
            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    /***********************************************************************************
     *                                    Test Delete
     **********************************************************************************/

    describe(`"DELETE:${deleteUserPath}"`, () => {

        const callApi = (id: number) => {
            return agent.delete(deleteUserPath.replace(':id', id.toString()));
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            // Setup spy
            spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
            spyOn(userRepo, 'delete').and.returnValue(Promise.resolve());
            // Call api
            callApi(5)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with the error message of ${UserNotFoundError.Msg} 
            and a status code of "${StatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
            // Call api
            callApi(-1)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(StatusCodes.NOT_FOUND);
                    expect(res.body.error).toBe(UserNotFoundError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
            // Setup spy
            const deleteErrMsg = 'Could not delete user.';
            spyOn(userRepo, 'delete').and.throwError(deleteErrMsg);
            // Call Api
            callApi(1)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(deleteErrMsg);
                    done();
                });
        });
    });
});
