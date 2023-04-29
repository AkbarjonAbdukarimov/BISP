import Link from "next/link"
import { useState } from "react"
import useRequest from "@/hooks/useRequest"
import Router from "next/router"

import TextField from '@mui/material/TextField';

const valideteEmail: (str: string, check: string) => boolean = (str: string, check: string): boolean => {
    return str.split('').map((i: string) => i === check ? true : false).some(i => i === true)
}

//@ts-ignore
const Form = ({ title, accountLink, link, client }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')



    const { doRequest, errors } = useRequest(
        {
            url: `/api/users/${link === "signin" ? "signup" : 'signin'}`,
            method: 'post',
            body: { email, password },
            onSuccess: () => Router.push('/')
        })

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const res = await doRequest();
        console.log(res)
    }

    return <>
        <div className="d-flex justify-content-center align-items-center p-5" >

            <form onSubmit={handleSubmit} className="auth-form p-5 d-flex flex-column">
                <h2 className="w-100">{title}</h2>
                <div className="text-danger">{errors && errors[0] && errors[0].message}</div>
                <div className="w-100 my-3">
                    {/* <input value={email} onChange={(e) => {

                        setEmail(e.target.value.trim())
                    }} placeholder="Email" className="w-100 auth-input" type="text" /> */}
                    <TextField
                        className="w-100"
                        onChange={(e) => {

                            setEmail(e.target.value.trim())
                        }}
                        error={errors && errors[1] ? true : false}
                        id="standard-error-helper-text"
                        label="Email"
                        defaultValue={email}
                        helperText={errors && errors[1] && errors[1].message}
                        variant="standard"
                    />
                </div>
                <div className="w-100 my-3">
                    <TextField
                        className="w-100"
                        onChange={(e) => {
                            setPassword(e.target.value.trim())
                        }}
                        type="password"
                        error={errors && errors[1] ? true : false}
                        id="standard-error-helper-text"
                        label="Password"
                        defaultValue={password}
                        helperText={errors && errors[2] && errors[2].message}
                        variant="standard"
                    />

                </div>

                <Link className="my-3 text-dark" href={`/users/${link}`}>{accountLink}</Link>
                <button className="mx-auto  bg-dark">{title.toUpperCase()}</button>
            </form>
        </div >
    </>
}

export default Form
