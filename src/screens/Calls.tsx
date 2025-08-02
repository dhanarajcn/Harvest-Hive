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
import io from 'socket.io-client';

interface CallProps {
    account: string;
    getCalls: (account: string) => Promise<[]>;
    getUser: (account: string, user: string) => Promise<any>;
};

interface CallDetails {
    requrester: string;
    requesterName: string;
    requestee: string;
    requesteeName: string;
    roomId: string;
    description: string;
    dateTime: string;
}

export default function Calls(props: CallProps) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [roomId, setRoomId] = React.useState('');
    const [callDetails, setCallDetails] = React.useState<CallDetails[]>([]);
    const [myCallDetails, setMyCallDetails] = React.useState<CallDetails[]>([]);
    const [socket, setSocket] = React.useState(null);
    const [data, setData] = React.useState([]);
    const [audioContext, setAudioContext] = React.useState(null);

    useEffect(() => {
        const newSocket = io('https://ec2-18-212-242-199.compute-1.amazonaws.com');
        newSocket.on('connect', () => { });
        // @ts-ignore
        setSocket(newSocket);
        return () => {
            newSocket.close();
        };
    }, [setSocket]);

    useEffect(() => {
        if (!socket) return;
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: false,
            }).then((stream) => {
                const audioContext = new AudioContext();
                let input = audioContext.createMediaStreamSource(stream);
                let processor = input.context.createScriptProcessor(16384, 1, 1);
                processor.onaudioprocess = function (e) {
                    let floatArray = e.inputBuffer.getChannelData(0);
                    // @ts-ignore
                    setData((oldData) => [...oldData, ...floatArray]);
                }

                input.connect(processor);
                processor.connect(audioContext.destination);
            });
    }, [socket, setData]);

    useEffect(() => {
        if (!socket || !roomId || roomId === '') return;
        let size = 16000 * 2;
        if (data.length < size) return;
        const floatArray = data.slice(0, size);
        const dataToSend = {
            data: floatArray,
        };
        // @ts-ignore
        socket.emit('send_message', dataToSend);
        setData((oldData) => oldData.slice(size));
    }, [socket, data, setData]);

    useEffect(() => {
        if (!socket) return;

        // @ts-ignore
        const onData = (data) => {
            let _audioContext: any = audioContext;
            if (_audioContext === null) {
                // @ts-ignore
                _audioContext = new (window.AudioContext || window.webkitAudioContext)()
                setAudioContext(_audioContext);
            }

            let size = 16000 * 2;
            const audioBuffer = _audioContext.createBuffer(1, size, _audioContext.sampleRate);
            const channelData = audioBuffer.getChannelData(0);
            for (let i = 0; i < size; i++) {
                channelData[i] = data['data'][i];
            }
            const source = _audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(_audioContext.destination);
            source.start();
        };

        // @ts-ignore
        socket.on('receive_message', onData);
        return () => {
            // @ts-ignore
            socket.off('receive_message', onData);
        };
    }, [socket]);

    useEffect(() => {
        async function getData() {
            const calls = await props.getCalls(props.account);
            console.log(calls)

            let callsProcessed: CallDetails[] = [];
            let myCallsProcessed: CallDetails[] = [];
            for (let i = 0; i < calls.length; i++) {
                // @ts-ignore
                const requesterDetails = await props.getUser(props.account, calls[i].requestee);
                // @ts-ignore
                const requesteeDetails = await props.getUser(props.account, calls[i].requester);

                let call = {
                    // @ts-ignore
                    ...calls[i],
                    requesteeName: requesterDetails.userName,
                    requesterName: requesteeDetails.userName,
                };

                if (call.requester.toLowerCase() === props.account.toLowerCase()) {
                    myCallsProcessed.push(call);
                }
                if (call.requestee.toLowerCase() === props.account.toLowerCase()) {
                    callsProcessed.push(call);
                }
            }
            setCallDetails(callsProcessed);
            setMyCallDetails(myCallsProcessed);
        }
        getData();
    }, [props.account]);

    function joinRoom(room1:string) {
        // @ts-ignore
        socket.emit('join', {
            room: room1,
        });
        console.log("joining room"+room1)
    }

    function hungupCall() {
        // @ts-ignore
        socket.emit('leave', {});
    }

    function onClose() {
        setDialogOpen(false);
        setRoomId('');
        hungupCall();
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
                        My requests
                    </div>
                </div>
                <div css={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                }}>
                    {myCallDetails.map((call: CallDetails, index: number) => {
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
                                    Id: {call.roomId}
                                </div>
                                <div css={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                }}>
                                    Requestee: {call.requestee}
                                </div>
                                <div css={{
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }}>
                                    Description: {call.description}
                                </div>
                                <div css={{
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }}>
                                    Time: {call.dateTime}
                                </div>
                                <div css={{
                                    display: 'flex',
                                    gap: '20px',
                                    marginTop: '20px',
                                }}>
                                    <Button
                                        name="Call"
                                        color={"#163e40"}
                                        onClick={async () => {
                                            joinRoom(call.roomId);
                                            setDialogOpen(true);
                                            setRoomId(call.roomId);
                                        }}
                                    />
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
                        Requests
                    </div>
                </div>
                <div css={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                }}>
                    {callDetails.map((call: CallDetails, index: number) => {
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
                                    Id: {call.roomId}
                                </div>
                                <div css={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                }}>
                                    Requester: {call.requrester}
                                </div>
                                <div css={{
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }}>
                                    Description: {call.description}
                                </div>
                                <div css={{
                                    fontSize: '16px',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }}>
                                    Time: {call.dateTime}
                                </div>
                                <div css={{
                                    display: 'flex',
                                    gap: '20px',
                                    marginTop: '20px',
                                }}>
                                    <Button
                                        name="Call"
                                        color={"#163e40"}
                                        onClick={async () => {
                                            joinRoom(call.roomId)
                                            setDialogOpen(true);
                                            setRoomId(call.roomId);
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div >
            <Dialog onClose={onClose} open={dialogOpen}>
                <DialogActions>
                    <Button
                        name="Hungup"
                        color={"#163e40"}
                        onClick={onClose}
                    />
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
