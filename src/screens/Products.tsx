/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { Fragment, useEffect } from 'react';
import axios from 'axios';
import { BigNumber } from 'ethers';
import Button from 'components/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle, } from '@mui/material';
import Input from 'components/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { convertToINR } from 'convert';

interface ProductsProps {
    account: string;
    getProducts: (account: string) => Promise<[]>;
    purchaseProduct: (account: string, productId: number, quantity: number, amount: number, accessoriesId1: number, accessoriesId2: number, accessoriesId3: number) => Promise<void>;
    getUser: (account: string, user: string) => Promise<any>;
    getFileFromIPFS: (hash: string) => string;
    getAccessories: (account: string) => Promise<[]>;
    addNegotiation: (account: string, productId: number, quantity: number, price: number) => Promise<void>;
    addCall: (account: string, owner: string, roomId: string, description: string, datetime: string) => Promise<void>;
};

interface Product {
    ownerAddress: string;
    productId: number;
    productName: string;
    productCategory: string;
    productDescription: string;
    productImage: string;
    productPrice: number;
    minQuantity: number;
    maxQuantity: number;
    totalQuantity: number;
    userName: string;
    userPhone: string;
    userAddress: string;
}

interface Accessory {
    accessoriesId: number;
    accessoriesName: string;
    accessoriesPricePerKg: number;
}

export default function Products(props: ProductsProps) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [negotiateDialogOpen, setNegotiateDialogOpen] = React.useState(false);
    const [callDialogOpen, setCallDialogOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const [description, setDescription] = React.useState('');
    const [datetime, setDatetime] = React.useState('');
    const [quantity, setQuantity] = React.useState(0);
    const [price, setPrice] = React.useState(0);
    const [distance, setDistance] = React.useState(10);
    const [products, setProducts] = React.useState<Product[]>([]);
    const [accessories, setAccessories] = React.useState<Accessory[]>([]);
    const [accessoryId1, setAccessoryId1] = React.useState(-1);
    const [accessoryId2, setAccessoryId2] = React.useState(-1);
    const [accessoryId3, setAccessoryId3] = React.useState(-1);
    const [searchName, setSearchName] = React.useState('');
    const [ownerAddress, setOwnerAddress] = React.useState('');
    const [productCategory, setProductCategory] = React.useState('');

    useEffect(() => {
        async function getData() {
            const products = await props.getProducts(props.account);

            let productProcessed: Product[] = [];
            for (let i = 0; i < products.length; i++) {
                // @ts-ignore
                const data = await axios.get(props.getFileFromIPFS(products[i].productImage));
                var blobUrl = URL.createObjectURL(new Blob([Buffer.from(data.data.image.data, "utf-8")]));

                // @ts-ignore
                if (BigNumber.from(products[i].totalQuantity).toNumber() === 0) continue;
                // @ts-ignore
                const userDetails = await props.getUser(props.account, products[i].ownerAddress);

                productProcessed.push({
                    // @ts-ignore
                    ...products[i],
                    // @ts-ignore
                    ...userDetails[0],
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
        }
        getData();
    }, [props.account]);

    function onClose() {
        setCallDialogOpen(false);
        setNegotiateDialogOpen(false);
        setDialogOpen(false);
        setQuantity(0);
        setPrice(0);
        setOwnerAddress('');
        setDescription('');
        setDatetime('');
    }

    function calculateTotalCost() {
        if (selectedProduct === null) return 0;

        let accesoryPrice1 = accessories.find((a) => a.accessoriesId === accessoryId1);
        let accesoryPrice2 = accessories.find((a) => a.accessoriesId === accessoryId2);
        let accesoryPrice3 = accessories.find((a) => a.accessoriesId === accessoryId3);

        return (
            products.find((p) => p.productId === selectedProduct!.productId)!.productPrice * quantity +
            distance * (accesoryPrice1 ? accesoryPrice1.accessoriesPricePerKg : 0) +
            quantity * (accesoryPrice2 ? accesoryPrice2.accessoriesPricePerKg : 0) +
            quantity * (accesoryPrice3 ? accesoryPrice3.accessoriesPricePerKg : 0)
        );
    }

    function makeid(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    return (
        <Fragment>
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
                        Products
                    </div>
                    <div css={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center',
                        width: '600px',
                    }}>
                        <FormControl fullWidth variant="standard" css={{
                            margin: "10px 0px 0px 0px",
                        }}>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={productCategory}
                                label="Category"
                                onChange={(e) => {
                                    setProductCategory(e.target.value as string);
                                }}
                            >
                                <MenuItem value={'none'}>None</MenuItem>
                                <MenuItem value={'rice'}>Rice</MenuItem>
                                <MenuItem value={'ragi'}>Ragi</MenuItem>
                                <MenuItem value={'others'}>Others</MenuItem>
                            </Select>
                        </FormControl>
                        <Input
                            value={searchName}
                            width='100%'
                            placeholder='Search'
                            color={'#256b6e'}
                            highlightColor={'#1e5a5c'}
                            onChange={(v) => {
                                setSearchName(v);
                            }}
                        />
                    </div>
                </div>
                <div css={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                }}>
                    {products.filter((product: Product) => {
                        // @ts-ignore
                        return product.ownerAddress.toLowerCase() !== props.account.toLowerCase() && (searchName === '' || product.productName.toLowerCase().includes(searchName.toLowerCase()));
                    }).filter((product: Product) => {
                        if (productCategory === 'none' || productCategory === '') return true;
                        return product.productCategory === productCategory;
                    }).map((product: Product, index: number) => {
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
                                    <div css={{
                                        fontSize: '16px',
                                        color: 'rgba(0, 0, 0, 0.5)',
                                    }}>
                                        Farmer: {product.userName}
                                    </div>
                                    <div css={{
                                        fontSize: '16px',
                                        color: 'rgba(0, 0, 0, 0.5)',
                                    }}>
                                        Farmer Phone no: {product.userPhone}
                                    </div>
                                    <div css={{
                                        fontSize: '16px',
                                        color: 'rgba(0, 0, 0, 0.5)',
                                    }}>
                                        Farmer Address: {product.userAddress}
                                    </div>
                                    <div css={{
                                        display: 'flex',
                                        gap: '10px',
                                        marginTop: '10px',
                                    }}>
                                        <Button
                                            name="Book a Call"
                                            color={"#163e40"}
                                            onClick={async (e) => {
                                                setOwnerAddress(product.ownerAddress);
                                                setCallDialogOpen(true);
                                            }} />
                                        <Button
                                            name="Negotiate"
                                            color={"#163e40"}
                                            onClick={async (e) => {
                                                setQuantity(product.minQuantity);
                                                setSelectedProduct(product);
                                                setNegotiateDialogOpen(true);
                                            }} />
                                        <Button
                                            name="Buy"
                                            color={"#163e40"}
                                            onClick={async (e) => {
                                                setQuantity(product.minQuantity);
                                                setSelectedProduct(product);
                                                setDialogOpen(true);
                                            }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div >
            <Dialog onClose={onClose} open={dialogOpen}>
                <DialogTitle>Purchase</DialogTitle>
                <DialogContent>
                    <Input
                        value={quantity}
                        width='500px'
                        placeholder='Quantity'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        onChange={(v) => {
                            setQuantity(parseInt(v));
                        }}
                    />
                    <Input
                        value={distance}
                        width='500px'
                        placeholder='Distance'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        onChange={(v) => {
                            setDistance(parseInt(v));
                        }}
                    />
                    <br />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Transport</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={accessoryId1.toString()}
                            label="Age"
                            onChange={(event: SelectChangeEvent) => {
                                setAccessoryId1(parseInt(event.target.value));
                            }}
                            variant="standard"
                        >
                            {accessories.filter((accessories: Accessory) => accessories.accessoriesName === "Transport").map((accessory: Accessory, index: number) => {
                                return (
                                    <MenuItem value={accessory.accessoriesId.toString()}>{accessory.accessoriesName} / {accessory.accessoriesPricePerKg}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <br />
                    <br />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Packaging</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={accessoryId2.toString()}
                            label="Age"
                            onChange={(event: SelectChangeEvent) => {
                                setAccessoryId2(parseInt(event.target.value));
                            }}
                            variant="standard"
                        >
                            {accessories.filter((accessories: Accessory) => accessories.accessoriesName === "Packaging").map((accessory: Accessory, index: number) => {
                                return (
                                    <MenuItem value={accessory.accessoriesId.toString()}>{accessory.accessoriesName} / {accessory.accessoriesPricePerKg}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <br />
                    <br />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Storage</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={accessoryId3.toString()}
                            label="Age"
                            onChange={(event: SelectChangeEvent) => {
                                setAccessoryId3(parseInt(event.target.value));
                            }}
                            variant="standard"
                        >
                            {accessories.filter((accessories: Accessory) => accessories.accessoriesName === "Storage").map((accessory: Accessory, index: number) => {
                                return (
                                    <MenuItem value={accessory.accessoriesId.toString()}>{accessory.accessoriesName} / {accessory.accessoriesPricePerKg}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        name="Cancel"
                        color={"#163e40"}
                        onClick={onClose}
                    />
                    <Button
                        name={"Total Cost " + calculateTotalCost() + " Wei"}
                        color={"#163e40"}
                        onClick={() => {
                            if (selectedProduct === null) return;

                            props.purchaseProduct(
                                props.account,
                                selectedProduct.productId,
                                quantity,
                                calculateTotalCost(),
                                accessoryId1,
                                accessoryId2,
                                accessoryId3,
                            );
                            onClose();
                        }}
                    />
                </DialogActions>
            </Dialog>
            <Dialog onClose={onClose} open={negotiateDialogOpen}>
                <DialogTitle>Negotiate</DialogTitle>
                <DialogContent>
                    <Input
                        value={quantity}
                        width='500px'
                        placeholder='Quantity'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        onChange={(v) => {
                            setQuantity(parseInt(v));
                        }}
                    />
                    <Input
                        value={price}
                        width='500px'
                        placeholder='Price'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        onChange={(v) => {
                            setPrice(parseInt(v));
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        name="Cancel"
                        color={"#163e40"}
                        onClick={onClose}
                    />
                    <Button
                        name={"Negotiate"}
                        color={"#163e40"}
                        onClick={() => {
                            if (selectedProduct === null) return;

                            props.addNegotiation(
                                props.account,
                                selectedProduct.productId,
                                quantity,
                                price,
                            );
                            onClose();
                        }}
                    />
                </DialogActions>
            </Dialog>
            <Dialog onClose={onClose} open={callDialogOpen}>
                <DialogTitle>Book a call</DialogTitle>
                <DialogContent>
                    <Input
                        value={description}
                        width='500px'
                        placeholder='Description'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        onChange={(v) => {
                            setDescription(v);
                        }}
                    />
                    <Input
                        value={datetime}
                        width='500px'
                        placeholder='Date time'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        onChange={(v) => {
                            setDatetime(v);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        name="Cancel"
                        color={"#163e40"}
                        onClick={onClose}
                    />
                    <Button
                        name={"Book Call"}
                        color={"#163e40"}
                        onClick={() => {
                            if (description === null ||
                                datetime === null
                            ) return;

                            props.addCall(
                                props.account,
                                ownerAddress,
                                makeid(10),
                                description,
                                datetime,
                            );
                            onClose();
                        }}
                    />
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
