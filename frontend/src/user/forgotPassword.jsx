import { useEffect, useState } from "react";
import '../styles/UserStyles/Form.css'
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import PageTitle from "../components/pageTitle";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, removeErrors, removeSuccess } from "../features/user/userSlice";
import { toast } from "react-toastify";
import Loader from "../components/loder";

const ForgotPassword = () => {
    const [email,setEmail]=useState('');
    const {loading,error,success,message}=useSelector(state=>state.user);
    const dispatch=useDispatch();
    // const
    const handleForgotPassword=e=>{
        e.preventDefault();
        if(!email){
            toast.error('please fill email field')
            return;
        }
        
        dispatch(forgotPassword({email}));

    }
    useEffect(() => {
            if (error) {
                toast.error(error, { position: 'top-center', autoClose: 3000 })

                dispatch(removeErrors())
            }
        }, [dispatch, error])
         useEffect(() => {
            if (success) {
                toast.success(message, { position: 'top-center', autoClose: 3000 })

                dispatch(removeSuccess())
                // navigate('/login')
            }
        }, [dispatch, success,message])
    return (
        <>
            <NavBar />
            <PageTitle title={'forgot | password'} />
           {loading? <Loader />: <div className="container forgot-container">
                <div className="form-content email-group">
                    <form className="form" onSubmit={handleForgotPassword}>
                        <h2>forgot  password</h2>

                        <div className="input-group">
                            <input type="email" name="email" id="email" placeholder=' Enter your registered email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <button className='authBtn' disabled={loading}>{loading ? 'sending ' : 'send'} </button>

                    </form>
                </div>
            </div>}
            <Footer />
        </>
    )
}
export default ForgotPassword;
