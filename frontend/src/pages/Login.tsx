const Login = () => {
    const googleLogin = (): void => {
        window.open('http://localhost:5556/auth/google', '_self')
    }
    return (
        <div onClick={googleLogin}>
            Login with Google
        </div>
    )
}

export default Login