import { rootIcons, tokenIcons } from "../../../../assets/images";
import { StyledWrapElem } from "./styled";
import { Token, TokenOptions } from "../../../../config";
import { useEffect, useState } from "react";
import { SecretNetworkClient } from "secretjs";
import { getTokenBalance, getSnipBalance } from "../../Helpers/data";
import { fixedBalance, usdString, formatBalance } from "../../Helpers/format";
import { getCurrentToken } from "../../../../commons";

interface WrappedTokenProps {
  tokenOptions: TokenOptions;
  secretjs: SecretNetworkClient | null;
  secretAddress: string;
  price: number;
}

export const UnwrappedToken = ({
  tokenOptions,
  secretjs,
  secretAddress,
  price,
}: WrappedTokenProps) => {
  const [tokenBalance, setTokenBalance] = useState<string>("0");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (secretjs && secretAddress) {
      let token = getCurrentToken(tokenOptions);
      getTokenBalance(token, secretAddress, setTokenBalance);
      interval = setInterval(() => {
        getTokenBalance(token, secretAddress, setTokenBalance);
      }, 6000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [tokenOptions, secretjs, secretAddress]);
  return (
    <StyledWrapElem>
      <div className="img-wrap">
        <img className="big-img" src={tokenOptions.image} alt="" />
      </div>

      <div className="cash-wrap">
        <p className="scrt">
          {fixedBalance(tokenBalance, getCurrentToken(tokenOptions).decimals)}
          <span>{` ${tokenOptions.name}`}</span>
        </p>
        <div className="content">
          <p>
            {usdString.format(
              formatBalance(
                tokenBalance,
                getCurrentToken(tokenOptions).decimals,
                price
              )
            )}
          </p>
        </div>
      </div>
    </StyledWrapElem>
  );
};

export const WrappedToken = ({
  tokenOptions,
  secretjs,
  secretAddress,
  price,
}: WrappedTokenProps) => {
  const [snipBalance, setSnipBalance] = useState<string>("0");
  const [viewKeyError, setViewKeyError] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (secretjs && secretAddress) {
      let token = getCurrentToken(tokenOptions);
      getSnipBalance(
        token,
        secretjs,
        secretAddress,
        setSnipBalance,
        setViewKeyError
      );
      interval = setInterval(() => {
        getSnipBalance(
          token,
          secretjs,
          secretAddress,
          setSnipBalance,
          setViewKeyError
        );
      }, 6000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [tokenOptions, secretjs, secretAddress]);

  return (
    <StyledWrapElem>
      <div className="img-wrap">
        <img className="big-img" src={tokenOptions.image} alt="" />
        <img className="small-img" src={tokenIcons.scrt} alt="" />
      </div>

      <div className="cash-wrap">
        <p className="scrt">
          {fixedBalance(snipBalance, getCurrentToken(tokenOptions).decimals)} s
          <span>{tokenOptions.name}</span>
        </p>
        <div className="content">
          <p>
            {usdString.format(
              formatBalance(
                snipBalance,
                getCurrentToken(tokenOptions).decimals,
                price
              )
            )}
          </p>
        </div>
      </div>
    </StyledWrapElem>
  );
};
