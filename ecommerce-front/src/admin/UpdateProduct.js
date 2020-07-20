import React, {useState, useEffect} from 'react'
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth'
import {Link, Redirect} from 'react-router-dom'
import {getProduct, getCategories, updateProduct} from './apiAdmin'
import {read} from '../core/apiCore'

const UpdateProduct = ({match}) => {
  const [product, setProduct] = useState({})
  const [err, setErr] = useState(false)

  const loadSingleProduct = productId => {
    read(productId).then(data => {
      if(data.err) {
        setErr(data.err)
      } else {
        setProduct(data)
      }
    })
  }

  const [values, setValues] = useState({
    name: '',
	  description: '',
	  price: '',
	  categories: [],
    category: '',
    shipping: '',
	  quantity: '',
	  photo: '',
    loading: false,
    error: '',
    createdProduct: '',
    redirectToProfile: false,
    formDate: ''
  })

  const {user, token} = isAuthenticated()
  const {
    name,
		description,
		price,
    categories,
    category,
    shipping,
		quantity,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData
  } = values

  const init = (productId) => {
    getProduct(productId).then(data => {
      if(data.error) {
        setValues({...values, error: data.error})
      } else {
        // populate the state
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          shipping: data.shipping,
          quantity: data.quantity,
          formData: new FormData()
        })
        // load categories
        initCategories()
      }
    })
  }

  // load categories and set form FormData
  const initCategories = () => {
    getCategories().then(data => {
      if(data.error) {
        setValues({...values, error: data.error})
      } else {
      console.log(data)
        setValues({categories: data, formData: new FormData()})
      }
    })
  }

  useEffect(() => {
    const productId = match.params.productId
    init(productId)
    loadSingleProduct(productId)
  }, [])

  const handleChange = name => event => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value
    if (name == 'price') {
      formData.set(name, parseFloat(value).toFixed(2))
      setValues({...values, [name]: value})
    } else if (name == 'quantity') {
      formData.set(name, parseFloat(value).toFixed(0))
      setValues({...values, [name]: parseFloat(value).toFixed(0)})
    } else {
      formData.set(name, value)
      setValues({...values, [name]: value})
    }

  }

  const clickSubmit = event => {
    event.preventDefault()
    setValues({...values, error: '', loading: true})
    updateProduct(match.params.productId, user._id, token, formData)
    .then(data => {
      if(data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({
          ...values,
          name: '',
      		description: '',
          photo: '',
      		price: '',
          quantity: '',
          loading: false,
          error: false,
          redirectToProfile: true,
          createdProduct: data.name,
        })
      }
    })
  }

  const showOptions = (c, i) => {
    if (c.name == product.category.name) {
      return(
        <option key={i} value={c._id} selected>{c.name}</option>
      )
    } else {
      return(
        <option key={i} value={c._id}>{c.name}</option>
      )
    }
  }

  const newPostForm = () => {
    return(
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label onChange={handleChange('photo')} className="btn btn-secondary">
        <input type="file" name="photo" accept="image/*"/>
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
      </div>

      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea onChange={handleChange('description')} className="form-control" value={description} />
      </div>

      <div className="form-group">
        <label className="text-muted">Price</label>
        <input onChange={handleChange('price')} type="number" step="0.01" className="form-control" value={price} />
      </div>

      <div className="form-group">
        <label className="text-muted">Category</label>
        <select onChange={handleChange('category')} className="form-control" >

          <option>Please select</option>
          {product.category && categories.map((c, i) => showOptions(c,i))}

        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Shipping</label>
        <select onChange={handleChange('shipping')} className="form-control" >
          <option>Please select</option>
          <option value="0">No</option>
          <option value="1" selected>yes</option>
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input onChange={handleChange('quantity')} type="number" step="1" className="form-control" required value={quantity} />
      </div>

      <button className="btn btn-outline-primary">Update Product</button>
    </form>
  )}

  const showError = () => (
    <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
      {error}
    </div>
  )

  const showSuccess = () => (
    <div className="alert alert-info" style={{display: createdProduct ? '' : 'none'}}>
      <h2>{`${createdProduct}`} is updated!</h2>
    </div>
  )

  const showLoading = () => (
    loading && (
      <div className="alert alert-success">
        <h2>Loading...</h2>
      </div>)
  )

  const redirectUser = () => {
    if(redirectToProfile) {
      if(!error) {
        return <Redirect to="/" />
      }
    }
  }

  return (
    <Layout title="Add a new product" description={`Hello ${user.name}, ready to add a new product?`} >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostForm()}
          {redirectUser()}
        </div>
      </div>

    </Layout>
  )
}

export default UpdateProduct
