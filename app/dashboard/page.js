import React from 'react';
import {getSession} from '@auth0/nextjs-auth0';
import {redirect} from 'next/navigation';
import Header from '@/app/dashboard/components/dashboard/header/header';
import Filter from '@/app/dashboard/components/dashboard/filter/Filter';
import HighLevelAccountInfo from '@/app/dashboard/components/dashboard/high-level-account-info/high-level-account-info';
import DeeperAccount from '@/app/dashboard/components/dashboard/graphs/DeeperAccount/deeperaccount';
const Profile = async () => {
    const session = await getSession();
    const user = session?.user;
    if(!user) {
        redirect('/');
    }
    return (
        <div className="flex flex-col flex-grow  p-4 h-full"> 
            <Header /> 
            <Filter /> 
            <HighLevelAccountInfo /> 
            <DeeperAccount /> 
        </div>   
    )
}

export default Profile;