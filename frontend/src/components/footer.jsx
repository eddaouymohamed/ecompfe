
import '../styles/componentStyles/Footer.css';

import Mail from '@mui/icons-material/Mail';
import Phone from '@mui/icons-material/Phone';
import LinkedIn from '@mui/icons-material/LinkedIn';
import GitHub from '@mui/icons-material/GitHub';
import YouTube from '@mui/icons-material/YouTube';
import Email from '@mui/icons-material/Email';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section contact">
                    <h3>Contact US</h3>
                    <p className='phone'> <Phone className='social-icon' fontSize='small' />Phone: <a href="tel:+212 684305356">+212 684305356</a> </p>
                    <p className='email'> <Mail className='social-icon' fontSize='small' />Email: <a href="mailto:eddaouymohamed1234@gmail.com">eddaouymohamed1234@gmail.com</a></p>
                </div>
                <div className="footer-section social">
                    <h3>Follow me</h3>
                    <div className="social-links">
                        <a href='https://github.com/eddaouymohamed' target='_blank'>
                            <GitHub className='social-icon' />
                        </a>
                        <a href='https://linkedIn.com/in/mohamed-eddaouy-060239281' target='_blank'>
                            <LinkedIn className='social-icon' />
                        </a>
                        <a href='www.youtube.com/@MohamedEd-daouy-ep1qc' target='_blank'>
                            <YouTube className='social-icon' />
                        </a>
                        <a href="mailto:eddaouymohamed1234@gmail.com?subject=Bonjour&body=Votre message ici" target='_blank'>
                            <Email className='social-icon' />
                        </a>

                    </div>
                </div>
                <div className="footer-section about">
                    <h3>About</h3>
                    <p>Découvrez ShopFast, votre destination en ligne pour des achats simples et rapides. Nous proposons une large gamme de produits sélectionnés avec soin afin de répondre à vos besoins tout en garantissant qualité, sécurité et satisfaction.</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy 2025 eddaouyMoahmed. All rights reserved</p>
            </div>
        </footer>

    )
}
