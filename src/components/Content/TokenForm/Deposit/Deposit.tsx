import { DropDownMenu } from '../../../DropDownMenu/DropDownMenu';
import { Percents, chains, Token, TokenOptions } from '../../../../config';
import { CopyableAddress } from '../CopyableAddress/CopyableAddress';
import { PercentOptions } from '../PercentOptions/PercentOptions';
import { Button } from '../../../Button/Button';
import { useEffect, useRef, useState } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { gasToFee, sleep, suggestTerraToKeplr } from '../../../../commons';
import { formatBalance } from '../../../helpers';
import BigNumber from 'bignumber.js';
import { Loader } from '../../Loader/Loader';

interface DepositProps {
  token: Token,
  secretAddress: string,
  onSuccess: (txhash: string) => any,
  onFailure: (error: any) => any,
  tokenOptions: TokenOptions,
}

export const Deposit = ({ tokenOptions, token, secretAddress, onSuccess, onFailure }: DepositProps) => {
  const [sourceAddress, setSourceAddress] = useState<string>("");
  const [availableBalance, setAvailableBalance] = useState<string>("");
  const [loadingTx, setLoading] = useState<boolean>(false);
  const [sourceCosmJs, setSourceCosmJs] = useState<SigningStargateClient | null>(null);
  const [selectedChainIndex, setSelectedChainIndex] = useState<number>(0);
  const [fetchBalanceInterval, setFetchBalanceInterval] = useState<any>(null);
  const [percent, setPercent] = useState(Percents.v100)
  const inputRef = useRef<any>();

  const sourceChain = chains[token.deposits[selectedChainIndex].source_chain_name];
  const targetChain = chains["Secret Network"];
  const depositsList = token.deposits.map((chain) => {
    return ({
      name: chain.source_chain_name,
      image: chains[chain.source_chain_name].chain_image
    })
  })

  const fetchSourceBalance = async (sourceAddress: string) => {
    const url = `${
      chains[token.deposits[selectedChainIndex].source_chain_name].lcd
    }/bank/balances/${sourceAddress}`;
    try {
      const response = await fetch(url);
      const result: {
        height: string;
        result: Array<{ denom: string; amount: string }>;
      } = await response.json();

      const balance =
        result.result.find(
          (c) => c.denom === token.deposits[selectedChainIndex].from_denom
        )?.amount || "0";
      console.log(balance);
      setAvailableBalance(balance);
    } catch (e) {
      console.error(`Error while trying to query ${url}:`, e);
    }
  };

  useEffect(() => {
    setAvailableBalance("");

    if (!sourceAddress) {
      return;
    }

    if (fetchBalanceInterval) {
      clearInterval(fetchBalanceInterval);
    }

    fetchSourceBalance(sourceAddress);
    const interval = setInterval(
      () => fetchSourceBalance(sourceAddress),
      10_000
    );
    setFetchBalanceInterval(interval);

    return () => clearInterval(interval);
  }, [sourceAddress]);
  useEffect(() => {
    (async () => {
      while (!window.keplr || !window.getOfflineSignerOnlyAmino) {
        await sleep(100);
      }

      if (["LUNA", "UST"].includes(token.name.toUpperCase())) {
        await suggestTerraToKeplr(window.keplr);
      }
      // Initialize cosmjs on the target chain, because it has sendIbcTokens()
      const { chain_id, rpc, bech32_prefix } =
        chains[token.deposits[selectedChainIndex].source_chain_name];
      await window.keplr.enable(chain_id);
      const sourceOfflineSigner = window.getOfflineSignerOnlyAmino(chain_id);
      const depositFromAccounts = await sourceOfflineSigner.getAccounts();
      setSourceAddress(depositFromAccounts[0].address);
      const cosmjs = await SigningStargateClient.connectWithSigner(
        rpc,
        sourceOfflineSigner,
        { prefix: bech32_prefix, broadcastPollIntervalMs: 10_000 }
      );
      setSourceCosmJs(cosmjs);
    })();
  }, [selectedChainIndex]);
  useEffect(() => {
    setSelectedChainIndex(0)
  }, [tokenOptions])

  const deposit = async () => {
    if (!sourceCosmJs) {
      console.error("No cosmjs");
      return;
    }

    if (!inputRef?.current?.value) {
      console.error("Empty deposit");
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

    const { deposit_channel_id, deposit_gas } =
      chains[token.deposits[selectedChainIndex].source_chain_name];
    try {
      const { transactionHash } = await sourceCosmJs.sendIbcTokens(
        sourceAddress,
        secretAddress,
        {
          amount,
          denom: token.deposits[selectedChainIndex].from_denom,
        },
        "transfer",
        deposit_channel_id,
        undefined,
        Math.floor(Date.now() / 1000) + 15 * 60, // 15 minute timeout
        gasToFee(deposit_gas)
      );
      inputRef.current.value = "";
      onSuccess(transactionHash);
    } catch (e) {
      onFailure(e);
    } finally {
      setLoading(false);
    }
  }

  const AvailableDeposit = () => {
    if (availableBalance === "") {
      return <Loader/>;
    }

    const prettyBalance = formatBalance(availableBalance, token.decimals)

    if (prettyBalance === "NaN") {
      return <>Error</>;
    }

    return (
      <span
        className="available-deposit"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.value = prettyBalance
          }
          setPercent(Percents.v100)
        }}>
        ${prettyBalance} ${token.name}
      </span>
    )
  }

  const calculateBalancePart = (percents: Percents) => {
    const prettyBalance = formatBalance(availableBalance, token.decimals)
    const numberPercent = parseInt(percents)
    const balancePart = Number(prettyBalance) / 100 * numberPercent

    if (prettyBalance === "NaN") {
      return
    }

    inputRef.current.value = String(balancePart)
  }

  return (
    <div>
      <div className="deposit-block">
        <p>Deposit {token.name} from</p>
        {token.deposits.length === 1
          ? <span className="one">{token.deposits[selectedChainIndex].source_chain_name}</span>
          : <DropDownMenu
              list={depositsList}
              callback={({ idx }) => setSelectedChainIndex(idx)}
              activeItem={depositsList[selectedChainIndex].name}
              activeIcon={depositsList[selectedChainIndex].image}
            />
        }

        <p>to Secret Network</p>
      </div>

      <CopyableAddress title="From" address={sourceAddress} prefix={sourceChain.explorer_account}/>
      <CopyableAddress title="To" address={secretAddress} prefix={targetChain.explorer_account}/>

      <div className="available">
        <span className="title">Available to deposit:</span>
        <span className="cash">
          <AvailableDeposit/>
        </span>
      </div>

      <div className="amount">
        <input ref={inputRef} placeholder="Amount to Deposit"/>
        <PercentOptions percent={percent} setPercent={setPercent} cb={calculateBalancePart}/>
        <img src={token.image} alt="amount"/>
      </div>

      <Button action={deposit} title={"deposit"} isLoading={loadingTx}/>
    </div>
  )
}