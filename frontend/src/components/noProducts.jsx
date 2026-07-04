
import { Link } from 'react-router-dom';
import '../styles/componentStyles/NoProducts.css';

import ReportProblem from '@mui/icons-material/ReportProblem';

const NoProducts = ({ keyword }) => {
    return (
        <div className="no-products-content">
            <div className="">
                <ReportProblem className='no-products-icon' />
            </div>
            <h1 className="no-products-title">No products Found</h1>
            <p className="no-products-message">
                {keyword ?
                    <>
                        `we couldn't find any products matching the keyword "{keyword}" plesae try using different keyword or browse our complete catalog from`
                        <Link to={'/products'} className='explore-btn'> here </Link>
                    </> :
                    <>
                        No products availale. please check back
                    </>}
            </p>
        </div>
    )

}
export default NoProducts;