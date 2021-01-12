import create from 'zustand'
import api from './api/api';

 type State = {
     appInfo: object,
     initializationFailed: boolean,
     initialized: boolean,
     minimumPasswordStrength: number,
     minimumPasswordLength: number,
     user: object|null,
     permissions: any|null,
     fatalError():void
     initialize():void
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
    user: null,
    permissions: null,
    fatalError: ()=> {
        set(state => ({ initializationFailed: true }));
    },
    initialize: () => {
        return new Promise<void>((resolve, reject): void => {
            api.getAppInfo().then(data => {
                //context.commit('setAppInfo', data);
                set(state => ({
                    initialized: true,
                    minimumPasswordStrength: data.minimumPasswordStrength,
                    minimumPasswordLength: data.minimumPasswordLength,
                    user: data.user,
                    permissions: data.permissions
                }));
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