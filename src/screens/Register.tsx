/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Fragment, useState } from 'react';
import Input from 'components/Input';
import Button from 'components/Button';
import MultilineInput from 'components/MultilineInput';
import { useNavigate } from "react-router-dom";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

interface RegisterProps {
    account: string;
    onRegister: (account: string, name: string, email: string, address: string, phone: string, userType: string) => void;
};

export default function Register(props: RegisterProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('Farmer');
    const navigate = useNavigate();

    return (
        <Fragment>
            <div css={{ margin: '20px 200px' }}>
                <div css={{
                    fontSize: '28px',
                    fontWeight: '600px',
                    margin: '40px 0',
                }}>
                    Enter your Details
                </div>

                <div css={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 'auto 0',
                    gap: "15px",
                }}>

                    <div css={{
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 auto',
                        gap: '15px',
                        flexDirection: 'column',
                    }}>
                        <Input
                            value={name === '' ? '' : name}
                            width='100%'
                            placeholder='Name'
                            color={'#256b6e'}
                            highlightColor={'#1e5a5c'}
                            onChange={(v) => {
                                setName(v);
                            }}
                        />
                        <MultilineInput
                            value={address === '' ? '' : address}
                            width='100%'
                            height='120px'
                            placeholder='Full Address'
                            onChange={(v) => {
                                setAddress(v)
                            }}
                            color={'#256b6e'}
                            highlightColor={'#1e5a5c'}
                        />
                    </div>

                    <div css={{
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 auto',
                        gap: '15px',
                        flexDirection: 'column',
                    }}>
                        <Input
                            value={email === '' ? '' : email}
                            width='100%'
                            placeholder='Email id'
                            color={'#256b6e'}
                            highlightColor={'#1e5a5c'}
                            onChange={(v) => {
                                setEmail(v);
                            }}
                        />
                        <Input
                            value={phone === '' ? '' : phone}
                            width='100%'
                            placeholder='Phone number'
                            color={'#256b6e'}
                            highlightColor={'#1e5a5c'}
                            onChange={(v) => {
                                setPhone(v);
                            }}
                        />
                        <RadioGroup
                            row
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                            }}
                        >
                            <FormControlLabel value="Farmer" control={<Radio />} label="Farmer" />
                            <FormControlLabel value="Buyer" control={<Radio />} label="Buyer" />
                        </RadioGroup>
                    </div>

                </div>
                <div css={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '60px 0 0 0'
                }}>
                    <Button name="Save and Login" color={"#163e40"} onClick={async (e) => {
                        props.onRegister(props.account, name, email, address, phone, type);
                        navigate('/');
                    }} />
                </div>
            </div>
        </Fragment >
    )
}
