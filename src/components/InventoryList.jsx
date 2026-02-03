import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function InventoryList({ products, refreshData }) {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');

    const startEdit = (product) => {
        setEditingId(product.id);
        setEditName(product.name);
        setEditPrice(product.price);
    };

    const handleUpdate = async (id) => {
        const { error } = await supabase
            .from('products')
            .update({ name: editName, price: parseFloat(editPrice) })
            .eq('id', id);

        if (error) {
            alert(error.message);
        } else {
            setEditingId(null);
            refreshData();
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Delete this item?");
        if (confirmDelete) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) console.error(error);
            else refreshData();
        }
    };

    return (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
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
                        {editingId === item.id ? (
                            <>
                                <td><input value={editName} onChange={(e) => setEditName(e.target.value)} /></td>
                                <td>{item.categories?.name}</td>
                                <td><input type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} /></td>
                                <td>
                                    <button onClick={() => handleUpdate(item.id)} style={{ color: 'green' }}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{item.name}</td>
                                <td>{item.categories?.name}</td>
                                <td>£{item.price.toFixed(2)}</td>
                                <td>
                                    <button onClick={() => startEdit(item)}>Edit</button>
                                    <button onClick={() => handleDelete(item.id)} style={{ color: 'red', marginLeft: '5px' }}>Delete</button>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}