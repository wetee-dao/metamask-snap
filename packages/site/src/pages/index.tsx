import { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN } from '@polkadot/util';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnaps,
  hasFlask,
  isLocalSnap,
  isSnapInstalled,
} from '../utils';
import { InstallFlaskButton, SendButton, Card } from '../components';
import { defaultSnapOrigin } from '../config';
import { buildPayload } from '../polkamask/util/buildPayload';
import { getMyAddress } from '../polkamask/apis/getMyAddress';
import { requestSignJSON } from '../polkamask/apis/requestSign';
import { TxResult, send } from '../polkamask/apis/send';
import subscan from '../assets/subscan.svg';
import { amountToMachine } from '../polkamask/util/utils';

// my tests
hasFlask();
isSnapInstalled('polkamask').then((res) =>
  console.log('polkamask is installed?:', res),
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  text-align: left;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const currentChainName = 'westend';
export const CHAINS = {
  polkadot: {
    ss58Format: 0,
    provider: 'wss://rpc.ibp.network/polkadot',
  },
  westend: {
    ss58Format: 42,
    provider: 'wss://rpc.ibp.network/westend',
  },
};

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [address, setAddress] = useState();
  const [formatted, setNewAddress] = useState();
  const [api, setApi] = useState<ApiPromise>();
  const [balances, setBalances] = useState();
  const [toAddress, setToAddress] = useState<string>();
  const [_signature, setSignature] = useState<string>();
  const [_result, setResult] = useState<TxResult>();
  const [transferAmount, setTransferAmount] = useState<string>();
  const [waitingForUserApproval, setWaiting] = useState<boolean>();

  useEffect(() => {
    const wsProvider = new WsProvider(CHAINS[currentChainName]?.provider);

    ApiPromise.create({ provider: wsProvider }).then(setApi);
  }, []);

  useEffect(() => {
    getSnaps().then((snaps) => {
      console.log('available snaps:', snaps);
    });

    // connectSnap().then((connected) => {
    //   console.log('connected snap:', connected);
    // });
  }, []);

  useEffect(() => {
    api &&
      address &&
      api.derive.accounts.info(address).then((info) => {
        setNewAddress(info?.accountId?.toString());
      });
  }, [api, address]);

  useEffect(() => {
    api && formatted && api.derive.balances?.all(formatted).then(setBalances);
  }, [api, formatted]);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  const handleSendClick = async () => {
    try {
      if (!api || !address || !toAddress) {
        return;
      }
      setWaiting(true);
      const decimal = api.registry.chainDecimals[0];
      const amount = amountToMachine(transferAmount, decimal);
      const params = [toAddress, amount];
      const tx = api.tx.balances.transfer(...params);
      const payload = await buildPayload(api, tx, address);
      if (payload) {
        const signResult = await requestSignJSON(payload);
        setWaiting(false);

        if (signResult?.signature) {
          setSignature(signResult.signature);
          const result = await send(
            payload.address,
            api,
            tx,
            payload,
            signResult.signature,
          );
          console.log('result:', result);
          setResult(result);
        } else {
          // eslint-disable-next-line no-alert
          window.alert('User rejected to sign!');
        }
      }
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleViewBalance = async () => {
    try {
      const _address = await getMyAddress(currentChainName);
      setAddress(_address);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  useEffect(() => {
    state.installedSnap?.id && handleViewBalance();
  }, [state.installedSnap]);

  const handleToAddress = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event?.target?.value && setToAddress(event.target.value);
    },
    [],
  );

  const handleAmount = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event?.target?.value &&
        Number(event?.target?.value) &&
        setTransferAmount(event.target.value);
    },
    [],
  );

  return (
    <Container>
      <Heading>A simple transfer fund scenario</Heading>
      {state.installedSnap && (
        <>
          <Grid container justifyContent="center">
            <Typography variant="h5">
              From: <code>{formatted || 'nothing yet'}</code>
            </Typography>
          </Grid>
          <Grid container justifyContent="center" pt="15px">
            <Typography variant="h5">
              Transferable Balance:{' '}
              {balances ? balances.availableBalance.toHuman() : '00'}
            </Typography>
          </Grid>
          <Grid container justifyContent="center">
            <TextField
              id="outlined-basic"
              label="To"
              variant="outlined"
              sx={{ width: '600px', marginTop: '20px' }}
              inputProps={{ style: { fontSize: 20 } }}
              InputLabelProps={{ style: { fontSize: 20 } }}
              onChange={handleToAddress}
            />
          </Grid>
          <Grid container justifyContent="center">
            <TextField
              id="outlined-basic"
              label="Amount"
              variant="outlined"
              sx={{ width: '600px', marginTop: '20px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="h6">WND</Typography>
                  </InputAdornment>
                ),
                style: { fontSize: 20 },
              }}
              InputLabelProps={{ style: { fontSize: 20 } }}
              onChange={handleAmount}
            />
          </Grid>
        </>
      )}
      <Container>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {state.installedSnap && (
          <Grid
            container
            sx={{
              border: 1,
              p: '10px',
              borderRadius: '10px',
              width: '600px',
            }}
          >
            {toAddress && (
              <Typography variant="h6">
                {`Click to send ${transferAmount} WND funds to recipient address ${toAddress}`}
              </Typography>
            )}
            <Grid container item justifyContent="flex-end" mt="5px">
              <Button
                variant="contained"
                onClick={handleSendClick}
                disabled={
                  !state.installedSnap ||
                  waitingForUserApproval ||
                  !transferAmount ||
                  !toAddress
                }
                sx={{ fontSize: '18px', width: '100%' }}
              >
                {waitingForUserApproval
                  ? 'Approve transaction in Metamask'
                  : 'Transfer Fund'}
              </Button>
            </Grid>
          </Grid>
        )}
        <Grid container pt="15px" justifyContent="center">
          {_signature && (
            <>
              <Typography variant="h5">Received signature:</Typography>
              <Typography variant="h6">{_signature}</Typography>
            </>
          )}
          <Grid container item justifyContent="center" py="15px">
            {_signature && !_result ? (
              <CircularProgress />
            ) : (
              _result && (
                <>
                  {_result?.txHash && (
                    <Grid container justifyContent="center" item>
                      <Typography variant="h5">Transaction Hash:</Typography>
                      <Typography variant="h6">{_result?.txHash}</Typography>
                    </Grid>
                  )}
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    item
                  >
                    <Typography variant="h5">
                      {`Transfer was ${
                        _result.success ? 'SUCCESSFUL' : 'FAILED'
                      }`}
                    </Typography>
                    {_result?.txHash && (
                      <Grid container justifyContent="center" item>
                        <Link
                          href={`https://westend.subscan.io/extrinsic/${_result?.txHash}`}
                          rel="noreferrer"
                          target="_blank"
                          underline="none"
                          sx={{ display: 'block', textAlign: 'center' }}
                        >
                          <Box
                            alt={'subscan'}
                            component="img"
                            height="20px"
                            mt="9px"
                            src={subscan}
                            width="20px"
                          />
                        </Link>
                      </Grid>
                    )}
                  </Grid>
                </>
              )
            )}
          </Grid>
        </Grid>
        {/* <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice> */}
      </Container>
    </Container>
  );
};

export default Index;
