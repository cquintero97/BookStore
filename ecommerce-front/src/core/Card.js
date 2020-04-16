import React, {useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import ShowImage from './ShowImage'
import moment from 'moment'
import {addItem, updateItem, removeItem} from './cartHelpers'
import ShowMoreText from 'react-show-more-text';

const Card = ({cartPage=false, product, showViewProductButton=true, showAddToCartButton = true, cartUpdate=false, showRemoveProductButton=false, setRun = f => f, run = undefined}) => {
  const [redirect, setRedirect] = useState(false)
  const [count, setCount] = useState(product.count)

  const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn btn-outline-primary mt-2 mb-2">
            View Product
          </button>
        </Link>
      )
    )
  }

  const pagecheck = (page) => {
    return (page=="productPage") ?
     0
    :
    1
  }

  const executeOnClick = (isExpanded) => {
        console.log(isExpanded);
    }

  const addToCart = () => {
    addItem(product, () => {
      setRedirect(true)
    })
  }

  const shouldRedirect = redirect => {
    if(redirect) {
      return <Redirect to="/cart" />
    }
  }

  const showAddToCart = (showAddToCartButton) => {
    return (
      showAddToCartButton && (
        <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2 mr-2">
          Add to cart
        </button>
      )
    )
  }

  const showRemoveButton = (showRemoveProductButton) => {
    return (
      showRemoveProductButton && (
        <div className="removeButton">
          <button onClick={() => {
              removeItem(product._id)
              setRun(!run)
            }
          } className="btn btn-sm btn-outline-danger">
            Remove Product
          </button>
        </div>
      )
    )
  }

  const showStock = (quantity) => {
    if (!quantity) {
      return (
        <div className="badge badge-danger badge-pill stock">Out of Stock</div>
      )
    }
  }

  const handleChange = (productId) => event => {
    setRun(!run)
    let val = parseFloat(event.target.value).toFixed(0) // ensures only whole nums
    setCount(val < 1 || val == 'NaN' ? 1 : val)
    if (val == 'NaN'){ //when user selects input and presses 'delete' key
      val = 1
    }
    if(val >= 1) {
      updateItem(productId, val)
    }
  }

  const showCartUpdateOptions = (cartUpdate) => {
    return cartUpdate &&
      <div className="input-group input-group-sm mb-3 cartquantity">
        <div className="input-group-prepend">
          <span className="input-group-text">Quantity</span>
        </div>
        <input type="number" className="form-control"  value={count} onChange={handleChange(product._id)} />
      </div>
  }

  const showCartOptions = () => {
    if (cartPage){
      return (
        <div>
          <div className="mt-2 mb-0 name">{product.name}</div>
          {showStock(product.quantity)}
          <div className="price">${product.price}</div>
          {showCartUpdateOptions(cartUpdate)}
          {showRemoveButton(showRemoveProductButton)}
        </div>
      )
    }
  }

  const showSearchOptions = () => {
    if (!cartPage){
      return (
        <div>
          <div className="mt-2 mb-0 name">{product.name}</div>
          {showStock(product.quantity)}
          <div className="price">${product.price}</div>
          {showCartUpdateOptions(cartUpdate)}
          {showRemoveButton(showRemoveProductButton)}
        </div>
      )
    }
  }

  const handleCardClick = (cartPage) => {
    if (cartPage){
      window.location.href = `/product/${product._id}`;
    }
  }

  const showCardOptions = () => {
    if (!cartPage) {
      return (
          <div className="card" item={product} url="product" onClick={() => {
              window.location.href = `/product/${product._id}`;
            }} style={{cursor: "pointer"}}>

            <ShowImage item={product} url="product" />
            {showCartOptions()}
          </div>
      )
    } else {
      return (
        <div className="card" item={product} url="product">

          <ShowImage item={product} url="product" />
          {showCartOptions()}
        </div>
      )
    }
  }

  return (
    <div className="product">
      {showCardOptions()}
      {showSearchOptions()}

    </div>
  )
}

export default Card
