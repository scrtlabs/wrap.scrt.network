import { SigningStargateClient } from "@cosmjs/stargate";
import { Chain, Token } from "../../../types";
import { gasToFee, sleep, SuggestedChains } from "../../../commons";

export async function setupCosmjs(
  setCosmjs: React.Dispatch<React.SetStateAction<SigningStargateClient | null>>,
  setAdressIBC: React.Dispatch<React.SetStateAction<string>>,
  targetChain: Chain | null,
  currentToken: Token
) {
  if (!window.keplr || !window.getOfflineSignerOnlyAmino) {
    return;
  }
  if (["LUNC", "UST"].includes(currentToken.name.toUpperCase())) {
    await window.keplr.experimentalSuggestChain(SuggestedChains.TERRA);
  } else if (SuggestedChains.hasOwnProperty(currentToken.name)) {
    await window.keplr.experimentalSuggestChain(
      SuggestedChains[currentToken.name]
    );
  }
  // Initialize cosmjs on the target chain, because it has sendIbcTokens()

  try {
    await window.keplr.enable(targetChain!.chain_id);
  } catch (e) {
    console.log(e);
  }
  const sourceOfflineSigner = window.getOfflineSignerOnlyAmino(
    targetChain!.chain_id
  );
  const depositFromAccounts = await sourceOfflineSigner.getAccounts();
  setAdressIBC(depositFromAccounts[0].address);
  const cosmjs = await SigningStargateClient.connectWithSigner(
    targetChain!.rpc,
    sourceOfflineSigner,
    { prefix: targetChain!.bech32_prefix, broadcastPollIntervalMs: 10_000 }
  );
  setCosmjs(cosmjs);
}
