import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import InventoryList from './components/InventoryList.jsx';
import AddProductsForm from './components/AddProductsForm.jsx';
import OrderingScreen from './components/OrderingScreen.jsx';

function App() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('admin')

  const fetchInventory = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, name, price, quantity, categories ( name )')
      .order('name', { ascending: true });
    setProducts(data || []);
  };

  useEffect(() => {
    fetchInventory();
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Database changed!', payload);
          fetchInventory();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <nav style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={() => setView('admin')} style={navBtnStyle(view === 'admin')}>Manage Inventory</button>
        <button onClick={() => setView('customer')} style={navBtnStyle(view === 'customer')}>Customer Storefront</button>
      </nav>

      {view === 'admin' ? (
        <>
          <h1>🛠 Inventory Admin</h1>
          <AddProductsForm onProductAdded={fetchInventory} />
          <InventoryList products={products} refreshData={fetchInventory} />
        </>
      ) : (
        <OrderingScreen products={products} refreshData={fetchInventory} />
      )}
    </div>
  );
}

const navBtnStyle = (isActive) => ({
  padding: '10px 20px',
  margin: '0 5px',
  backgroundColor: isActive ? '#007bff' : '#f8f9fa',
  color: isActive ? 'white' : 'black',
  border: '1px solid #ddd',
  cursor: 'pointer'
});

export default App;