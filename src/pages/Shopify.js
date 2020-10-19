import React, { Component } from 'react'
import axios from 'axios'

export class Shopify extends Component {
    state = {
        token: String
    }
    
      componentDidMount() {
        axios.get('/token')
          .then(res => {
            this.setState({
              token: res.data
            })   
            console.log(this.state.token)        
          })
          .catch((err) => {
            console.log(err)
          }
          )
      }
    render() {
        return (
            <div>
                shopify{this.state.token}  HI
            </div>
        )
    }
}

export default Shopify
