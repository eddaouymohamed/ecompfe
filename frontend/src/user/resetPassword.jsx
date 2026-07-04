import { useEffect, useState } from 'react';
import '../styles/UserStyles/Form.css';
import { toast } from 'react-toastify';
import { removeErrors, removeSuccess, resetPassword } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/navBar';
import PageTitle from '../components/pageTitle';
import Footer from '../components/footer';
const ResetPassword = () => {



    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { loading, success, error, message } = useSelector(state => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams()


    const handleResetPassword = e => {
        e.preventDefault();
        const data = {
            password,
            confirmPassword
        }
        dispatch(resetPassword({ token, userData: data }))
    }
    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
    }, [dispatch, error])
    useEffect(() => {
        if (success) {
            toast.success('password reseting succesfully', { position: 'top-center', autoClose: 3000 })

            dispatch(removeSuccess())
            navigate('/login')
        }
    }, [dispatch, success])
    return (
        <>
            <NavBar />
            <PageTitle title={'Reset||password'} />
            <div className="container forgot-container">
                <div className="form-content ">
                    <form className="form" onSubmit={handleResetPassword}>
                        <h2>forgot  password</h2>

                        <div className="input-group">
                            <input type="password" name="password" id="newPassword" placeholder=' Enter New Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <input type="password" name="confirmPassword" placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <button className='authBtn'>{loading ? 'reseting  ' : 'reset'} password </button>


                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ResetPassword;