import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@course-learning-ad/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

// remove this to test stripe without mock
jest.mock('../../stripe');

const BASE_URL = '/api/payments';

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post(BASE_URL)
    .set('Cookie', global.signin())
    .send({
      token: 'asdf',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });

  await request(app)
    .post(BASE_URL)
    .set('Cookie', global.signin())
    .send({
      token: 'asdf',
      orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });

  await order.save();

  await request(app)
    .post(BASE_URL)
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'asdf'
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });

  await order.save();

  await request(app)
    .post(BASE_URL)
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa'
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');
});

it('tests stripe without mock', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created
  });

  await order.save();

  await request(app)
    .post(BASE_URL)
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa'
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });

  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100
  });

  expect(stripeCharge).toBeDefined();

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });

  // can't use .toBeDefined() because null evaluates to true
  // need to make sure that payment isn't null
  expect(payment).not.toBeNull();
});