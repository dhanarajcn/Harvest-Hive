/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { convertToINR } from 'convert';
import { BigNumber } from 'ethers';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface YourProductsProps {
    account: string;
    getMyProducts: (account: string) => Promise<[]>;
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

export default function YourProducts(props: YourProductsProps) {
    const [products, setProducts] = React.useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            const products = await props.getMyProducts(props.account);

            let productProcessed: Product[] = [];
            for (let i = 0; i < products.length; i++) {
                // @ts-ignore
                const data = await axios.get(props.getFileFromIPFS(products[i].productImage));
                var blobUrl = URL.createObjectURL(new Blob([Buffer.from(data.data.image.data, "utf-8")]));

                productProcessed.push({
                    // @ts-ignore
                    ...products[i],
                    // @ts-ignore
                    productId: BigNumber.from(products[i].productId).toNumber(),
                    // @ts-ignore
                    productPrice: BigNumber.from(products[i].productPrice).toNumber(),
                    // @ts-ignore
                    minQuantity: BigNumber.from(products[i].minQuantity).toNumber(),
                    // @ts-ignore
                    maxQuantity: BigNumber.from(products[i].maxQuantity).toNumber(),
                    // @ts-ignore
                    totalQuantity: BigNumber.from(products[i].totalQuantity).toNumber(),
                    productImage: blobUrl,
                });
            }

            setProducts(productProcessed);
        }
        getData();
    }, [props.account]);

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
                    Your Products
                </div>
                <AddIcon css={{
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                }} onClick={() => {
                    navigate('/addProduct');
                }} />
            </div>
            <div css={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                flexDirection: 'row',
            }}>
                {products.map((product: Product, index: number) => {
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
                                <img src={product.productImage} alt={product.productName} css={{
                                    width: "200px",
                                    height: "100%",
                                    objectFit: "cover",
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
                                    {product.productName}
                                </div>
                                <div css={{
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }}>
                                    {product.productDescription}
                                </div>
                                <div css={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                }}>
                                    {product.productPrice} Wei - {convertToINR(product.productPrice)} INR
                                </div>
                                <div css={{
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }}>
                                    {product.totalQuantity} in stock
                                </div>
                                <div css={{
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }}>
                                    {product.minQuantity} - {product.maxQuantity} per purchase
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    )
}
