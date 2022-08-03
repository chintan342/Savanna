import React, { Component, createContext } from 'react';
import api from '../lib/api';


export const NftDataContext = createContext();


export class NftDataContextProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false
        }
    }

    handleLoading = () => this.setState({loading: !this.state.loading})

    getNftData = async() => {
        try {
            const response = await api.get('/nft/all');
            console.log(response.data.data);
            this.setState({
                data: response.data.data
            })
        } catch(err) {
            console.log(err);
        }
    }
  render() {
    const {children} = this.props;
    return (
      <NftDataContext.Provider value={{...this, ...this.state}}>
        {children}
      </NftDataContext.Provider>
    )
  }
}

export default NftDataContextProvider;