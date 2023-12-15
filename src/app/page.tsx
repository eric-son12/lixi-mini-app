"use client";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import LixiButton from "./component/LixiButton";
import { useInitData } from "@tma.js/sdk-react";
import { useEffect, useMemo } from "react";
import { atob } from "buffer";

const ContainerHome = styled.div`
  display: grid;
  grid-template-rows: 85% 15%;
  padding: 1rem;
  height: 100vh;
  text-align: center;
`;

const FeatureEducation = styled.div`
  img {
    max-width: 70%;
  }
  .feature-title {
    font-weight: 600;
    align-items: center;
    text-align: center;
    line-height: 34px;
  }
  .feature-subtitle {
    font-size: 16px;
    text-align: center;
    color: #9aa5ac;
    font-weight: 300;
    padding-top: 15px;
    line-height: 28px;
  }
`;

const FunctionalBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 0.5rem;
`;

/**
 * Displays current application init data.
 */
// const InitDataSDK = () => {
//   const initData = useInitData();

//   const initDataJson = useMemo(() => {
//     if (!initData) {
//       return "Init data is empty.";
//     }
//     const {
//       authDate,
//       chat,
//       hash,
//       canSendAfter,
//       queryId,
//       receiver,
//       user,
//       startParam,
//     } = initData;

//     return JSON.stringify(
//       {
//         authDate,
//         chat,
//         hash,
//         canSendAfter,
//         queryId,
//         receiver,
//         user,
//         startParam,
//       },
//       null,
//       " "
//     );
//   }, [initData]);

//   return (
//     <pre>
//       <code>{initDataJson}</code>
//     </pre>
//   );
// };

export default function Home() {
  const router = useRouter();

  const initData = useInitData();

  const initDataJson = useMemo(() => {
    if (!initData) {
      return "Init data is empty.";
    }
    const {
      authDate,
      chat,
      hash,
      canSendAfter,
      queryId,
      receiver,
      user,
      startParam,
    } = initData;

    return JSON.stringify(
      {
        authDate,
        chat,
        hash,
        canSendAfter,
        queryId,
        receiver,
        user,
        startParam,
      },
      null,
      " "
    );
  }, [initData]);

  useEffect(() => {
    localStorage.setItem('initDATA', initDataJson);
    console.log("DATAJSON", initDataJson);
    // const { startParam } = initData;
    //     const objectParams = JSON.parse(atob(startParam || ''));
    //     if (objectParams) {
    //       router.push('send');
    //     }
  }, [initDataJson]);

  useEffect(() => {
    const lcsAccount = localStorage.getItem("accounts");
    if (lcsAccount === "true") {
      navigateWallet();
    }
  }, []);

  const navigateWallet = () => {
    router.push("/wallet");
  };

  const navigateImport = () => {
    router.push("/import-wallet");
  };
  return (
    <ContainerHome>
      <FeatureEducation>
        <img className="feature-banner" src="/lixi-credit.svg" alt="" />
        <h3 className="feature-title">
          Send crypto currencies to anyone on Telegram.
        </h3>
        <p className="feature-subtitle">
          Lixi app allows you to privately store, manage, and use your crypto
          funds without having to trust a centralized bank or exchange
        </p>
      </FeatureEducation>
      <FunctionalBar>
        <LixiButton
          title="Create new account"
          classCustom="create-new-account"
          onClickItem={() => navigateWallet()}
        />

        <LixiButton
          title="Import from backup"
          classCustom="no-border-btn import-backup"
          onClickItem={() => navigateImport()}
        />
      </FunctionalBar>
    </ContainerHome>
  );
}
