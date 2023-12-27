import { authentication } from '@recoil/Authentication'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

const useApprovalLogic = (value) => {
    const { user } = useRecoilValue(authentication)

    const statusLabelAndColor = useMemo(()=> {
        const { checked_date, approved1_date, approved2_date, status } = value
        let labelAndColor = {
            label: 'default',
            color: 'primary'
        }
        if(!checked_date && !approved1_date && !approved2_date){
            labelAndColor = {
                label: 'Pending',
                color: 'warning'
            }
        }
        if(!!checked_date){
            labelAndColor = {
                label: 'Checked',
                color: 'primary'
            }
        }
        if(!!approved1_date){
            labelAndColor = {
                label: 'Approved 1',
                color: 'success'
            }
        }
        if(!!approved2_date){
            labelAndColor = {
                label: 'Approved 2',
                color: 'success'
            }
        }
        if(status === 'reject'){
            labelAndColor = {
                label: 'Rejected',
                color: 'error'
            }
        }
        if(status === 'draft'){
            labelAndColor = {
                label: 'Draft',
                color: 'warning'
            }
        }
        return labelAndColor
    }, [value])

    const isUserCanApprove = useMemo(() => {
        const user_id = user?.id
        const user_checker = value.checked_by
        const user_approver1 = value.approved1_by
        const user_approver2 = value.approved2_by
        const isUserChecked = user_id === user_checker.id
        const isUserApproved1 = user_id === user_approver1.id
        const isUserApproved2 = user_id === user_approver2.id
        
        if(!value?.approved2_date && !!value?.approved1_date && !!value?.checked_date && isUserApproved2){
            return true
        }
        if(!value?.approved1_date && !!value?.checked_date && isUserApproved1){
            return true
        }
        if(!value?.checked_date && isUserChecked && value?.status != 'draft' && value?.status != 'reject'){
            return true
        }
        
        return false

    }, [value, user])

    const isUserPrepared = useMemo(() => {
        if(!value?.prepared_by?.id && (value?.status === 'draft' || value?.status === 'reject')) return true
        return user?.id === value.prepared_by?.id && (value?.status === 'draft' || value?.status === 'reject')
    }, [value, user])

    return { statusLabelAndColor, isUserCanApprove, isUserPrepared }
}

export default useApprovalLogic