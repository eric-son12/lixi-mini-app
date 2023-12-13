"use client";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import LixiButton from "./component/LixiButton";
import { useInitData } from "@tma.js/sdk-react";
import { useMemo } from "react";

const ContainerHome = styled.div`
  display: grid;
  grid-template-rows: 85% 15%;
  padding: 1rem;
  height: 100vh;
  text-align: center;
`;

const FeatureEducation = styled.div`
  img {
    max-width: 100%;
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
// const InitData = () => {
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

const TestLCS = () => {
  let a = "";
  const lcsAhihi = localStorage.getItem("test");
  if (!lcsAhihi) {
    localStorage.setItem("test", "ahihihi");
  } else {
    a = JSON.parse(lcsAhihi);
  }

  return <p>{a}</p>;
};

export default function Home() {
  const router = useRouter();

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
        <h3 className="feature-title">Control your money without an account</h3>
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
      {/* <div style={{ maxWidth: "100%" }}>
        <InitData />
      </div> */}
      {/* <TestLCS /> */}
    </ContainerHome>
  );
}
