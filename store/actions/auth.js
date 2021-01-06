import {firebase} from '../../Keys/firebase';
import AsyncStorage from '@react-native-community/async-storage'
export const SIGN_UP = 'sign_up';
export const AUTH = 'auth';
export const LOGOUT = 'logout';
let timer;




export const authenticate = (token, userId, expiryTime, name) => {
    return dispatch => {
      dispatch(setLogoutTimer(expiryTime));
      dispatch({ type: AUTH, userId: userId, token: token, name });
    };
  };


export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('UserData');
    return {
        type : LOGOUT
    }
}

const clearLogoutTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

const setLogoutTimer = expirationTime => {
    return dispatch => {
      timer = setTimeout(() => {
        dispatch(logout());
      }, expirationTime );
    };
  };




export const signUpUser = (email, password, name) => {
    return async dispatch => {
        const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebase.key}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    email: email,
                    password: password,
                    displayName : name,
                    returnSecureToken: true
                  })
                }
              );
            
              if (!response.ok) {
                const errorRes = await response.json();
                const errId = errorRes.error.message;
                let err = 'Something went wromg!!'
                if (errId === 'EMAIL_EXISTS'){
                    err = 'Email already exists.';
                    throw new Error(err);
                }
            }
            const resData = await response.json();
            dispatch(authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn, name) * 1000 ));
            const expireDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
            saveDataOfUser(resData.idToken,resData.localId, expireDate, name);
    }

};

export const login = (email, password) => {
    return async (dispatch) => {
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebase.key}`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
            }
        );
    
        if (!response.ok) {
            const errorRes = await response.json();
            const errId = errorRes.error.message;
            let err = 'Something went wromg!!'
            if (errId === 'EMAIL_NOT_FOUND'){
                err = 'Invalid email.';
                throw new Error(err);
            } else if (errId === 'INVALID_PASSWORD'){
                err = 'Password is invalid';
                throw new Error(err);
            }
        }
    
        const resData = await response.json();
        console.log(resData)
        const userName = resData.displayName;
        dispatch(authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000));
        const expireDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        console.log(resData.idToken,resData.localId, expireDate)
        saveDataOfUser(resData.idToken,resData.localId, expireDate, userName);
        };
    };


const saveDataOfUser = (token, userId, expireDate, name) => {
    AsyncStorage.setItem('UserData', JSON.stringify({
        token: token,
        userId : userId,
        expireDate : expireDate.toISOString(),
        name: name
    }))
}

    