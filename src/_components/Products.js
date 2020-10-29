import React, {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import axios from 'axios'
import Barcode from 'react-barcode'
import { useSnackbar } from 'notistack';
import LinearProgress from '@material-ui/core/LinearProgress'

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
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);    
  const [loading, setLoading] = useState(false);
  const columns = [
    { field: 'product_id', hide: true },
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

      type: 'number'
    },
  ]
  useEffect(() => {
    setLoading(true);
    axios.get('/productList', {headers:{
      shopifyToken: Cookies.get('shopifyToken'),
      shopifyShopName: Cookies.get('shopifyShopName')
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
  },[enqueueSnackbar]);
  return (
    <React.Fragment>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          components={{
            loadingOverlay: CustomLoadingOverlay,
          }}
          loading={loading}
          columns={columns}
          rows={products}
        />
      </div>
    </React.Fragment>
  );
}