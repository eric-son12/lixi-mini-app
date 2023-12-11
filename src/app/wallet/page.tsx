"use client";
import React from "react";
import styled from '@emotion/styled'
import LixiButton from "../component/LixiButton";
import { useRouter } from "next/navigation";
import Header from "../component/Header";

const ContainerWallet = styled.div``;

const WalletInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  .currency-info {
    text-align: center;
    .curency-image {
      width: 96px;
      height: 96px;
    }
  }
  .balance {
    width: 100%;
    margin: 1rem 0;
    align-self: flex-start;
    .title-balance {
      // font-size: 18px;
      // font-weight: 500;
    }
    .amount {
      font-size: 26px;
      text-align: center;
      padding: 2rem;
      background: #303031;
      margin: 1rem 0;
      border-radius: 1rem;
      span {
        font-weight: 500;
        font-size: 12px;
      }
    }
  }
  .group-action-wallet {
    width: 100%;
    display: flex;
    gap: 8px;
    button {
      min-width: auto !important;
      width: 100% !important;
    }
  }
`;

export default function Wallet() {
    const router = useRouter();
    const navigateReceive = () => {
        router.push('/receive');
    }
    const navigateSend = () => {
        router.push('/send');
    }
  return (
    <ContainerWallet>
      <Header/>
      <WalletInfoContainer>
        <div className="currency-info">
          <img className="curency-image" src="/xec.svg" alt="" />
          <div className="curency-info">
            <p className="coin-symbol">eCash</p>
            <h3 className="coin-name">XEC</h3>
          </div>
        </div>
        <div className="balance">
          <h2 className="title-balance">Balance</h2>
          <p className="amount">
            1,000 <span>XEC</span>
          </p>
        </div>
        <div className="group-action-wallet">
          <LixiButton icon={<img src="/send.svg"/>} title="Send" onClickItem={() => navigateSend()}/>
          <LixiButton icon={<img src="/request.svg"/>} title="Receive" onClickItem={() => navigateReceive()}/>
        </div>
        {/* <div className="list-coin-available">
        <div className="coin-item">
          <img src="" alt="" />
          <div>
            <p>eCash</p>
            <p>
              <span>9999</span> XEC
            </p>
          </div>
          <div>
            <span>$</span>
            <span>14.12</span>
          </div>
        </div>
      </div> */}
      </WalletInfoContainer>
    </ContainerWallet>
  );
}
