import { supabase } from '../supabaseClient';

export default function InventoryList({ products, refreshData }) {
  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting:", error);
    } else {
      refreshData();
    }
  };

  return (
    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f4f4f4' }}>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.categories?.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>
              <button onClick={() => handleDelete(item.id)} style={{ color: 'red' }}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}