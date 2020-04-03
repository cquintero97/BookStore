import React, {useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import ShowImage from './ShowImage'
import moment from 'moment'
import {addItem, updateItem, removeItem} from './cartHelpers'
import ShowMoreText from 'react-show-more-text';

const Card = ({page, product, showViewProductButton=true, showAddToCartButton = true, cartUpdate=false, showRemoveProductButton=false, setRun = f => f, run = undefined}) => {
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
    if(page=="productPage")
      return 0
    else
      return 1
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
        <button onClick={() => {
            removeItem(product._id)
            setRun(!run)
          }
          } className="btn btn-outline-danger mt-2 mb-2 mr-2">
          Remove Product
        </button>
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
    setCount(event.target.value < 1 ? 1 : event.target.value)
    if(event.target.value >= 1) {
      updateItem(productId, event.target.value)
    }
  }

  const showCartUpdateOptions = (cartUpdate) => {
    return cartUpdate && <div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Adjust Quantity</span>
        </div>
        <input type="number" className="form-control" value={count} onChange={handleChange(product._id)} />
      </div>
    </div>
  }

  return (
    <div className="product">
      <div className="card" item={product} url="product" onClick={() => {
          window.location.href = `/product/${product._id}`;
        }} style={{cursor: "pointer"}}>

        <ShowImage item={product} url="product" />
      </div>

      <div className="mt-2 mb-0 name">{product.name}</div>
      {showStock(product.quantity)}
      <div className="price">${product.price}</div>


    </div>
  )
}

export default Card
