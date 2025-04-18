const express = require('express');
const router = express.Router();

// Mock data - replace with database queries later
let orders = [
  {
    id: 1,
    status: 'pending',
    pickupLocation: 'เซ็นทรัลเวิลด์',
    deliveryLocation: 'สยามพารากอน',
    customerName: 'คุณสมชาย',
    customerPhone: '081-234-5678',
    price: 150,
    distance: 2.5,
    createdAt: new Date()
  },
  // Add more mock orders as needed
];

// Get all orders with optional status filtering
router.get('/', (req, res) => {
  const { status } = req.query;
  
  if (status) {
    const filteredOrders = orders.filter(order => {
      switch (status) {
        case 'process':
          return ['pending', 'accepted', 'pickup', 'delivering'].includes(order.status);
        case 'success':
          return order.status === 'completed';
        case 'fail':
          return order.status === 'cancelled';
        default:
          return true;
      }
    });
    return res.json(filteredOrders);
  }
  
  res.json(orders);
});

// Get order by ID
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Update order status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === parseInt(req.params.id));
  
  if (!order) return res.status(404).json({ error: 'Order not found' });
  
  order.status = status;
  res.json(order);
});

module.exports = router;