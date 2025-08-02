/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import Button from 'components/Button';
import Input from 'components/Input';
import MultilineInput from 'components/MultilineInput';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AddProductProps {
    account: string;
    saveProduct: (
        productName: string,
        productDescription: string,
        productCategory: string,
        productImage: string | null,
        productPrice: number,
        productMinQuantity: number,
        productMaxQuantity: number,
        productTotalQuantity: number,
    ) => void;
};

export default function AddProduct(props: AddProductProps) {
    const [productImageContent, setProductImageContent] = React.useState<null>(null);
    const [productImage, setProductImage] = React.useState<string | null>(null);
    const [productName, setProductName] = React.useState<string>('');
    const [productDescription, setProductDescription] = React.useState<string>('');
    const [productPrice, setProductPrice] = React.useState<number>(0);
    const [productMinQuantity, setProductMinQuantity] = React.useState<number>(0);
    const [productMaxQuantity, setProductMaxQuantity] = React.useState<number>(0);
    const [productTotalQuantity, setProductTotalQuantity] = React.useState<number>(0);
    const [productQuality, setProductQuality] = React.useState<string>('');
    const [productCategory, setProductCategory] = React.useState<string>('rice');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (productImage === null || productImageContent === null) return;
            try {
                const formData = new FormData();
                formData.append('image', productImageContent);

                const response = await axios.post("https://ec2-18-212-242-199.compute-1.amazonaws.com/classify", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                const data = response.data;
                if (data['error'] !== undefined) {
                    setProductQuality("Error: " + data['error']);
                    return;
                }
                setProductQuality("Grain rice quality: " + data['classification'] + "\n" +
                    "Average aspect ratio: " + data['average_aspect_ratio'] + "\n" +
                    "Number of rice grains: " + data['no_of_rice_grains']);
            } catch (error) {
                console.log(error)
            }
        };
        setProductQuality("");
        fetchData();
    }, [productImage]);

    const handleImageChange = (e: any) => {
        setProductImageContent(e.target.files[0]);
        setProductImage(URL.createObjectURL(e.target.files[0]));
    }

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
                    Add Product
                </div>
                <Button
                    name="Save"
                    color={"#163e40"}
                    onClick={async (e) => {
                        if (productImage === null ||
                            productName === '' ||
                            productDescription === '' ||
                            productPrice === 0 ||
                            productMinQuantity === 0 ||
                            productMaxQuantity === 0 ||
                            productTotalQuantity === 0) {
                            alert("Please fill all the fields");
                            return
                        }
                        if (productCategory === "rice" && productQuality === "") {
                            alert("Please wait for the quality to be determined");
                            return
                        }

                        props.saveProduct(
                            productName,
                            productDescription + " " + productQuality,
                            productCategory,
                            productImage,
                            productPrice,
                            productMinQuantity,
                            productMaxQuantity,
                            productTotalQuantity,
                        );
                        navigate("/myproducts");
                    }} />
            </div>
            <div css={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                flexDirection: 'row',
            }}>
                <div css={{
                    flex: '1',
                    padding: '10px 0px',
                }}>
                    <div css={{
                        width: "100%",
                        display: "flex",
                        alignIitems: "center",
                        justifyContent: "center",
                    }}>
                        {productImage === null ?
                            <div css={{
                                height: "300px",
                                width: "300px",
                                border: "1px solid black",
                                borderRadius: "5px",
                                margin: "10px 0px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                cursor: "pointer",
                            }}>
                                <AddAPhotoIcon css={{
                                    height: "64px",
                                    width: "64px",
                                    color: "black",
                                }} />
                                <input type="file" onChange={handleImageChange} title="" accept="image/*" css={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    opacity: "0",
                                }} />
                            </div> :
                            <div css={{
                                height: "300px",
                                width: "300px",
                                border: "1px solid #00000000",
                                borderRadius: "5px",
                                margin: "10px 0px",
                                position: "relative",
                            }}>
                                <img src={productImage} alt="pet" css={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "5px",
                                }} />
                                <div
                                    css={{
                                        backgroundColor: "#00000066",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        position: "absolute",
                                        bottom: "0px",
                                        right: "0px",
                                        color: "white",
                                        fontSize: "20px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setProductImage(null)}
                                >
                                    <DeleteIcon css={{
                                        color: "white",
                                    }} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div css={{
                    flex: "2",
                }}>
                    <Input
                        value={productName}
                        width='100%'
                        placeholder='Product Name'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        onChange={(v) => {
                            setProductName(v);
                        }}
                    />
                    <MultilineInput
                        value={productDescription}
                        width='100%'
                        placeholder='Product Description'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        onChange={(v) => {
                            setProductDescription(v);
                        }}
                    />
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
                            <MenuItem value={'rice'}>Rice</MenuItem>
                            <MenuItem value={'ragi'}>Ragi</MenuItem>
                            <MenuItem value={'others'}>Others</MenuItem>
                        </Select>
                    </FormControl>
                    <Input
                        value={productPrice}
                        width='100%'
                        placeholder='Price'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        type="number"
                        onChange={(v) => {
                            setProductPrice(parseInt(v));
                        }}
                    />
                    <Input
                        value={productMinQuantity}
                        width='100%'
                        placeholder='Minimum Quantity'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        type="number"
                        onChange={(v) => {
                            setProductMinQuantity(parseInt(v));
                        }}
                    />
                    <Input
                        value={productMaxQuantity}
                        width='100%'
                        placeholder='Maximum Quantity'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        type="number"
                        onChange={(v) => {
                            setProductMaxQuantity(parseInt(v));
                        }}
                    />
                    <Input
                        value={productTotalQuantity}
                        width='100%'
                        placeholder='Total Quantity'
                        color={'#256b6e'}
                        highlightColor={'#1e5a5c'}
                        type="number"
                        onChange={(v) => {
                            setProductTotalQuantity(parseInt(v));
                        }}
                    />
                    <div css={{
                        marginTop: "10px",
                        color: "#256b6e",
                        fontSize: "20px",
                    }}>
                        {productQuality}
                    </div>
                </div>
            </div>
        </div>
    )
}
