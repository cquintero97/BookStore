import React, {useState, useEffect} from 'react'
import Layout from './Layout'
import {checkStock, getProducts, getBraintreeClientToken, processPayment, createOrder} from './apiCore'
import {emptyCart} from './cartHelpers'
import Card from './Card'
import {isAuthenticated} from '../auth'
import {Link} from 'react-router-dom'
import DropIn from 'braintree-web-drop-in-react'


const Checkout = ({products, setRun = f => f, run = undefined}) => {
  const [error, setError] = useState(false)
  const [mydata, setData] = useState({
    loading: false,
    successPurchase: false,
    clientToken: null,
    error: '',
    instance: {},
    address: ''
  })

  const userId = isAuthenticated() && isAuthenticated().user._id
  const token = isAuthenticated() && isAuthenticated().token

  const getToken = (userId, token) => {
    // console.log("inside getoken");
    // console.log(mydata)
    getBraintreeClientToken(userId, token).then(data => {
      if(data.error) {
        // console.log("inside error")
        setData({...mydata, error: data.error})
      } else {
        // console.log("inside else")
        // console.log(mydata)
        setData({...mydata, clientToken: data.clientToken})
        // console.log(mydata)

      }
    })
  }

  useEffect(() => {
    getToken(userId, token)
  }, [run])

  const handleAddress = (event) => {
      setData({...mydata, address: event.target.value})
    }

  const getTotal = () => {
    let total =  products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price
    }, 0)
    return total.toFixed(2)
  }

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Signin to checkout</button>
      </Link>
    )
  }

  // const checkCartAvailability = () => {
  //   if (products
  //       .filter((p)=> {
  //         console.log(p._id)
  //         let pStock
  //         checkStock(p._id).then(data => {
  //           pStock = data
  //           console.log(pStock)
  //         }).then(() => {
  //           if (p.count > pStock) {
  //             alert(`Sorry! "${p.name}" only has ${pStock} copy(ies) available. Please adjust your cart.`)
  //             return 1
  //           } else {
  //             return 0
  //           }
  //         })
  //       })
  //       .length > 0) {
  //         console.log("not enough in stock")
  //         return false
  //   } else {
  //     console.log("enough in stock")
  //     return true
  //   }
  // }

  const checkCartAvailability = (amount) => {
    return new Promise ((resolve, reject) => {
      // while (1) {
        checkStock(products[amount]._id).then((data) => {
          if (products[amount].count > data){
            alert(`Sorry! "${products[amount].name}" only has ${data} copy(ies) available. Please adjust your cart.`)
            reject(data)
          } else {
            resolve(data)
          }
        })
      // }
    })
  }

  function scanCart(amount) {
    if (amount == 0){
      return Promise.resolve()
    }
    return checkCartAvailability(amount-1).then(() => {
      return scanCart(amount - 1)
    }).catch(() => {
      return Promise.reject()
    })
  }

  let deliveryAddress = mydata.address

  const buy = () => {
    console.log(products.length)
    scanCart(products.length).then(() => {
      setData({loading: true})
      // send the nonce to your Server
      // nonce = data.instance.requestPaymentMethod()
      let nonce
      let getNonce = mydata.instance.requestPaymentMethod()
      .then(data => {
        // console.log("inside nonce", data)
        nonce = data.nonce
        // once you have nonce (card type, card number), send nonce as 'paymentMethodNonce'
        // and also total to be charged
        // console.log('send nonce and total to process: ', nonce, getTotal(products))
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products)
        }

        processPayment(userId, token, paymentData)
        .then(response => {
          console.log(response)
          // empty cart
          // create order

          const createOrderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount,
            address: deliveryAddress
          }

          createOrder(userId, token, createOrderData)
          .then(response => {

            emptyCart(() => {

              console.log('payment success and empty cart')
              setData({
                loading: false,
                successPurchase:true
              })
              setRun(!run)
            })
          })
        })
        .catch(error => {
          console.log(error)
          setData({loading: false, successPurchase: false})
        })
      })
      .catch(error => {
        console.log('dropin error: ', error)
        setData({...mydata, error: error.message})
      })
    }).catch(error => {
      console.log("not enough")
    })
  }

  const showDropIn = () => (
    <div onBlur={() => setData({...mydata, error: ''})}>
      {mydata.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="gorm-group mb-3">
            <label className="text-muted">Delivery address:</label>
            <textarea onChange={handleAddress} className="form-control" value={mydata.address} placeholder="Type your delivery address here ..." />
          </div>
          <DropIn options={{
              authorization: mydata.clientToken,
              paypal: {
                flow: 'vault'
              }
            }} onInstance={instance => (mydata.instance = instance)} />
          <button onClick={buy} className="btn btn-success btn-block">Pay</button>
        </div>
      ) : null}
    </div>
  )

  const showError = error => (
    <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
      {error}
    </div>
  )

  const showSuccess = successPurchase => (
    <div className="alert alert-info" style={{display: successPurchase ? '' : 'none'}}>
      Thanks! Your payment was successful!
    </div>
  )

  const showLoading = (loading) => (
    loading && (<h2>Loading...</h2>)
  )

  return <div>
    <h2>Total: ${getTotal()} </h2>
    {showLoading(mydata.loading)}
    {showSuccess(mydata.successPurchase)}
    {showError(mydata.error)}
    {showCheckout()}
  </div>
}

export default Checkout
