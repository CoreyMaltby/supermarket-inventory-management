import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ManageSuppliers({ products, onSuppliersAdded }) {
    // Local states for form inputs
    const [supplierName, setSupplierName] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Handle checkbox selection for products
    const handleCheckboxChange = (productId) => {
        setSelectedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    // Handle form submission to add a new supplier and map products
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { data: supplier, error: supplierError } = await supabase
            .from('suppliers')
            .insert([{ name: supplierName }])
            .select() // Return the inserted supplier
            .single();

        if (supplierError) {
            alert(supplierError.message);
            setLoading(false);
            return;
        }

        // Map selected products to the new supplier
        if (selectedProducts.length > 0) {
            // Prepare an array of objects mapping the new supplier to each selected product
            const associations = selectedProducts.map((productId) => ({
                supplier_id: supplier.id,
                product_id: productId
            }));

            // Insert associations into the product_suppliers junction table
            const { error: associationError } = await supabase
                .from('product_suppliers')
                .insert(associations);

            if (associationError) {
                alert('Supplier created but failed to associate products: ' + associationError.message);
                setLoading(false);
                return;
            }
        }

        setSupplierName('');
        setSelectedProducts([]);
        setLoading(false);
        onSuppliersAdded();
        alert('Supplier added successfully!');
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h3>Add New Supplier & Map Products</h3>
            <input
                placeholder="Supplier Name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
            />

            <p>Select products this supplier provides:</p>
            <div style={checkboxContainer}>
                {products && products.length > 0 ? (
                    products.map((p) => (
                        <label key={p.id} style={{ display: 'block', marginBottom: '5px' }}>
                            <input
                                type="checkbox"
                                checked={selectedProducts.includes(p.id)}
                                onChange={() => handleCheckboxChange(p.id)}
                            /> {p.name}
                        </label>
                    ))
                ) : (
                    <p style={{ color: '#999' }}>No products available</p>
                )}
            </div>

            <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? 'Saving...' : 'Register Supplier'}
            </button>
        </form>
    );
}

const formStyle = {
    padding: '20px',
    border: '2px solid #007bff',
    borderRadius: '8px',
    marginBottom: '20px'
};
const checkboxContainer = {
    maxHeight: '150px',
    overflowY: 'auto',
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '15px'
};
const btnStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '4px'
};
