import Form from "@/components/Form"

const SignIn = ({ client }) => {
    return <>
        <div className="wraper">

            <Form client={client} title="Sign In" accountLink="Don't have an account?" link="signup" />
        </div >
    </>
}

export default SignIn