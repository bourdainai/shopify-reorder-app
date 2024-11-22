import React, { useState, useEffect } from 'react';
import {
  Page,
  Card,
  ResourceList,
  TextStyle,
  Button,
  Banner,
  Layout,
} from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { getSessionToken } from "@shopify/app-bridge-utils";

function Index() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const app = useAppBridge();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await getSessionToken(app);
      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data.orders);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const handleReorder = async (orderId) => {
    try {
      const token = await getSessionToken(app);
      const response = await fetch('/api/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });
      
      if (!response.ok) {
        throw new Error('Reorder failed');
      }

      const data = await response.json();
      // Show success message or redirect to the new order
    } catch (err) {
      setError('Failed to create reorder');
    }
  };

  if (loading) {
    return <Page title="Previous Orders">Loading...</Page>;
  }

  return (
    <Page title="Previous Orders">
      <Layout>
        {error && (
          <Layout.Section>
            <Banner status="critical">{error}</Banner>
          </Layout.Section>
        )}
        
        <Layout.Section>
          <Card>
            <ResourceList
              items={orders}
              renderItem={(order) => {
                const { id, order_number, created_at, total_price, currency } = order;
                return (
                  <ResourceList.Item
                    id={id}
                    accessibilityLabel={`Order ${order_number}`}
                  >
                    <div style={{ padding: '1rem' }}>
                      <TextStyle variation="strong">Order #{order_number}</TextStyle>
                      <p>Date: {new Date(created_at).toLocaleDateString()}</p>
                      <p>Total: {currency} {total_price}</p>
                      <Button
                        primary
                        onClick={() => handleReorder(id)}
                      >
                        Reorder
                      </Button>
                    </div>
                  </ResourceList.Item>
                );
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Index;
