import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '@/hooks/useRequest';
import axios from 'axios';

const SignOut = ({ client }) => {
    // const { doRequest } = useRequest({
    //     url: client + '/api/users/signout',
    //     method: 'post',
    //     body: {},
    //     onSuccess: () => Router.push('/')
    // });

    // useEffect(() => {
    //     doRequest().then(() => { Router.push('/') });
    // }, []);

    return <div>Signing you out...</div>;
};
SignOut.getInitialProps = async (context, client, currentUser) => {
    let headers = {}
    const { req, res } = context

    if (req) {
        headers["Cookie"] = req.headers.cookie

    }
    try {

        const responce = await client.post(`/api/users/signout`)
        console.log(responce)
        if (responce) {
            if (res) {

                res.writeHead(307, { Location: '/' })
                res.end()
                return {}
            } else {
                // We'll redirect to the external page using
                // `window.location`.
                Router.push('/')

            }
        }


    } catch (error) {
        console.log(error)
    }

    return {}
}
export default SignOut