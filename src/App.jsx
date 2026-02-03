import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import InventoryList from './components/InventoryList.jsx';
import AddProductForm from './components/AddProductsForm.jsx';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    const { data } = await supabase
      .from('products')
      .select('id, name, price, categories ( name )');
    setProducts(data || []);
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>SuperMarket Inventory Manager</h1>
      <AddProductForm onProductAdded={fetchInventory} />
      <InventoryList products={products} refreshData={fetchInventory} />
    </div>
  );
}

export default App;