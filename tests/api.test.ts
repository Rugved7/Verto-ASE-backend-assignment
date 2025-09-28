import request from 'supertest';
import {app} from '../src/server';

describe('API Endpoints', () => {
  let productId: string;
  let lowStockProductId: string;

  it('GET /api/v1/health should return API status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Inventory API is running!');
  });

  it('POST /api/v1/products should create a new product', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Test Product',
        description: 'A product for testing',
        stock_quantity: 100, 
        low_stock_threshold: 10
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Product');
    productId = res.body._id;
  });

  it('GET /api/v1/products should get all products', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/products/low-stock should get low stock products', async () => {
    // FIRST create a product that should be low stock
    const lowStockRes = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Low Stock Product',
        description: 'This should appear in low stock results',
        stock_quantity: 5,           // ✅ LOW stock (5 < 10)
        low_stock_threshold: 10      // ✅ Threshold is 10
      });
    
    lowStockProductId = lowStockRes.body._id;

    // NOW test the low stock endpoint
    const res = await request(app).get('/api/v1/products/low-stock');
    console.log('Low stock response:', {
      status: res.status,
      count: res.body.length,
      products: res.body
    });
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // The array should contain at least our low stock product
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/stocks/:id/increase should increase stock', async () => {
    const res = await request(app)
      .post(`/api/v1/stocks/${productId}/increase`) 
      .send({ amount: 10 });
    expect(res.status).toBe(200);
    expect(res.body.stock_quantity).toBe(110); 
  });

  it('POST /api/v1/stocks/:id/decrease should decrease stock', async () => {
    const res = await request(app)
      .post(`/api/v1/stocks/${productId}/decrease`) 
      .send({ amount: 5 });
    expect(res.status).toBe(200);
    expect(res.body.stock_quantity).toBe(105);
  });

  it('GET /api/v1/products/:id/audit-logs should get audit logs for a product', async () => {
    const res = await request(app).get(`/api/v1/products/${productId}/audit-logs`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});