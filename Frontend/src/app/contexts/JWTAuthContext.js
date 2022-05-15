import React, { createContext, useEffect, useReducer } from 'react'
import axios from 'axios.js'
import { MatxLoading } from 'app/components'


const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }

    // const decodedToken = jwtDecode(accessToken)
    // const currentTime = Date.now() / 1000
    // return decodedToken.exp > currentTime
    return true
}

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        delete axios.defaults.headers.common.Authorization
    }
}

const setUser = (user) => {
    if (user){
        localStorage.setItem('user', JSON.stringify(user))
    } else{
        localStorage.setItem('user', JSON.stringify({}))
    }
}


const setIsAuthenticated = (isAuthenticated) => {
    if (isAuthenticated) {
        localStorage.setItem('isAuthenticated', true)
    } else {
        localStorage.setItem('isAuthenticated', false)
    }
}

const encapsulateUser = (user) =>{
    return {
        ...user,
        role: user.is_superuser ? "admin"  : "student",
        avatar: `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=0D8ABC&color=fff&size=128`,
        name: user.first_name + " " + user.last_name,
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            let { user } = action.payload
            user = encapsulateUser(user)
            setUser(user)
            setIsAuthenticated(true)
            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            setUser(null)
            setIsAuthenticated(null)
            
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            let { user } = action.payload
            user = encapsulateUser(user)
            setUser(user)
            setIsAuthenticated(true)
            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
}


const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    loginBackend: () => Promise.resolve(),
    logout: () => { },
    logoutBackend: () => Promise.resolve(),
    register: () => Promise.resolve(),
    registerBackend: () => Promise.resolve(),
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const login = async (email, password) => {
        const response = await axios.post('/api/auth/login', {
            email,
            password,
        })
        const { accessToken, user } = response.data

        setSession(accessToken)

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        })
    }

    

    const loginBackend = async (email, password) => {
        const data = {
            "username": email,
            "password": password,
        }
        console.log(data)
        const response = await fetch("http://localhost:8000/api/auth/login", {
            method:"POST",
            crossDomain:true,
            mode: 'cors',
            body: JSON.stringify({
                email: email,
                password: password,
              }),
            headers:{
              'Content-Type': 'application/json'
            },
          }).then(res => {
              return res.json();
          }).then(json => {
              console.log( json);
              return json;
          }).catch(err => {
              console.log( err);
          })

        console.log(response)
        let {  user, token } = response

        setSession(token)
        
        
        console.log(user)
        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        })

        return user
    }

    const register = async (email, username, password) => {
        const response = await axios.post('/api/auth/register', {
            email,
            username,
            password,
        })

        const { accessToken, user } = response.data

        setSession(accessToken)

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        })
    }

    const registerBackend = async (data) => {
        const response = await fetch("http://localhost:8000/api/auth/register", {
            method:"POST",
            crossDomain:true,
            mode: 'cors',
            body: JSON.stringify(data),
            headers:{
              'Content-Type': 'application/json'
            },
          }).then(res => {
              return res.json();
          }).then(json => {
              console.log(json);
              return json;
          }).catch(err => {
              console.log( err);
          })
        let { token, user } = response

        setSession(token)

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        })
    }

    const logout = () => {
        setSession(null)
        dispatch({ type: 'LOGOUT' })
    }

    const logoutBackend = async () => {
        await fetch("http://localhost:8000/api/auth/logout", {
            method:"POST",
            crossDomain:true,
            mode: 'cors',
            headers:{
              'Content-Type': 'application/json'
            },
          }).then(res => {
              return res.json();
          }).then(json => {
              console.log(json);
              setSession(null)
                dispatch({ type: 'LOGOUT' })
              return json;
          }).catch(err => {
              console.log( err);
          })
    }

    useEffect(() => {
        ; (async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken')

                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken)

                    const user = JSON.parse(localStorage.getItem('user'))

                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                loginBackend,
                logout,
                logoutBackend,
                register,
                registerBackend,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
