import React, {Fragment} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {signout, isAuthenticated} from '../auth'
import {itemTotal} from './cartHelpers'
import Search from './Search'

const isActive = (history, path) => {
  if(history.location.pathname === path) {
    return {color: '#ff9900'}
  } else {
    return {}
  }
}

const Menu = ({history}) => (
  <nav className="navbar navbar-expand-lg navbar-dark">
    <a className="navbar-brand" href="/">BookStore</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="nav-link" style={isActive(history, '/')} to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" style={isActive(history, '/shop')} to="/shop">Shop</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" style={isActive(history, '/cart')} to="/cart">Cart <sup><small className="cart-badge">{itemTotal()}</small></sup></Link>
        </li>

        {isAuthenticated() && isAuthenticated().user.role === 0 && (
          <li className="nav-item">
            <Link className="nav-link" style={isActive(history, '/user/dashboard')} to="/user/dashboard">Dashboard</Link>
          </li>
        )}

        {isAuthenticated() && isAuthenticated().user.role === 1 && (
          <li className="nav-item">
            <Link className="nav-link" style={isActive(history, '/admin/dashboard')} to="/admin/dashboard">Dashboard</Link>
          </li>
        )}

        {!isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">Signin</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">Signup</Link>
            </li>
          </Fragment>
        )}

        {isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => signout(() => {history.push('/')})}>Signout</span>
            </li>
          </Fragment>
        )}
      </ul>
    </div>
  </nav>


)

export default withRouter(Menu)
