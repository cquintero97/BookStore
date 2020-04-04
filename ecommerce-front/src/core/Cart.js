import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Layout from './Layout'
import {getCart, removeItem} from './cartHelpers'
import Card from './Card'
import Checkout from './Checkout'

const Cart = () => {
  const [items, setItems] = useState([])
  const [run, setRun] = useState(false)

  useEffect(() => {
    setItems(getCart())
  }, [run])

  const showItems = items => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr/>
        {items.map((product, i) => (<Card style={{cursor: ""}}cartPage={true} key={i} product={product} showAddToCartButton={false} cartUpdate={true} showRemoveProductButton={true} setRun={setRun} run={run}/>))}
      </div>
    )
  }

  const noItemsMessage = () => (
    <h2>Your cart is empty. <br/> <Link to="/shop">Continue shopping</Link></h2>
  )

  return (
    <Layout title="Shopping Cart" description="Manage your cart items. Add remove checkout or continue shopping." className="container-fluid layout">
      <div className="row ">
        <div className="col-lg-6 col-md-6 col-sm-12">
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12" style={{ paddingBottom: 50}}>
          <h2 className="mb-2">Your cart summary</h2>
          <hr/>
          <Checkout products={items} setRun={setRun} run={run} />
        </div>
      </div>
    </Layout>
  )
}

export default Cart
