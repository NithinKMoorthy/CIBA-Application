import React from 'react';
import axios from 'axios';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Header from '../../components/dashboard/header/Header';
import Filter from '../../components/dashboard/filter/Filter';
import HighLevelAccountInfo from '../../components/dashboard/high-level-account-info/HighLevelAccountInfo';
import DeeperAccount from '../../components/dashboard/graphs/DeeperAccount/DeeperAccount';

const Profile = async () => {
    const session = await getSession();
    const user = session?.user;
    if (!user) {
        redirect('/');
    }

    return (
        <div className="flex flex-col flex-grow p-4 min-h-screen w-full">
            <Header />
            <div className="w-full flex flex-col gap-4">
                <Filter className="w-full md:w-1/4" />
                <HighLevelAccountInfo className="w-full md:w-3/4" />
            </div>
            <div className="w-full mt-4">
                <DeeperAccount />
            </div>
        </div>
    );
}

export default Profile;
