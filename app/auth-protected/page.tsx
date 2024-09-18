import {NextPage} from 'next';
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";

import React from 'react';

const AuthProtected: NextPage = withPageAuthRequired(
    async () => {
        return (
                <div>
                </div> 
        )
    },
    { returnTo: '/auth-protected'}
); 
export default AuthProtected;