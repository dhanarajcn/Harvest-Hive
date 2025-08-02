/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { Fragment, useEffect } from 'react';
import Button from 'components/Button';
import { BigNumber } from 'ethers';

interface NegotiationProps {
  account: string;
  getNegotiations: (account: string) => Promise<[]>;
  acceptNegotiation(account: string, negotiationId: number): Promise<void>;
  rejectNegotiation(account: string, negotiationId: number): Promise<void>;
  getUser: (account: string, user: string) => Promise<any>;
};

interface Negotiationn {
  negotiationId: number;
  productId: number;
  buyerAddress: string;
  sellerAddress: string;
  quantity: number;
  buyerName: string;
  totalPrice: number;
  isAccepted: boolean;
  isRejected: boolean;
}

export default function ReqNegotiation(props: NegotiationProps) {
  const [negotiation, setNegotiation] = React.useState<Negotiationn[]>([]);

  useEffect(() => {
    async function getData() {
      const negotiations = await props.getNegotiations(props.account);

      let negotiationProcessed: Negotiationn[] = [];
      for (let i = 0; i < negotiations.length; i++) {
        // @ts-ignore
        const userDetails = await props.getUser(props.account, negotiations[i].buyerAddress);
        console.log(negotiations[i]);

        negotiationProcessed.push({
          // @ts-ignore
          ...negotiations[i],
          // @ts-ignore
          buyerName: userDetails[0].userName,
          // @ts-ignore
          negotiationId: BigNumber.from(negotiations[i].negotiationId).toNumber(),
          // @ts-ignore
          productId: BigNumber.from(negotiations[i].productId).toNumber(),
          // @ts-ignore
          quantity: BigNumber.from(negotiations[i].quantity).toNumber(),
          // @ts-ignore
          totalPrice: BigNumber.from(negotiations[i].totalPrice).toNumber(),
        });
      }

      setNegotiation(negotiationProcessed);
    }
    getData();
  }, [props.account]);

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
            Requested Negotiation
          </div>
        </div>
        <div css={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}>
          {negotiation.filter((negotiation: Negotiationn) => {
            // @ts-ignore
            return negotiation.buyerAddress !== props.account.toLowerCase();
          }).map((negotiation: Negotiationn, index: number) => {
            return (
              <div
                key={index}
                css={{
                  width: 'calc(50% - 20px - 40px)',
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
                  Id: {negotiation.negotiationId}
                </div>
                <div css={{
                  fontSize: '20px',
                  fontWeight: '600',
                }}>
                  Product Id: {negotiation.productId}
                </div>
                <div css={{
                  fontSize: '16px',
                  color: 'rgba(0, 0, 0, 0.5)',
                }}>
                  Buyer Name: {negotiation.buyerName}
                </div>
                <div css={{
                  fontSize: '16px',
                  color: 'rgba(0, 0, 0, 0.5)',
                }}>
                  Quantity: {negotiation.quantity}
                </div>
                <div css={{
                  fontSize: '16px',
                  color: 'rgba(0, 0, 0, 0.5)',
                }}>
                  Price: {negotiation.totalPrice}
                </div>
                {negotiation.isAccepted && <div css={{
                  fontSize: '16px',
                  color: 'rgba(0, 0, 0, 0.5)',
                }}>
                  Status: Accepted
                </div>}
                {negotiation.isRejected && <div css={{
                  fontSize: '16px',
                  color: 'rgba(0, 0, 0, 0.5)',
                }}>
                  Status: Rejected
                </div>}
                {(negotiation.isAccepted === false && negotiation.isRejected === false) && <div css={{
                  display: 'flex',
                  gap: '20px',
                  marginTop: '20px',
                }}>
                  <Button
                    name="Reject"
                    color={"#163e40"}
                    onClick={async () => {
                      await props.rejectNegotiation(props.account, negotiation.negotiationId);
                    }}
                  />
                  <Button
                    name="Accept"
                    color={"#163e40"}
                    onClick={async () => {
                      await props.acceptNegotiation(props.account, negotiation.negotiationId);
                    }}
                  />
                </div>}
              </div>
            );
          })}
        </div>
      </div >
    </Fragment>
  )
}
