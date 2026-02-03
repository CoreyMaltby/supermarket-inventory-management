import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ManageSuppliers from "./ManageSuppliers";

export default function SuppliersDirectory({ products }) {
    // Local state to hold suppliers data
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Function to fetch suppliers and their associated products
    async function fetchSuppliers() {
        setLoading(true);
        const { data, error } = await supabase
            .from('suppliers')
            .select(`
                id,
                name,
                product_suppliers (
                    products ( name )
                )
            `)
            .order('name', { ascending: true });

        if (error) console.error('Error fetching suppliers:', error);
        else setSuppliers(data || []);
        setLoading(false);
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Supplier Management</h2>
            <ManageSuppliers
                products={products}
                onSupplierAdded={fetchSuppliers}
            />

            <hr style={{ margin: '30px 0' }} />

            <h2>Active Supplier Directory</h2>
            {loading ? <p>Loading suppliers...</p> : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {suppliers.map(supplier => (
                        <div key={supplier.id} style={cardStyle}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{supplier.name}</h3>
                            <div>
                                <strong>Catalog:</strong>
                                <p style={{
                                    marginTop: '5px',
                                    color: supplier.product_suppliers.length > 0 ? '#000' : '#999',
                                    fontSize: supplier.product_suppliers.length > 0 ? '1rem' : '0.9rem'
                                }}>
                                    {supplier.product_suppliers.length > 0 ? (
                                        supplier.product_suppliers.map((ps, index) => ps.products.name).join(', ')
                                    ) : (
                                        'No products assigned'
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const cardStyle = {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};