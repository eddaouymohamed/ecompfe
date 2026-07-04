
import { Link } from 'react-router-dom';
import '../styles/UserStyles/Profile.css';
import { useSelector } from 'react-redux';
import banner1 from '/images/banner1.jpg';
import PageTitle from '../components/pageTitle';
import Loader from '../components/loder';

export const Profile = () => {
    const { user, isAuthenticated, loading, error } = useSelector(state => state.user);
    console.log(user);

    // Handle loading state
    if (loading) {
        return (
            <div className='profile-container'>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className='profile-container'>
                <div className="profile-image">
                    <h2 style={{
                        marginBlock:'5px'
                    }}>Error loading profile</h2>
                    <p  style={{
                        marginBlock:'10px'
                    }}>{error}</p>
                    <Link to="/login">Go to Login</Link>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className='profile-container'>
                <div className="profile-image">
                    <h2 style={{
                        marginBlock:'10px'
                    }}>Please log in to view your profile</h2>
                    <Link to="/login">Go to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className='profile-container'>
            <PageTitle title={`${user.name || 'User'} || Profile`} />

            <div className="profile-image">
                <h1 className='profile-heading'>My Profile</h1>
                <img
                    src={user.avatar?.url || banner1}
                    alt="User Profile"
                    className="profile-image"
                />
                <Link to={'/profile/update'} className="edit-profile-link">
                    Edit Profile
                </Link>
            </div>

            <div className="profile-details">
                <div className="profile-detail">
                    <h2>Name</h2>
                    <p>{user.name || 'N/A'}</p>
                </div>

                <div className="profile-detail">
                    <h2>Email</h2>
                    <p>{user.email || 'N/A'}</p>
                </div>

                <div className="profile-detail">
                    <h2>Joined On</h2>
                    <p>
                        {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'N/A'
                        }
                    </p>

                </div>

                <div className="profile-buttons">
                    <Link to={'/orders/user'}>My Orders</Link>
                    <Link to={'/update/password'}>Update Password</Link>
                </div>
            </div>
        </div>
    );
};