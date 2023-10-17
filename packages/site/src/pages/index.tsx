import { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN } from '@polkadot/util';
import { Grid, TextField } from '@mui/material';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getSnaps, hasFlask, isLocalSnap, isSnapInstalled } from '../utils';
import { InstallFlaskButton, SendButton, Card } from '../components';
import { defaultSnapOrigin } from '../config';
import { buildPayload } from '../polkamask/utils/buildPayload';
import { getMyAddress } from '../polkamask/apis/getMyAddress';
import { requestSignJSON } from '../polkamask/apis/requestSign';
import { send } from '../polkamask/apis/send';

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
  const [transferAmount, setTransferAmount] = useState<number>(1);

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
      const decimal = api.registry.chainDecimals[0];
      const amount = new BN(transferAmount).mul(
        new BN(10).pow(new BN(decimal)),
      );
      const params = [toAddress, amount];
      const tx = api.tx.balances.transfer(...params);
      const payload = await buildPayload(api, tx, address);
      if (payload) {
        const { signature } = await requestSignJSON(payload);
        console.log('signature:', signature);
        send(payload.address, api, tx, payload, signature);
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

  return (
    <Container>
      <Heading>
        Welcome to <Span>PolkaMask</Span>
      </Heading>
      <Subtitle>
        From: <code>{formatted || 'nothing yet'}</code>
      </Subtitle>
      <Subtitle>
        Transferable Balance:{' '}
        {balances ? balances.availableBalance.toHuman() : '00'}
      </Subtitle>
      <Grid container justifyContent="center">
        <TextField
          id="outlined-basic"
          label="To"
          variant="outlined"
          sx={{ width: '600px', marginTop: '30px' }}
          inputProps={{ style: { fontSize: 20 } }}
          InputLabelProps={{ style: { fontSize: 20 } }}
          onChange={handleToAddress}
        />
      </Grid>
      <CardContainer>
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
        {/* {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )} */}
        {/* {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )} */}
        <Card
          fullWidth
          content={{
            title: 'Transfer Fund',
            description: `Click to send funds to recipient address ${toAddress || ''
              }`,
            button: (
              <SendButton
                onClick={handleSendClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
        // fullWidth={
        //   isMetaMaskReady &&
        //   Boolean(state.installedSnap) &&
        //   !shouldDisplayReconnectButton(state.installedSnap)
        // }
        />
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
