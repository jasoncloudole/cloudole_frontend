import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import React, {useEffect, useState} from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";

import Barcode from 'react-barcode'
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';
import LinearProgress from '@material-ui/core/LinearProgress';
import ProductDetailsComponent from './ProductDetails';
import { SwipeableDrawer } from '@material-ui/core';
import axios from 'axios'
import { useSnackbar } from 'notistack';

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default function Products() {
  // eslint-disable-next-line
  let { path, url } = useRouteMatch();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [open, setOpen] = useState(false)
  const columns = [
    { field: 'variant_id', hide: true },
    {
      field: 'barcode',
      headerName: 'Barcode',
      renderCell: (params) => (
        <Barcode value={params.value} height={45}/>
      ),
      width: 150,
    },
    {
      field: 'title',
      headerName: 'Name',
      width: 300,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',

    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
    },
    { 
      field: 'product_id',
      headerName: 'Action',
      renderCell: (params) => (
        <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={()=>{history.push(`/product/${params.data.barcode}`)}}
      >
        Buy
      </Button>    
      ),
    },
  ]
  useEffect(() => {
    if (!products){
      setLoading(true);
      axios.get('/productList', {headers:{
        shopifyToken: Cookies.get('shopifyToken'),
        shopifyShopName: Cookies.get('shopifyShopName'),
        email: Cookies.get('email')
      }}).then(function (response) {
        setProducts(Object.values(response.data).map((row, id) => ({...row, id:id})));
        enqueueSnackbar('Loaded products!', { 
            variant: 'success',
        });
        setLoading(false);
      })
      .catch(function () {
        setLoading(false);
        enqueueSnackbar('Server error, unable to load products', { 
            variant: 'error',
        });
      });
    }

  },[enqueueSnackbar, products]);
  const handleRowClick = (RowParams) =>{
    setProductDetails(RowParams.data);
    setOpen(true);
    // history.push(`/product/${RowParams.data.barcode}`);
  }
  return (
    <React.Fragment>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          components={{
            loadingOverlay: CustomLoadingOverlay,
          }}
          loading={loading}
          columns={columns}
          rows={products || []}
          onRowClick={handleRowClick}
        />
      </div>
      <SwipeableDrawer
        anchor='right'
        open={open}
        onClose={() => setOpen(false)}
      >
        <ProductDetailsComponent {...productDetails} setOpen={setOpen} setProducts={setProducts}/>
      </SwipeableDrawer>
    </React.Fragment>
  );
}