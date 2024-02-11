import { authentication } from '@recoil/Authentication'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

const useIsStoreKeeper = () => {
    const { user } = useRecoilValue(authentication)
    const isUserStoreKeeper = useMemo(() => {
        if(!user) return false
        return user.role[0] === 'store-keeper' 
        
    }, [user])
    return isUserStoreKeeper 
}

export default useIsStoreKeeper