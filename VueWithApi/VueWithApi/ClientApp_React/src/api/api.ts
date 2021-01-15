import axios from 'axios';
//import router from './router';
import { AppInfo } from './generated/api';

const url = axios.create({
    //baseURL: window.location.origin
    baseURL: 'https://localhost:5001',  //todo: unhard code.
    withCredentials: true  //assist with setting cookie in proxied CORS scenario.
});

const api = {
    getAppInfo(): Promise<AppInfo> {
        return this.enhancePromise<AppInfo>(url.get('/api/app-info'));
    },
    getProtectedInfo() {
        return this.enhancePromise(url.get('/api/protected-info'));
    },
    tryToGetProtectedInfoButDontRedirectIfUnauthenticated() {
        return this.enhancePromise(url.get('/api/protected-info'), false);
    },
    register(email: any, nextUrl: any) {
        return this.enhancePromise(url.post('/passwordless-api/v1/register', { email, nextUrl }));
    },
    sendOneTimeCode(username: string, nextUrl: any) {
        return this.enhancePromise(url.post('/passwordless-api/v1/send-one-time-code', { username, nextUrl }));
    },

    authenticate(username: string, oneTimeCode: string, staySignedIn: boolean) {
        return this.enhancePromise(url.post('/passwordless-api/v1/authenticate', { username, oneTimeCode, staySignedIn }), false);
    },

    authenticateOneTimeCode(username: string, oneTimeCode: string, staySignedIn: boolean) {
        return this.enhancePromise(url.post('/passwordless-api/v1/authenticate-one-time-code', { username, oneTimeCode, staySignedIn }), false);
    },

    authenticateLongCode(longCode: string):Promise<unknown> {
        console.log('authenticateLongCode');
        return this.enhancePromise(url.post('/passwordless-api/v1/authenticate-long-code', { longCode: longCode }), false);
    },

    authenticatePassword(username: string, password: string, staySignedIn: boolean, nextUrl: any) {
        return this.enhancePromise(url.post('/passwordless-api/v1/authenticate-password', { username, password, staySignedIn, nextUrl }), false);
    },
    authenticateLink(longCode: any) {
        return this.enhancePromise(url.post('/passwordless-api/v1/authenticate-password', { longCode }), false);
    },
    signOut() {
        return this.enhancePromise(url.post('/passwordless-api/v1/sign-out'));
    },
    sendPasswordResetMessage(username: string, nextUrl: any) {
        return this.enhancePromise(url.post('/passwordless-api/v1/send-password-reset-message', { username, nextUrl }));
    },
    setPassword(newPassword: string) {
        return this.enhancePromise(url.post('/passwordless-api/v1/my-account/set-password', { newPassword }));
    },
    enhancePromise<T>(apiPromise: Promise<any>, redirectUnauthenticated = true) {
        return new Promise<T>((resolve, reject) => {
            apiPromise
                .then(apiResponse => {
                    resolve(apiResponse.data);
                })
                .catch(error => {
                    error.message = 'An error occured';
                    error.errors = null;
                    if (error.response) {
                        if (typeof error.response.status !== 'undefined' && error.response.status === 401 && redirectUnauthenticated) {
                            console.log('nav to signin')
                            //router.push('/signin');
                        }
                        if (typeof error.response.data.message === 'string') {
                            error.message = error.response.data.message;
                        }
                        if (typeof error.response.data.errors === 'object') {
                            error.errors = error.response.data.errors;
                        }
                    }
                    reject(error);
                });
        });
    },
};

export default api;