import React, {useState, useEffect} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Layout from './Layout'
import {read, listRelated} from './apiCore'
import Card from './Card'
import ShowImage from './ShowImage'
import {addItem, updateItem, removeItem} from './cartHelpers'

const Product = (props) => {
  const [redirect, setRedirect] = useState(false)
  const [product, setProduct] = useState({})
  const [relatedProduct, setRelatedProduct] = useState([])
  const [error, setError] = useState(false)

  const loadSingleProduct = productId => {
    read(productId).then(data => {
      if(data.error) {
        setError(data.error)
      } else {
        setProduct(data)
        // fetch related products
        listRelated(data._id).then(data => {
          if(data.error) {
            setError(data.error)
          } else {
            setRelatedProduct(data)
          }
        })
      }
    })
  }

  const shouldRedirect = redirect => {
    if(redirect) {
      return <Redirect to="/cart" />
    }
  }

  const addToCart = () => {
    addItem(product, () => {
      setRedirect(true)
    })
  }

  const showAddToCart = () => {
    return product.quantity > 0 ? (
        <button onClick={addToCart} type="button" className="btn btn-info bt-sm">
          Add to cart
        </button>
    ) : (
      <button type="button" className="btn btn-info bt-sm addCart">
        Add to cart
      </button>
    )
  }

  const showAvailability = () => {
    return product.quantity > 0 ? (
      <p className="availability mt-2 mb-0 availability">Availability: <strong>In Stock</strong></p>
    ) : (
      <p className="availability mt-2 mb-0">Availability: <strong style={{color: 'red'}}>Out of Stock</strong></p>
    )
  }

  const showProductPrice = () => {
    return (
      <p className="product-price">Price: ${product.price}</p>
    )
  }

  useEffect(() => {
    const productId = props.match.params.productId
    loadSingleProduct(productId)
  }, [props])


  return (
    <Layout title={product && product.name} description={product && product.description && product.description.substring(0, 100)} className="productDetails container-fluid">
      <div className="row mb-4">
        <div className="col-md-6" >
          <div className="row justify-content-center">
            <div className="col">
              <div  className="card productCard" item={product} url="product">
                <ShowImage item={product} url="product" />
              </div>
            </div>
          </div>
          <div className="row">
            {shouldRedirect(redirect)}
            <div className="col">
              {showAvailability()}
            </div>
          </div>
          <div className="row">
            <div className="col">
              {showProductPrice()}
            </div>
            <div className="col">
              {showAddToCart()}
            </div>
          </div>
        </div>
        <div className="col-md-6" >
          <h1 style={{color: '#4682B4'}}>{product.name}</h1>
          <p>{product.description}</p>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col">
          <h4>Related Products</h4>
        </div>
      </div>
      <div className="row">
        {relatedProduct.map((p, i) => (
          <div key={i} className="col-lg-2 col-md-2 col-sm-2 col-xsm-2 mb-3">
            <Card  product={p} />
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Product
