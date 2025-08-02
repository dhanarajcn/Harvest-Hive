/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { Fragment, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from 'components/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Input from 'components/Input';
import { BigNumber } from 'ethers';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface AccessoriesProps {
    account: string;
    getUser: (account: string, user: string) => Promise<any>;
    getAccessories: (account: string) => Promise<[]>;
    addAccessories: (account: string, accessoriesName: string, accessoriesPricePerKg: number) => Promise<void>;
};

interface Accessory {
    accessoriesId: number;
    accessoriesName: string;
    accessoriesPricePerKg: number;
    username: string;
}

export default function Accessories(props: AccessoriesProps) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState(0);
    const [accessories, setAccessories] = React.useState<Accessory[]>([]);

    useEffect(() => {
        async function getData() {
            const accessories = await props.getAccessories(props.account);

            let accessoryProcessed: Accessory[] = [];
            for (let i = 0; i < accessories.length; i++) {
                // @ts-ignore
                let user = await props.getUser(props.account, accessories[i].ownerAddress);
                accessoryProcessed.push({
                    // @ts-ignore
                    ...accessories[i],
                    // @ts-ignore
                    accessoriesId: BigNumber.from(accessories[i].accessoriesId).toNumber(),
                    // @ts-ignore
                    accessoriesPricePerKg: BigNumber.from(accessories[i].accessoriesPricePerKg).toNumber(),
                    username: user[0].userName,
                });
            }

            setAccessories(accessoryProcessed);
        }
        getData();
    }, [props.account]);

    function onClose() {
        setDialogOpen(false);
        setName('');
        setPrice(0);
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
                        Intermediaries
                    </div>
                    <AddIcon css={{
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                    }} onClick={() => {
                        setDialogOpen(true);
                    }} />
                </div>
                <div css={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                }}>
                    {accessories.map((accessory: Accessory, index: number) => {
                        return (
                            <div
                                key={index}
                                css={{
                                    width: 'calc(30% - 20px)',
                                    borderRadius: '10px',
                                    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
                                    },
                                    padding: '20px',
                                }}
                            >
                                <div css={{
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }}>
                                    Id: {accessory.accessoriesId}
                                </div>
                                <div css={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                }}>
                                    Name: {accessory.accessoriesName}
                                </div>
                                <div css={{
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }}>
                                    Price/Kg: {accessory.accessoriesPricePerKg}
                                </div>
                                <div>
                                    Provider: {accessory.username}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div >
            <Dialog onClose={onClose} open={dialogOpen}>
                <DialogTitle>Add Intermediaries</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth variant="standard">
                        <InputLabel id="demo-simple-select-label">Intermediaries</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={name}
                            label="Name"
                            onChange={(event) => {
                                setName(event.target.value as string);
                            }}
                        >
                            <MenuItem value={"Transport"}>Transport</MenuItem>
                            <MenuItem value={"Packaging"}>Packaging</MenuItem>
                            <MenuItem value={"Storage"}>Storage</MenuItem>
                        </Select>
                    </FormControl>
                    <Input
                        value={price}
                        width='500px'
                        placeholder='Price/Kg'
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
                        name={"Save"}
                        color={"#163e40"}
                        onClick={() => {
                            if (name === '' || price === 0) return;

                            props.addAccessories(props.account, name, price);
                            onClose();
                        }}
                    />
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
