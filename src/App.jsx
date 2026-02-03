import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import InventoryList from './components/InventoryList.jsx';
import AddProductForm from './components/AddProductsForm.jsx';

function App() {
  const [products, setProducts] = useState([]);

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, categories ( name )');

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchInventory();
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Change received!', payload);
          fetchInventory();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Supermarket Inventory Manager</h1>
      <AddProductForm onProductAdded={fetchInventory} />
      <InventoryList products={products} refreshData={fetchInventory} />
    </div>
  );
}

export default App;