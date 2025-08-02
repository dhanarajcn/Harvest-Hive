/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';

interface ProfileData {
    userName: string;
    userAddress: string;
    userEmail: string;
    userPhone: string;
};

interface ProfileProps {
    account: string;
    getProfile: (account: string) => ProfileData;
};

export default function Profile(props: ProfileProps) {
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
                    Profile
                </div>
            </div>
            <div css={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                flexDirection: 'column',
            }}>
                <div css={{
                    fontSize: '20px',
                    fontWeight: '600px',
                }}>
                    Name: {props.getProfile(props.account).userName}
                </div>
                <div css={{
                    fontSize: '20px',
                    fontWeight: '600px',
                }}>
                    Email: {props.getProfile(props.account).userEmail}
                </div>
                <div css={{
                    fontSize: '20px',
                    fontWeight: '600px',
                }}>
                    Phone no: {props.getProfile(props.account).userPhone}
                </div>
                <div css={{
                    fontSize: '20px',
                    fontWeight: '600px',
                }}>
                    Address: {props.getProfile(props.account).userAddress}
                </div>
            </div>
        </div>
    )
}
