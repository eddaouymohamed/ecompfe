
import React, { useEffect } from 'react';
import '../styles/AdminStyles/UsersList.css';
import PageTitle from '../components/pageTitle';
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, fetchUsers, removeErrors, removeMessage, removeSucces } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import Loader from '../components/loder';
import { Link, useNavigate } from 'react-router-dom';

import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';

import Button from '@mui/material/Button';


function AllUsers() {
    const { loading, error, success, users,deleting,message } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const navigate=useNavigate()
        useEffect(() => {
        dispatch(fetchUsers())

    }, [dispatch])
    useEffect(() => {
        if(message  && success){
            toast.success(message,{position:'top-center',autoClose:3000})
            dispatch(removeMessage());
            navigate('/admin/dashboard');


        }

        if (success) {
            dispatch(removeSucces());
        }
    }, [success, dispatch])
    useEffect(() => {
        if (error) {
            toast.error(error || 'an error while fetching userslist');
            dispatch(removeErrors())
        }

    }, [error, dispatch])
    const deleteUserHandler=id=>{
        const isConfirmed=window.confirm('Are you sure you want to delete this user ?');
        if(!isConfirmed) return;
        dispatch(deleteUser(id));
    }
    if (!users) {
        return (
            <div className="usersList-container">
                <h1 className='usersList-title'> All Users</h1>
                <p className="no-admin-usersList">
                    there are no Users
                </p>
            </div>
        )
    }
    return (
        <>
            <PageTitle title={"All USERS"} />
            {loading ? <Loader /> : (
                <>
                    <NavBar />
                    {users &&
                        <div className="usersList-container">
                            <h1 className='usersList-title'> All Users</h1>
                            <div className="usersList-table-container">
                                <table className="usersList-table">
                                    <thead>
                                        <tr>
                                            <th>S1 No</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>CreatedAt</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={index}>
                                                <td>{index + 1} </td>
                                                <td>{user.name} </td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{new Date(user.createdAt).toLocaleString()}</td>
                                                <td className='last-td'>
                                                    <Link className='edit-icon action-icon' to={`/admin/user/${user._id}`}>
                                                        <Edit />
                                                    </Link>
                                                    <Button className='delete-icon action-icon' onClick={()=>deleteUserHandler(user._id)} >
                                                       {deleting[user._id] ? <Loader/>: <Delete />}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                </table>
                            </div>

                        </div>}
                    <Footer />
                </>
            )
            }
        </>
    )
}

export default AllUsers;