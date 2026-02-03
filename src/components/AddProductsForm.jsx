import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AddProductsForm({ onProductAdded }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState(1);
    const [loading, setLoading] = useState(false);

    // Inside AddProductsForm.jsx
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error } = await supabase
            .from('products')
            .insert([{ name, price: parseFloat(price), category_id: categoryId }]);

        if (error) {
            alert(error.message);
        } else {
            setName('');
            setPrice('');

            onProductAdded();
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h3>Add New Product</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    disabled={loading}
                />
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={loading}
                >
                    <option value="1">Produce</option>
                    <option value="2">Dairy</option>
                    <option value="3">Bakery</option>
                    <option value="4">Frozen Foods</option>
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Product'}
                </button>
            </div>
        </form>
    );
}

const formStyle = {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fafafa'
};