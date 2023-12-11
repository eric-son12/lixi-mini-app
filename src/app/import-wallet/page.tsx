"use client";
import React from "react";
import styled from '@emotion/styled'
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import LixiButton from "../component/LixiButton";

const CreateAccount = styled.div``;

const ImportBackup = styled.div``;

export default function ImportWallet() {
  const router = useRouter();

  const navigateWallet = () => {
    router.push("/wallet");
  };

  return (
    // <ContainerHome>
    //   <FeatureEducation>
    //     <img
    //       className="feature-banner"
    //       src="https://wallet.abcpay.cash/assets/img/onboarding/feature-education-dark-2.svg"
    //       alt=""
    //     />
    //     <h3 className="feature-title">Control your money without an account</h3>
    //     <p className="feature-subtitle">
    //       AbcPay allows you to privately store, manage, and use your crypto
    //       funds without having to trust a centralized bank or exchange
    //     </p>
    //   </FeatureEducation>
    //   <FunctionalBar>
    //     <LixiButton
    //       title="Create new account"
    //       classCustom="outline-btn create-new-account"
    //       onClickItem={() => navigateWallet()}
    //     />

    //     <LixiButton
    //       title="Import from backup"
    //       classCustom="no-boder-btn import-backup"
    //     />
    //   </FunctionalBar>
    // </ContainerHome>
    <div>Import</div>
  );
}
