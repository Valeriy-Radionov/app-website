import {authAPI, UpdateUserType, UserDataType} from "../api/auth/auth-api";
import {Dispatch} from "redux";
import {handleServerNetworkError} from "../utils/errors-utils";
import {setAppStatusAC} from "./appReducer";


const PROFILE = "PROFILE/PROFILE"
const LOGGEDIN = "PROFILE/LOGGEDIN"


export type ProfileStateType = {
    user: UserDataType
    isLoggedIn?: boolean
}

const initialProfileState = {
    user: {
        _id: '',
        email: '',
        name: '',
        publicCardPacksCount: 0,
        avatar: 'https://icons.iconarchive.com/icons/hopstarter/soft-scraps/256/User-Administrator-Blue-icon.png',
        created: null,
        __v: 0,
        updated: null,
        isAdmin: false,
        verified: false, // подтвердил ли почту
        rememberMe: false,
        error: ''
    },
    isLoggedIn: false
}
export const profileReducer = (state: ProfileStateType = initialProfileState, action: ProfileActionsType): ProfileStateType => {
    switch (action.type) {
        case 'PROFILE/PROFILE': {
            return {
                ...state,
                user: {...action.payload.profile}
            }
        }
        case "PROFILE/LOGGEDIN": {
            return {
                ...state,
                isLoggedIn: action.payload.log
            }
        }
        default:
            return state
    }
}

//TYPE ACs
export type ProfileActionsType = SetProfileACType | IsLoggedInACType

type SetProfileACType = ReturnType<typeof setProfileAC>
type IsLoggedInACType = ReturnType<typeof isLoggedInAC>

export const setProfileAC = (profile: UserDataType) => {
    return {
        type: PROFILE,
        payload: {
            profile
        }
    } as const
}
export const isLoggedInAC = (log: boolean) => {
    return {
        type: LOGGEDIN,
        payload: {
            log
        }
    } as const
}

export const logoutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    try {
        await authAPI.logOut()
        dispatch(isLoggedInAC(false))
        dispatch(setAppStatusAC("succeeded"))
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}

export const updateUserTC = (model: UpdateUserType) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    try {
        const response = await authAPI.userUpdate(model)
        dispatch(setProfileAC(response.data.updatedUser))
        dispatch(setAppStatusAC("succeeded"))
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}