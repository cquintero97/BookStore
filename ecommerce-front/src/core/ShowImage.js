import React from 'react'
import {API} from '../config'

const ShowImage = ({item, url}) => (
  <div  className="product-img">
    <img src={`${API}/${url}/photo/${item._id}`} alt={item.name} className="mb-3" style={{maxHeight: '200px', maxWidth: '100%', cursor: "pointer"}} onClick={() => {
        window.location.href = `/product/${item._id}`;
      }} />
  </div>
)

export default ShowImage
