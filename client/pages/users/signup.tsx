import Form from "@/components/Form"

const SignUp = ({ client }) => {
    console.log(client)
    return <><Form client={client} title="Sign Up" accountLink="Already have an account?" link="signin" /></>
}

export default SignUp