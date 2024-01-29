import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useMemo } from 'react'
import urlJoin from 'url-join'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import { Mongoize, User } from './models'

const backend = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BACKEND_URL}`,
  timeout: 30 * 1000,
  headers: {
    'Content-Type': 'application/json'
  }
})

backend.interceptors.response.use(
  (response) => {
    const setAuthHeader = response.headers['yours_truly']
    if (setAuthHeader) {
      localStorage.setItem('mine_truly', setAuthHeader)
    }
    return response
  },
  (error) => {
    const response = error.response
    const setAuthHeader = response.headers['yours_truly']
    if (setAuthHeader) {
      localStorage.setItem('mine_truly', setAuthHeader)
    }
    return response
  }
)

backend.interceptors.request.use(async (request) => {
  const TOKEN_KEY = 'mine_truly'
  const REISSUE_TOKEN_ENDPOINT = '/reissue-token'
  const FIFTEEN_MINUTES_IN_MS = 60 * 15 * 1000

  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    return request
  }

  const payload = jwtDecode(token) as AuthenticationPayload
  const isTokenExpired =
    Date.now() - payload.issued_time > FIFTEEN_MINUTES_IN_MS

  if (request.url !== REISSUE_TOKEN_ENDPOINT && isTokenExpired) {
    const response = await backend.get(REISSUE_TOKEN_ENDPOINT)
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.reload()
      return request
    }
    localStorage.setItem(TOKEN_KEY, response.headers['yours_truly'])
  }

  request.headers[TOKEN_KEY] = localStorage.getItem(TOKEN_KEY)
  return request
})

interface AuthenticationPayload {
  user: Mongoize<User>
  salt: string
  issued_time: number
}

export const useCurrentUser = () => {
  const [value] = useLocalStorage<string>(
    'mine_truly',
    localStorage.getItem('mine_truly') ?? ''
  )

  const currentUser = useMemo(() => {
    if (value) {
      const payload = jwtDecode(value) as AuthenticationPayload
      return payload.user
    } else {
      return null
    }
  }, [value])

  return currentUser
}
export default backend

export const baseUrl = (path: string) => {
  return urlJoin(window.location.origin, path)
}
