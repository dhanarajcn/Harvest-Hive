/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useEffect } from 'react';
import { BigNumber } from 'ethers';
import axios from 'axios';

interface SalesProps {
  account: string;
  getUser: (account: string, user: string) => Promise<any>;
  getSales: (account: string) => Promise<[]>;
  getAccessories: (account: string) => Promise<[]>;
  getAccessoriesSales: (account: string) => Promise<[]>;
  getFileFromIPFS: (hash: string) => string;
};

interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: number;
  minQuantity: number;
  maxQuantity: number;
  totalQuantity: number;
}

interface Sales {
  purchaseId: number;
  product: Product;
  buyerAddress: string;
  quantity: number;
  totalPrice: number;
}

interface Accessory {
  accessoriesId: number;
  accessoriesName: string;
  accessoriesPricePerKg: number;
  ownerAddress: string;
}

interface AccessoriesSales {
  purchaseId: number;
  accessories: Accessory;
  buyerAddress: string;
  buyerName: string;
  quantity: number;
  totalPrice: number;
}

export default function SalesScreen(props: SalesProps) {
  const [sales, setSales] = React.useState<Sales[]>([]);
  const [accessories, setAccessories] = React.useState<Accessory[]>([]);
  const [accessoriesSales, setAccessoriesSales] = React.useState<AccessoriesSales[]>([]);

  useEffect(() => {
    async function getData() {
      if (props.account === '' || props.account === undefined) return;

      const sales = await props.getSales(props.account);
      let salesProcessed: Sales[] = [];
      for (let i = 0; i < sales.length; i++) {
        // @ts-ignore
        const data = await axios.get(props.getFileFromIPFS(sales[i].product.productImage));
        var blobUrl = URL.createObjectURL(new Blob([Buffer.from(data.data.image.data, "utf-8")]));

        salesProcessed.push({
          // @ts-ignore
          purchaseId: BigNumber.from(sales[i].purchaseId).toNumber(),
          // @ts-ignore
          buyerAddress: BigNumber.from(sales[i].buyerAddress).toHexString(),
          // @ts-ignore
          quantity: BigNumber.from(sales[i].quantity).toNumber(),
          // @ts-ignore
          totalPrice: BigNumber.from(sales[i].totalPrice).toNumber(),
          product: {
            // @ts-ignore
            ...sales[i].product,
            // @ts-ignore
            productId: BigNumber.from(sales[i].product.productId).toNumber(),
            // @ts-ignore
            productPrice: BigNumber.from(sales[i].product.productPrice).toNumber(),
            // @ts-ignore
            minQuantity: BigNumber.from(sales[i].product.minQuantity).toNumber(),
            // @ts-ignore
            maxQuantity: BigNumber.from(sales[i].product.maxQuantity).toNumber(),
            // @ts-ignore
            totalQuantity: BigNumber.from(sales[i].product.totalQuantity).toNumber(),
            productImage: blobUrl,
          }
        });
      }
      setSales(salesProcessed);

      const accessories = await props.getAccessories(props.account);
      let accessoryProcessed: Accessory[] = [];
      for (let i = 0; i < accessories.length; i++) {
        accessoryProcessed.push({
          // @ts-ignore
          ...accessories[i],
          // @ts-ignore
          accessoriesId: BigNumber.from(accessories[i].accessoriesId).toNumber(),
          // @ts-ignore
          accessoriesPricePerKg: BigNumber.from(accessories[i].accessoriesPricePerKg).toNumber(),
        });
      }
      setAccessories(accessoryProcessed);

      const accessoriesSales = await props.getAccessoriesSales(props.account);
      let accessoriesSalesProcessed: AccessoriesSales[] = [];
      for (let i = 0; i < accessoriesSales.length; i++) {
        // @ts-ignore
        const user = await props.getUser(props.account, accessoriesSales[i].buyerAddress);

        // @ts-ignore
        const accessory1 = accessoryProcessed.find((accessory: Accessory) => accessory.accessoriesId === BigNumber.from(accessoriesSales[i].accessoriesId1).toNumber());
        // @ts-ignore
        const accessory2 = accessoryProcessed.find((accessory: Accessory) => accessory.accessoriesId === BigNumber.from(accessoriesSales[i].accessoriesId2).toNumber());
        // @ts-ignore
        const accessory3 = accessoryProcessed.find((accessory: Accessory) => accessory.accessoriesId === BigNumber.from(accessoriesSales[i].accessoriesId3).toNumber());

        if (accessory1 && (accessory1.ownerAddress.toLowerCase() === props.account.toLowerCase())) {
          accessoriesSalesProcessed.push({
            // @ts-ignore
            purchaseId: BigNumber.from(accessoriesSales[i].purchaseId).toNumber(),
            accessories: accessory1,
            // @ts-ignore
            buyerAddress: accessoriesSales[i].buyerAddress,
            buyerName: user[0].userName,
            // @ts-ignore
            quantity: BigNumber.from(accessoriesSales[i].quantity).toNumber(),
            // @ts-ignore
            totalPrice: BigNumber.from(accessoriesSales[i].totalPrice).toNumber(),
          });
        }

        if (accessory2 && (accessory2.ownerAddress.toLowerCase() === props.account.toLowerCase())) {
          accessoriesSalesProcessed.push({
            // @ts-ignore
            purchaseId: BigNumber.from(accessoriesSales[i].purchaseId).toNumber(),
            accessories: accessory2,
            // @ts-ignore
            buyerAddress: accessoriesSales[i].buyerAddress,
            buyerName: user[0].userName,
            // @ts-ignore
            quantity: BigNumber.from(accessoriesSales[i].quantity).toNumber(),
            // @ts-ignore
            totalPrice: BigNumber.from(accessoriesSales[i].totalPrice).toNumber(),
          });
        }

        if (accessory3 && (accessory3.ownerAddress.toLowerCase() === props.account.toLowerCase())) {
          accessoriesSalesProcessed.push({
            // @ts-ignore
            purchaseId: BigNumber.from(accessoriesSales[i].purchaseId).toNumber(),
            accessories: accessory3,
            // @ts-ignore
            buyerAddress: accessoriesSales[i].buyerAddress,
            buyerName: user[0].userName,
            // @ts-ignore
            quantity: BigNumber.from(accessoriesSales[i].quantity).toNumber(),
            // @ts-ignore
            totalPrice: BigNumber.from(accessoriesSales[i].totalPrice).toNumber(),
          });
        }
      }
      setAccessoriesSales(accessoriesSalesProcessed);
    }
    getData();
  }, [props, props.account, props.getSales, props.getAccessories, props.getAccessoriesSales, props.getFileFromIPFS]);

  return (
    <div css={{ margin: '10px 30px' }}>
      <div css={{
        margin: '20px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div css={{
          fontSize: '28px',
          fontWeight: '600px',
        }}>
          Sales
        </div>
      </div>
      <div css={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        flexDirection: 'row',
      }}>
        {sales.map((sale: Sales, index: number) => {
          return (
            <div
              key={index}
              css={{
                width: 'calc(50% - 20px)',
                borderRadius: '10px',
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: '0.3s',
                display: 'flex',
                flexDirection: 'row',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
                },
              }}
            >
              <div css={{
                height: "100%",
                borderRadius: '10px 0px 0px 10px',
              }}>
                <img src={sale.product.productImage} alt={sale.product.productName} css={{
                  height: "100%",
                  borderRadius: '10px 0px 0px 10px',
                }} />
              </div>
              <div css={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div css={{
                  fontSize: '20px',
                  fontWeight: '600',
                }}>
                  {sale.product.productName}
                </div>
                <div css={{
                  fontSize: '16px',
                  color: 'rgba(0, 0, 0, 0.5)',
                }}>
                  {sale.product.productDescription}
                </div>
                <div css={{
                  fontSize: '20px',
                  fontWeight: '600',
                }}>
                  Buyed {sale.quantity} quantity
                </div>
                <div css={{
                  fontSize: '16px',
                  color: 'rgba(0, 0, 0, 0.5)',
                }}>
                  Total Price {sale.totalPrice} Wei
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div css={{
        margin: '20px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div css={{
          fontSize: '28px',
          fontWeight: '600px',
        }}>
          Intermediaries Sales
        </div>
      </div>
      <div css={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        flexDirection: 'row',
      }}>
        {accessoriesSales.map((accessoriesSales: AccessoriesSales, index: number) => {
          return (
            <div
              key={index}
              css={{
                width: 'calc(25% - 40px)',
                borderRadius: '10px',
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: '0.3s',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
                },
              }}
            >
              <div css={{
                fontSize: '20px',
                fontWeight: '600',
              }}>
                Purchase ID: {accessoriesSales.purchaseId}
              </div>
              <div css={{
                fontSize: '16px',
                color: 'rgba(0, 0, 0, 0.5)',
              }}>
                Intermediary: {accessoriesSales.accessories.accessoriesName}
              </div>
              <div css={{
                fontSize: '16px',
                color: 'rgba(0, 0, 0, 0.5)',
              }}>
                Buyer: {accessoriesSales.buyerName}
              </div>
              <div css={{
                fontSize: '16px',
                color: 'rgba(0, 0, 0, 0.5)',
              }}>
                Quantity: {accessoriesSales.quantity}
              </div>
              <div css={{
                fontSize: '16px',
                color: 'rgba(0, 0, 0, 0.5)',
              }}>
                Total Price: {accessoriesSales.totalPrice}
              </div>
            </div>
          );
        })}
      </div>
    </div >
  )
}
