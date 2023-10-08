import detectEthereumProvider from '@metamask/detect-provider';

/**
 *  to check if metamask Flask is installed of not
 */
export async function hasFlask() {
  // This resolves to the value of window.ethereum or null
  const provider = await detectEthereumProvider();

  // web3_clientVersion returns the installed MetaMask version as a string
  const isFlask = (
    await provider?.request({ method: 'web3_clientVersion' })
  )?.includes('flask');

  if (provider && isFlask) {
    console.log('MetaMask Flask successfully detected!');

    // Now you can use Snaps!
  } else {
    console.error('Please install MetaMask Flask!');
  }
}

export async function isSnapInstalled(name: string) {
  const snaps = await ethereum.request({
    method: 'wallet_getSnaps',
  });

  console.log('snaps:',snaps)
  return Object.keys(snaps).includes(`npm:${name}`);
}
