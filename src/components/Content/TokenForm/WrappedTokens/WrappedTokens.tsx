import { rootIcons, tokenIcons } from "../../../../assets/images";
import { StyledWrapElem } from "./styled";
import { Token, TokenOptions } from "../../../../types";
import { useEffect, useState } from "react";
import { SecretNetworkClient } from "secretjs";
import { getTokenBalance, getSnipBalance } from "../../Helpers/data";
import { fixedBalance, usdString, formatBalance } from "../../Helpers/format";
import { setKeplrViewingKey } from "../../Helpers/keplr";
import { Loader } from "../../Loader/Loader";

interface WrappedTokenProps {
  currentToken: Token;
  secretjs: SecretNetworkClient | null;
  secretAddress: string;
  tokenPrice: number;
}

export const UnwrappedToken = ({
  currentToken,
  secretjs,
  secretAddress,
  tokenPrice,
}: WrappedTokenProps) => {
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [loadingTokenBalance, setLoadingTokenBalance] =
    useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (secretjs && secretAddress) {
      getTokenBalance(
        currentToken,
        secretAddress,
        setTokenBalance,
        setLoadingTokenBalance
      );
      interval = setInterval(() => {
        getTokenBalance(
          currentToken,
          secretAddress,
          setTokenBalance,
          setLoadingTokenBalance
        );
      }, 6000);
    }

    return () => {
      setTokenBalance("0");
      clearInterval(interval);
    };
  }, [currentToken, secretjs, secretAddress]);
  return (
    <StyledWrapElem>
      <div className="img-wrap">
        <img className="big-img" src={currentToken.image} alt="" />
      </div>

      {loadingTokenBalance ? (
        <Loader />
      ) : (
        <div className="cash-wrap">
          <p className="scrt">
            {fixedBalance(tokenBalance, currentToken.decimals)}
            <span>{` ${currentToken.name}`}</span>
          </p>
          <div className="content">
            <p>
              {usdString.format(
                formatBalance(tokenBalance, currentToken.decimals, tokenPrice)
              )}
            </p>
          </div>
        </div>
      )}
    </StyledWrapElem>
  );
};

export const WrappedToken = ({
  currentToken,
  secretjs,
  secretAddress,
  tokenPrice,
}: WrappedTokenProps) => {
  const [snipBalance, setSnipBalance] = useState<string>("0");
  const [loadingSnipBalance, setLoadingSnipBalances] = useState<boolean>(false);
  const [viewKeyError, setViewKeyError] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (secretjs && secretAddress) {
      getSnipBalance(
        currentToken,
        secretjs,
        secretAddress,
        setSnipBalance,
        setViewKeyError,
        setLoadingSnipBalances
      );
      interval = setInterval(() => {
        getSnipBalance(
          currentToken,
          secretjs,
          secretAddress,
          setSnipBalance,
          setViewKeyError,
          setLoadingSnipBalances
        );
      }, 6000);
    }

    return () => {
      setSnipBalance("0");
      clearInterval(interval);
    };
  }, [currentToken, secretjs, secretAddress]);

  const viewKeyHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setKeplrViewingKey(currentToken.address, setViewKeyError);
  };

  return (
    <StyledWrapElem>
      <div className="img-wrap">
        <img className="big-img" src={currentToken.image} alt="" />
        <img className="small-img" src={tokenIcons.scrt} alt="" />
      </div>
      {loadingSnipBalance ? (
        <Loader />
      ) : (
        <div className="cash-wrap">
          <p className="scrt">
            {fixedBalance(snipBalance, currentToken.decimals)} s
            <span>{currentToken.name}</span>
          </p>
          <div className="content">
            {viewKeyError ? (
              <span onClick={viewKeyHandler}>Set Viewing Key</span>
            ) : (
              <span>
                {usdString.format(
                  formatBalance(snipBalance, currentToken.decimals, tokenPrice)
                )}
              </span>
            )}
          </div>
        </div>
      )}
    </StyledWrapElem>
  );
};
