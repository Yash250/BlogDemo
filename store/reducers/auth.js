import { AUTH, LOGOUT } from "../actions/auth"


const initialState = {
    token: null,
    userId : null,
    name : null
}

export default (state=initialState, action) => {
    switch(action.type){
        case AUTH:
            return {
                token : action.token,
                userId : action.userId,
                name : action.name
            }
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}