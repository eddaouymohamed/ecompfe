import { useNavigate } from 'react-router-dom';
import '../styles/UserStyles/UserDashboard.css'
import banner1 from '/images/banner1.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { logout, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
export const UserDashboard=({user})=>{
    const [menuVisble,setMenuVisble]=useState(false);
    const {cartItems}=useSelector(state=>state.cart);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const options=[
        {
            name:'orders',funcName:orders
        },
         {
            name:'Account',funcName:profile
        },
        {
            name:`Cart (${cartItems.length})`,funcName:myCart,isCart:true
        },
        {
            name:'logout',funcName:logoutUser
        }
    ]
    if( user && user.role==='admin'){
        options.unshift(
           {name:'Admin DashBoard',funcName:dashboard}
        )
    }
function orders(){
    navigate('/orders/user')
    toggleMenu()
}
function profile(){
    navigate('/profile')
    toggleMenu()
}
function myCart(){
    navigate('/cart')
    toggleMenu()

}
function logoutUser(){
    dispatch(logout()).
    unwrap().
    then(()=>{
        toast.success('logout succefully',{position:'top-center',autoClose:3000})
        dispatch(removeSuccess())
        navigate('/login')
    }).catch((error)=>{
toast.error(error.message|| 'Logout failed',{position:'top-center',autoClose:3000})
    })
    navigate('/login')
}
function dashboard(){
    navigate('/admin/dashboard')
    toggleMenu()
}
const toggleMenu=()=>{
    setMenuVisble(!menuVisble)
}
useEffect(()=>{
console.log(user.name)
},[])
return(
<>
<div className={`overlay ${menuVisble?'show':''}`}></div>

    <div className="profile-header small-screen">
<img src={user.avatar.url?user.avatar.url:banner1} alt='profile picture'
className='profile-avatar'
onClick={toggleMenu}
 />
 <span className='profile-name small-screen'>{user.name? user.name:'USER'} </span>
    </div>
   {menuVisble&&  <div className="menu-options">
       {options.map(option=>(
         <button className={`menu-option-btn ${option.isCart?(cartItems.length>0?'cart-not-empty':''):''}`} key={option.name} onClick={option.funcName} >{option.name}
        </button>
       ))}
    </div>}
</>
    )
}