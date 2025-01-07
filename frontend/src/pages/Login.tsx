const Login = () => {
    const googleLogin = (): void => {
        window.open('http://localhost:5556/auth/google', '_self')
    }
    const githubLogin = (): void => {
        window.open('http://localhost:5556/auth/github', '_self')
    }
    return (
        <>
            <div onClick={googleLogin}>
                Login with Google
            </div>
            <div onClick={githubLogin}>
                Login with GitHub
            </div>
        </>
    )
}

export default Login