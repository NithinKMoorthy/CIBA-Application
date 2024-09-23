import React from 'react';
import {getSession} from '@auth0/nextjs-auth0';
import {redirect} from 'next/navigation';
import Header from './components/dashboard/header/Header';
import Filter from './components/dashboard/filter/Filter';
import HighLevelAccountInfo from './components/dashboard/high-level-account-info/HighLevelAccountInfo';
import DeeperAccount from './components/dashboard/graphs/DeeperAccount/DeeperAccount';
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