import { StyledWithdraw } from './styled';
import { chains, Token, TokenOptions } from '../../../../config';
import { SecretNetworkClient, MsgTransfer } from 'secretjs';
import { DropDownMenu } from '../../../DropDownMenu/DropDownMenu';
import { CopyableAddress } from '../CopyableAddress/CopyableAddress';
import { PercentOptions } from '../PercentOptions/PercentOptions';
import { Button } from '../../../Button/Button';
import { useEffect, useRef, useState } from 'react';
import { sleep, suggestTerraToKeplr } from '../../../../commons';
import BigNumber from 'bignumber.js';
import { formatBalance } from '../../../helpers';


interface WithdrawProps {
  token: Token;
  secretjs: SecretNetworkClient | null;
  secretAddress: string;
  balances: Map<string, string>;
  onSuccess: (txhash: string) => any;
  onFailure: (error: any) => any;
  tokenOptions: TokenOptions,
}

export const Withdraw = ({
  token,
  secretjs,
  secretAddress,
  balances,
  onSuccess,
  onFailure,
  tokenOptions,
}: WithdrawProps) => {
  const [targetAddress, setTargetAddress] = useState<string>("");
  const [loadingTx, setLoading] = useState<boolean>(false);
  const [selectedChainIndex, setSelectedChainIndex] = useState<number>(0);
  const inputRef = useRef<any>();
  const maxButtonRef = useRef<any>();

  const sourceChain = chains["Secret Network"];
  const targetChain = chains[token.withdrawals[selectedChainIndex].target_chain_name];
  const availableBalance = balances.get(token.withdrawals[selectedChainIndex].from_denom) || "";
  const withdrawsList = token.deposits.map((chain) => {
    return ({
      name: chain.source_chain_name,
      image: chains[chain.source_chain_name].chain_image
    })
  })

  useEffect(() => {
    (async () => {
      while (!window.keplr || !window.getOfflineSignerOnlyAmino) {
        await sleep(100);
      }

      // Find address on target chain
      const { chain_id: targetChainId } =
        chains[token.withdrawals[selectedChainIndex].target_chain_name];
      if (token.withdrawals[selectedChainIndex].target_chain_name === "Terra") {
        await suggestTerraToKeplr(window.keplr);
      }
      await window.keplr.enable(targetChainId);
      const targetOfflineSigner =
        window.getOfflineSignerOnlyAmino(targetChainId);
      const targetFromAccounts = await targetOfflineSigner.getAccounts();
      setTargetAddress(targetFromAccounts[0].address);
    })();
  }, [selectedChainIndex]);

  const withdraw = async () => {
    if (!secretjs) {
      console.error("No secretjs");
      return;
    }

    if (!inputRef?.current?.value) {
      console.error("Empty withdraw");
      return;
    }

    const normalizedAmount = (inputRef.current.value as string).replace(
      /,/g,
      ""
    );

    if (!(Number(normalizedAmount) > 0)) {
      console.error(`${normalizedAmount} not bigger than 0`);
      return;
    }

    setLoading(true);

    const amount = new BigNumber(normalizedAmount)
      .multipliedBy(`1e${token.decimals}`)
      .toFixed(0, BigNumber.ROUND_DOWN);

    const { withdraw_channel_id, withdraw_gas } =
      chains[token.withdrawals[selectedChainIndex].target_chain_name];
    try {
      const tx = await secretjs.tx.broadcast(
        [
          new MsgTransfer({
            sender: secretAddress,
            receiver: targetAddress,
            sourceChannel: withdraw_channel_id,
            sourcePort: "transfer",
            token: {
              amount,
              denom: token.withdrawals[selectedChainIndex].from_denom,
            },
            timeoutTimestampSec: String(
              Math.floor(Date.now() / 1000) + 15 * 60
            ), // 15 minute timeout
          }),
        ],
        {
          gasLimit: withdraw_gas,
          gasPriceInFeeDenom: 0.25,
          feeDenom: "uscrt",
        }
      );

      if (tx.code === 0) {
        inputRef.current.value = "";
        onSuccess(tx.transactionHash);
      } else {
        onFailure(tx.rawLog);
      }
    } catch (e) {
      onFailure(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <StyledWithdraw>
      <div className="deposit-block">
        <p>Withdraw {token.name} from Secret Network to</p>
        {token.withdrawals.length === 1
          ? <span className='one'>{token.withdrawals[selectedChainIndex].target_chain_name}</span>
          : <DropDownMenu
            list={withdrawsList}
            callback={({ idx }) => setSelectedChainIndex(idx)}
            activeItem={withdrawsList[selectedChainIndex].name}
            activeIcon={withdrawsList[selectedChainIndex].image}
          />
        }
      </div>

      <CopyableAddress title="From" address={secretAddress} prefix={sourceChain.explorer_account}/>
      <CopyableAddress title="To" address={targetAddress} prefix={targetChain.explorer_account}/>

      <div className="available">
        <span className="title">Available to withdraw:</span>
        <span className="cash">
          {availableBalance &&
             <>
              <span>{formatBalance(availableBalance, token.decimals)} </span>
              <span>{token.name}</span>
            </>
          }
        </span>
      </div>

      <div className="amount">
        <span className="title">Amount to Withdraw</span>
        <PercentOptions/>
        <img src={tokenOptions.image} alt="amount"/>
      </div>

      <Button action={withdraw} title={"Withdraw"} isLoading={loadingTx}/>
    </StyledWithdraw>
  )
}