
import React, { useEffect, useState } from 'react';
import '../styles/componentStyles/Navbar.css';
import '../styles/pageStyles/Search.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Search from '@mui/icons-material/Search';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Close from '@mui/icons-material/Close';
import Menu from '@mui/icons-material/Menu';

const NavBar = () => {
    // const
    const [isMenuOpened, setIsMenuOpened] = useState(false);
     const [isSearchOpen,setIsSearchOpen]=useState(false);
     const [searchQuery,setSearchQeury]=useState('');
     const [navbarclasses,setNavbarclasses]=useState('navbar')
     const toggleSearch=()=>setIsSearchOpen(!isSearchOpen);
    const {isAuthenticated}=useSelector(state=>state.user)
    const {cartItems}=useSelector(state=>state.cart)
    const navigate=useNavigate()
    const toggleMenu = () => {
        setIsMenuOpened(!isMenuOpened)
    }
    const closeMenu = () => {
        setIsMenuOpened(false)
    }
    const handleSubmit=e=>{
        e.preventDefault();
        if(searchQuery.trim()){
            navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)


        }
        else{
            navigate('/prdoucts')
        }
        setSearchQeury('');
    };
    useEffect(()=>{
if(!isAuthenticated){
    setNavbarclasses('navbar isNotAuth');
}
    },[isAuthenticated])
    //
    return (
        <nav className={navbarclasses}>
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to='/' onClick={closeMenu}>ShopFast</Link>
                </div>
                <div className={isMenuOpened ? 'navbar-links active' : 'navbar-links'}>
                    <ul>
                        <li onClick={closeMenu}>
                            <Link to='/'>Home</Link>
                        </li >
                        <li onClick={closeMenu}>
                            <Link to='/products'>Products</Link>
                        </li>
                        <li onClick={closeMenu}>
                            <Link to='/about-us'>About Us</Link>
                        </li >
                        <li onClick={closeMenu}>
                            <Link to='/contact-us'>Contact Us</Link>
                        </li>
                    </ul>
                </div>
                <div className="search-container">
                    <form className={`search-form ${isSearchOpen?'active':''}`}  onSubmit={handleSubmit}>
                        <input type="text"
                            name="search"
                            id="search"
                            className='search-input'
                            placeholder='search Products...'
                            value={searchQuery}
                            onChange={(e)=>setSearchQeury(e.target.value)}
                            />
                        <button type="button" className='search-btn' onClick={toggleSearch}>
                            <Search className='icon' focusable={false} />
                        </button>
                    </form>
                </div>
                <div className="cart-container">
                    <Link to='/cart'>
                        <ShoppingCart className='icon' />
                        <span className= {cartItems.length===0?'':'cart-badge'}>{cartItems.length===0?'':cartItems.length} </span>
                    </Link>
                </div>
                {!isAuthenticated && <Link className='register-link' to='/register'>
                    <PersonAdd className='icon' />
                </Link>}
                <div className="hamburger-container">
                    <div className="navbar-hamburger">
                        {isMenuOpened ?
                            <Close className='icon' onClick={toggleMenu} /> :
                            <Menu className='icon' onClick={toggleMenu} />}
                    </div>
                </div>
            </div>

        </nav>
    )
}
export default NavBar;
