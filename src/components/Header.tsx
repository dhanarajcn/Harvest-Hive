/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Fragment } from 'react';
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    isConnected: boolean;
    userRegistered: boolean;
    farmer: boolean;
    connect: Function;
}

export default function Header(props: HeaderProps) {
    const navigate = useNavigate();

    function getLinks() {
        if (!props.isConnected)
            return (
                <div css={{ cursor: 'pointer' }}
                    onClick={() => props.connect && props.connect()}
                >
                    Connect
                </div>
            );
        if (!props.userRegistered)
            return (
                <Fragment>
                    <div css={{ cursor: 'pointer' }}
                        onClick={() => { navigate('/register') }}>
                        Register
                    </div>
                </Fragment>
            );
        return (
            <Fragment>
                <div css={{ cursor: 'pointer' }}
                    onClick={() => { navigate('/products') }}>
                    Products
                </div>
                {props.farmer && <div css={{ cursor: 'pointer' }}
                    onClick={() => { navigate('/myproducts') }}>
                    Your Products
                </div>}
                <div css={{ cursor: 'pointer' }}
                    onClick={() => { navigate('/negotiations') }}>
                    Negotiations
                </div>
                <div css={{ cursor: 'pointer' }}
                    onClick={() => { navigate('/intermediaries') }}>
                    Intermediaries
                </div>
                <div css={{ cursor: 'pointer' }}
                    onClick={() => { navigate('/calls') }}>
                    Calls
                </div>
                {!props.farmer && <div css={{ cursor: 'pointer' }}
                    onClick={() => { navigate('/orders') }}>
                    Orders
                </div>}
                <div css={{ cursor: 'pointer' }}
                    onClick={() => { navigate('/sales') }}>
                    Sales
                </div>
                <div css={{ cursor: 'pointer' }}
                    onClick={() => { navigate('/profile') }}>
                    Profile
                </div>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <div css={{
                height: '75px',
                backgroundColor: '#256b6e',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 30px',
                color: 'white',
            }}>
                <div css={{
                    fontSize: '32px',
                    cursor: 'pointer'
                }}
                    onClick={(e) => navigate("/")}>
                    HarvestHive
                </div>
                <div css={{
                    display: 'flex',
                    gap: '20px'
                }}>
                    {getLinks()}
                </div>
            </div>
        </Fragment>
    )
}