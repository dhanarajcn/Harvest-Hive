/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useEffect } from 'react';
import { BigNumber } from 'ethers';
import axios from 'axios';

interface OrdersProps {
    account: string;
    getOrders: (account: string) => Promise<[]>;
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

export default function Orders(props: OrdersProps) {
    const [orders, setOrders] = React.useState<Sales[]>([]);

    useEffect(() => {
        async function getData() {
            const orders = await props.getOrders(props.account);

            let ordersProcessed: Sales[] = [];
            for (let i = 0; i < orders.length; i++) {
                // @ts-ignore
                const data = await axios.get(props.getFileFromIPFS(orders[i].product.productImage));
                var blobUrl = URL.createObjectURL(new Blob([Buffer.from(data.data.image.data, "utf-8")]));

                ordersProcessed.push({
                    // @ts-ignore
                    purchaseId: BigNumber.from(orders[i].purchaseId).toNumber(),
                    // @ts-ignore
                    buyerAddress: BigNumber.from(orders[i].buyerAddress).toHexString(),
                    // @ts-ignore
                    quantity: BigNumber.from(orders[i].quantity).toNumber(),
                    // @ts-ignore
                    totalPrice: BigNumber.from(orders[i].totalPrice).toNumber(),
                    product: {
                        // @ts-ignore
                        ...orders[i].product,
                        // @ts-ignore
                        productId: BigNumber.from(orders[i].product.productId).toNumber(),
                        // @ts-ignore
                        productPrice: BigNumber.from(orders[i].product.productPrice).toNumber(),
                        // @ts-ignore
                        minQuantity: BigNumber.from(orders[i].product.minQuantity).toNumber(),
                        // @ts-ignore
                        maxQuantity: BigNumber.from(orders[i].product.maxQuantity).toNumber(),
                        // @ts-ignore
                        totalQuantity: BigNumber.from(orders[i].product.totalQuantity).toNumber(),
                        productImage: blobUrl,
                    }
                });
            }

            setOrders(ordersProcessed);
        }
        getData();
    }, [props, props.account, props.getOrders]);

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
                    Orders
                </div>
            </div>
            <div css={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                flexDirection: 'row',
            }}>
                {orders.map((order: Sales, index: number) => {
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
                                <img src={order.product.productImage} alt={order.product.productName} css={{
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
                                    {order.product.productName}
                                </div>
                                <div css={{
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }}>
                                    {order.product.productDescription}
                                </div>
                                <div css={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                }}>
                                    Bought {order.quantity} quantity
                                </div>
                                <div css={{
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }}>
                                    Total Price {order.totalPrice} Wei
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    )
}
