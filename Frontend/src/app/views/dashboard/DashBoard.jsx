import React, { Fragment } from 'react'
import StudentBoard from './StudentBoard'
import AdminBoard from './AdminBoard'
import useAuth from 'app/hooks/useAuth'

const DashBoard = () => {

    const { user} = useAuth()
    

    return (
        
        <>
            {user.role === 'student' ? 
            <StudentBoard /> : 
            <AdminBoard/>}
        </>
    )
}

export default DashBoard
