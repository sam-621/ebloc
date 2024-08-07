import { graphql } from '../codegen';

export const CommonOrder = graphql(`
  fragment CommonOrder on Order {
    id
    code
    createdAt
    subtotal
    total
    totalQuantity
    state
    lines {
      items {
        id
        linePrice
        quantity
        unitPrice
        productVariant {
          id
          sku
          optionValues(withDeleted: true) {
            id
            value
          }
          product {
            name
            slug
            assets {
              items {
                id
                source
              }
            }
          }
        }
      }
    }
    customer {
      id
      firstName
      lastName
      email
      phoneNumber
    }
    shippingAddress {
      country
      streetLine1
      streetLine2
      province
      city
      postalCode
    }
    payment {
      id
      amount
      transactionId
      method
    }
    shipment {
      id
      amount
      trackingCode
      carrier
      method
    }
  }
`);

export const GetOrdersQuery = graphql(`
  query GetOrdersQuery {
    orders {
      count
      items {
        id
        code
        state
        total
        totalQuantity
        placedAt
        customer {
          id
          firstName
          lastName
        }
        shipment {
          id
          amount
          trackingCode
          method
        }
      }
    }
  }
`);

export const GetOrderDetails = graphql(`
  query GetOrderDetails($orderId: ID) {
    order(id: $orderId) {
      ...CommonOrder
    }
  }
`);
