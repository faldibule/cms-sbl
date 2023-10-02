import React from 'react'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import Loading from '@components/Loading'
import { authentication } from '@recoil/Authentication'
import http from '@variable/Api'

const index = () => {
    const [auth, setAuth] = useRecoilState(authentication)
    useEffect(() => {
        let mounted = true 
        const handleLogout = async () => {
            let response = null
            try {
              const res = await http.delete('user/auth/logout')
              return res
            } catch (err) {
            }
            return response
        }
        handleLogout().then(res => {
            if(mounted && !!res?.data?.data){
                setAuth({
                  ...auth,
                  auth: false,
                  user: {},
                })
                localStorage.removeItem('token')
            }
        })
        return () => mounted = false
    }, [])
    return <Loading />
}

export default index