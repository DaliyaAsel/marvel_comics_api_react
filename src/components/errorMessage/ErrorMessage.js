import errorImg from'./error.gif';

const ErrorMessage = () => {
    return(
        <>
        <img src={errorImg} style={{display: 'block', width: 250, height: 250, objectFit: 'contain', margin: ' 0 auto'}} alt="Error" />
        </>
    )
}

export default ErrorMessage;