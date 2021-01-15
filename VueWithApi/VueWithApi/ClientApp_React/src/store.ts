import create from 'zustand'
import api from './api/api';

 type State = {
     appInfo: object,
     initializationFailed: boolean,
     initialized: boolean,
     minimumPasswordStrength: number,
     minimumPasswordLength: number,
     user: User,
     permissions: any|null,
     fatalError():void,
     initialize():Promise<void>,
     signedIn():boolean
 }

 type User = {
     username: string,
     email: string,
     isAuthenticated: boolean
 }

export const useStore = create<State>((set,get) => ({
    //   bears: 0,
    //   increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
    //   removeAllBears: () => set({ bears: 0 }),
    appInfo: {},
    initializationFailed: false,
    initialized: false,
    minimumPasswordStrength: 0,
    minimumPasswordLength: 0,
    user: {
        username: '?',
        email: '?',
        isAuthenticated: false
    },
    permissions: null,
    signedIn: ()=> {
        const user = get().user;
        return typeof (user.isAuthenticated) !== 'undefined' && user.isAuthenticated === true? true: false;
    },
    fatalError: ()=> {
        set(state => ({ initializationFailed: true }));
    },

    initialize: () => {
        return new Promise<void>((resolve, reject): void => {
            api.getAppInfo().then(data => {
                console.log('initialize...',data);
                set(state => ({
                    initialized: true,
                    minimumPasswordStrength: data.minimumPasswordStrength,
                    minimumPasswordLength: data.minimumPasswordLength,
                    user: data.user as User,
                    permissions: data.permissions
                }));
                console.log('end init');
                console.log('isInitialized:',get().initialized);
                console.log('user:',get().user);
                resolve();
            }).catch(err => {
                console.log(err);
                get().fatalError();
                //useStore.getState().fatalError();
                //set(state => ({ initializationFailed: true }));
                //context.commit('fatalError');
                reject('Initialization failed');
            });
        });
    }
}))