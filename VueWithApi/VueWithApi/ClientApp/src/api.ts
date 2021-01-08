import axios from 'axios';
import router from './router';

const url = axios.create({
    baseURL: window.location.origin
});

const api = {
    getAppInfo() {
        return this.enhancePromise(url.get('/api/app-info'));
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
    sendOneTimeCode(username: any, nextUrl: any) {
        return this.enhancePromise(url.post('/passwordless-api/v1/send-one-time-code', { username, nextUrl }));
    },
    authenticate(username: any, oneTimeCode: any, staySignedIn: any) {
        return this.enhancePromise(url.post('/passwordless-api/v1/authenticate', { username, oneTimeCode, staySignedIn }), false);
    },
    authenticatePassword(username: any, password: any, staySignedIn: any, nextUrl: any) {
        return this.enhancePromise(url.post('/passwordless-api/v1/authenticate-password', { username, password, staySignedIn, nextUrl }), false);
    },
    authenticateLink(longCode: any) {
        return this.enhancePromise(url.post('/passwordless-api/v1/authenticate-password', { longCode }), false);
    },
    signOut() {
        return this.enhancePromise(url.post('/passwordless-api/v1/sign-out'));
    },
    sendPasswordResetMessage(username: any, nextUrl: any) {
        return this.enhancePromise(url.post('/passwordless-api/v1/send-password-reset-message', { username, nextUrl }));
    },
    setPassword(newPassword: any) {
        return this.enhancePromise(url.post('/passwordless-api/v1/my-account/set-password', { newPassword }));
    },
    enhancePromise(apiPromise: Promise<any>, redirectUnauthenticated = true) {
        return new Promise((resolve, reject) => {
            apiPromise
                .then(apiResponse => {
                    resolve(apiResponse.data);
                })
                .catch(error => {
                    error.message = 'An error occured';
                    error.errors = null;
                    if (error.response) {
                        if (typeof error.response.status !== 'undefined' && error.response.status === 401 && redirectUnauthenticated) {
                            router.push('/signin');
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
