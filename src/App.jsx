import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import InventoryList from './components/InventoryList.jsx';
import AddProductsForm from './components/AddProductsForm.jsx';
import OrderingScreen from './components/OrderingScreen.jsx';
import RestockScreen from './components/RestockScreen.jsx';
import SupplierDirectory from './components/SuppliersDirectory.jsx';

function App() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('admin');

  const fetchInventory = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, name, price, quantity, categories ( name )')
      .order('name', { ascending: true });
    setProducts(data || []);
  };

  const navBtnStyle = (isActive) => ({
    padding: '10px 20px',
    margin: '0 5px',
    backgroundColor: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? 'white' : 'black',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: '0.2s'
  });

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

  const renderView = () => {
    switch (view) {
      case 'admin':
        return (
          <>
            <h1>Inventory Admin</h1>
            <AddProductsForm onProductAdded={fetchInventory} />
            <InventoryList products={products} refreshData={fetchInventory} />
          </>
        );
      case 'customer':
        return <OrderingScreen products={products} refreshData={fetchInventory} />;
      case 'restock':
        return <RestockScreen products={products} refreshData={fetchInventory} />;
      case 'suppliers':
        return <SupplierDirectory />;
      default:
        return <div>Select a view from the menu.</div>;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ marginBottom: '30px', textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <button onClick={() => setView('admin')} style={navBtnStyle(view === 'admin')}>Admin</button>
        <button onClick={() => setView('customer')} style={navBtnStyle(view === 'customer')}>Storefront</button>
        <button onClick={() => setView('restock')} style={navBtnStyle(view === 'restock')}>Restock</button>
        <button onClick={() => setView('suppliers')} style={navBtnStyle(view === 'suppliers')}>Suppliers</button>
      </nav>

      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;