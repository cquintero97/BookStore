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
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill">In Stock</span>
    ) : (
      <span className="badge badge-primary badge-pill">Out of Stock</span>
    )
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
    <div className="card">
      <div className="card-header name">{product.name}</div>
      <div className="card-body">
      {shouldRedirect(redirect)}
      <ShowImage item={product} url="product" />
        <ShowMoreText
                  /* Default options */
                  lines={pagecheck(page)}
                  more='Show more'
                  less='Show less'
                  anchorClass=''
                  /*onClick={executeOnClick(true)}*/
                  expanded={false}
                  width={280}
              >{product.description.substring(0, 100)}</ShowMoreText>

        <p className="black-10">${product.price}</p>
        <p className="black-9">Category: {product.category && product.category.name}</p>
        <p className="black-8">Added {moment(product.createdAt).fromNow()}</p>

        {showStock(product.quantity)}
        <br />

        {showViewButton(showViewProductButton)}

        {showAddToCart(showAddToCartButton)}

        {showRemoveButton(showRemoveProductButton)}

        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  )
}

export default Card
