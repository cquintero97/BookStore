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
    return product.quantity > 1 ? (
        <button onClick={addToCart} type="button" className="btn btn-info bt-sm mt-2 mb-2 mr-0 addCart">
          Add to cart
        </button>
    ) : (
      <button type="button" className="btn btn-info bt-sm mt-2 mb-2 mr-0 addCart">
        Add to cart
      </button>
    )
  }

  const showAvailability = () => {
    return product.quantity > 1 ? (
      <p className="availability mt-2 mb-0">Availability: <strong>In Stock</strong></p>
    ) : (
      <p className="availability mt-2 mb-0" align="left">Availability: <strong style={{color: 'red'}}>Out of Stock</strong></p>
    )
  }

  useEffect(() => {
    const productId = props.match.params.productId
    loadSingleProduct(productId)
  }, [props])


  return (
    <Layout title={product && product.name} description={product && product.description && product.description.substring(0, 100)} className="container-fluid">
      <div  className="productDetails">
        <div className="row mb-4 justify-content-md-center">
          <div className="col-md-6" >
            <div className="card ml-5 mr-5" item={product} url="product">
              <ShowImage item={product} url="product" />
            </div>
            <div className="ml-5 mr-5" >
              {shouldRedirect(redirect)}
              {showAvailability()}
              <p className="product-price mt-3 mb-1" align="left">Price: ${product.price}</p>
              {showAddToCart()}

            </div>
            <div>

            </div>
          </div>
          <div className="col-md-6" >
            <h1>{product.name}</h1>
            <p>{product.description}</p>
          </div>
        </div>
        <div className="row">
          <h4>Related Products</h4>
        </div>
        <div className="row">
          {relatedProduct.map((p, i) => (
            <div className="mb-3">
              <Card key={i} product={p} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Product
