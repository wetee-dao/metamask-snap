import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { DEFAULT_CHAIN_NAME } from '../defaults';
import { getKeyPair } from '../util/getKeyPair';

const AccountsDemo = (addr: string) => {
  return panel([
    heading('Accounts'),
    divider(),
    panel([
      //   image(
      //     '<svg width="13" height="13" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Logo" x="0px" y="0px" viewBox="0 0 1326.1 1410.3" style="enable-background:new 0 0 1326.1 1410.3;" xml:space="preserve"><script xmlns=""/><script xmlns=""/><script xmlns=""/> <style type="text/css"> \t.st0{fill:#E6007A;} </style> <ellipse class="st0" cx="663" cy="147.9" rx="254.3" ry="147.9"/> <ellipse class="st0" cx="663" cy="1262.3" rx="254.3" ry="147.9"/> <ellipse transform="matrix(0.5 -0.866 0.866 0.5 -279.1512 369.5916)" class="st0" cx="180.5" cy="426.5" rx="254.3" ry="148"/> <ellipse transform="matrix(0.5 -0.866 0.866 0.5 -279.1552 1483.9517)" class="st0" cx="1145.6" cy="983.7" rx="254.3" ry="147.9"/> <ellipse transform="matrix(0.866 -0.5 0.5 0.866 -467.6798 222.044)" class="st0" cx="180.5" cy="983.7" rx="148" ry="254.3"/> <ellipse transform="matrix(0.866 -0.5 0.5 0.866 -59.8007 629.9254)" class="st0" cx="1145.6" cy="426.6" rx="147.9" ry="254.3"/> </svg>',
      //   ),
      text('Metamask Address 1'),
      copyable(addr),
      divider(),
      // image(
      //   '<svg width="13" height="13" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 441 441"><script xmlns=""/><script xmlns=""/><script xmlns=""/><defs><style>.cls-1{stroke:#000;stroke-miterlimit:10;}.cls-2{fill:#fff;}</style></defs><title>kusama-ksm-logo</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><rect class="cls-1" x="0.5" y="0.5" width="440" height="440"/><path class="cls-2" d="M373.6,127.4c-5.2-4.1-11.4-9.7-22.7-11.1-10.6-1.4-21.4,5.7-28.7,10.4s-21.1,18.5-26.8,22.7-20.3,8.1-43.8,22.2-115.7,73.3-115.7,73.3l24,.3-107,55.1H63.6L48.2,312s13.6,3.6,25-3.6v3.3s127.4-50.2,152-37.2l-15,4.4c1.3,0,25.5,1.6,25.5,1.6a34.34,34.34,0,0,0,15.4,24.8c14.6,9.6,14.9,14.9,14.9,14.9s-7.6,3.1-7.6,7c0,0,11.2-3.4,21.6-3.1a82.64,82.64,0,0,1,19.5,3.1s-.8-4.2-10.9-7-20.1-13.8-25-19.8a28,28,0,0,1-4.1-27.4c3.5-9.1,15.7-14.1,40.9-27.1,29.7-15.4,36.5-26.8,40.7-35.7s10.4-26.6,13.9-34.9c4.4-10.7,9.8-16.4,14.3-19.8s24.5-10.9,24.5-10.9S378.5,131.3,373.6,127.4Z"/></g></g></svg>',
      // ),
      // text('Account 02 🎩'),
      // copyable('Ck6Xoz2rsPRh2g9...hAiczZFd8NVo'),
    ]),
  ]);
};

export const createAddress = async (chainName?: string): Promise<string> => {
  const account = await getKeyPair(chainName || DEFAULT_CHAIN_NAME);

  if (!account) {
    throw new Error('account not found');
  }

  const _address = account.address;

  /** to show the address to user */
  snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: AccountsDemo(_address),
    },
  });

  return _address;
};
