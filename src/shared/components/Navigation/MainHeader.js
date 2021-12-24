// container to hold the page header
import React, { useContext } from 'react';
import { AuthContext } from '../../context/auth-context';

import './MainHeader.css';

const MainHeader = props => {
    const auth = useContext(AuthContext);

    return <header className={`main-header ${auth.isAdmin ? "main-header-admin" : ''}`}>
        {props.children}
    </header>;
};

export default MainHeader;
