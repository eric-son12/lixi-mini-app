"use client";
import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { useHapticFeedback } from "@tma.js/sdk-react";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LixiButton from "../component/LixiButton";
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
    .balance-header {
      display: flex;
      justify-content: space-between;
      .title-balance {
        font-size: 18px;
        font-weight: 500;
      }
    }
    .balance-content {
      text-align: center;
      padding: 2rem;
      background: #303031;
      margin: 1rem 0;
      border-radius: 0.5rem;
      .amount {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        font-size: 26px;
        font-weight: 500;
        span {
          font-weight: 400;
          font-size: 16px;
          letter-spacing: 0.25px;
          opacity: 0.6;
        }
        svg {
          opacity: 0.6;
        }
      }
      .fiat-rate {
        font-weight: 400;
        font-size: 16px;
        letter-spacing: 0.25px;
        opacity: 0.6;
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
  .transaction-history {
    display: grid;
    grid-template-rows: auto 1fr;
    margin-top: 2rem;
    padding: 1rem;
    background: #303031;
    border-radius: 1rem;
    .title {
      font-size: 12px;
      font-weight: 400;
      text-transform: uppercase;
    }
    .transaction-detail {
      padding: 1rem 0;
    }
    .ghost-town {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 2rem;
      img {
        max-width: 20%;
      }
      .blank-title {
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 0.25px;
      }
      .blank-subtitle {
        text-align: center;
        font-size: 14px;
        letter-spacing: 0.25px;
      }
    }
  }
`;

export default function Wallet() {
  const router = useRouter();
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const haptic = useHapticFeedback();

  const handleHideBalance = () => {
    haptic.impactOccurred('heavy');
    setHideBalance(!hideBalance);
  }

  const navigateReceive = () => {
    router.push("/receive");
  };

  const navigateSend = () => {
    router.push("/send");
  };


  return (
    <ContainerWallet>
      <Header />
      <WalletInfoContainer>
        <div className="currency-info">
          <img className="curency-image" src="/xec.svg" alt="" />
          <div className="curency-info">
            <p className="coin-symbol">eCash</p>
            <h3 className="coin-name">XEC</h3>
          </div>
        </div>
        <div className="balance">
          <div className="balance-header">
            <h2 className="title-balance">Total balance:</h2>
            <div onClick={handleHideBalance}>
              {hideBalance ? (
                <RemoveRedEyeOutlinedIcon />
              ) : (
                <VisibilityOffOutlinedIcon />
              )}
            </div>
          </div>
          <div className="balance-content">
            {hideBalance ? (
              <>
                <p className="amount">******</p>
                <p className="fiat-rate">******</p>
              </>
            ) : (
              <>
                <p className="amount">
                  14,624 <span>XEC</span>
                </p>
                <p className="fiat-rate">~ 2.20 USD</p>
              </>
            )}
          </div>
        </div>
        <div className="group-action-wallet">
          <LixiButton
            icon={<img src="/send.svg" />}
            title="Send"
            onClickItem={() => navigateSend()}
          />
          <LixiButton
            icon={<img src="/request.svg" />}
            title="Receive"
            onClickItem={() => navigateReceive()}
          />
        </div>
        <div className="transaction-history">
          <h5 className="title">Transaction History</h5>
          <div className="transaction-detail">
            {/* <div className="item">

            </div> */}
            <div className="ghost-town">
              <img src="/ghost.svg" alt="" />
              <h4 className="blank-title">No History Yet</h4>
              <p className="blank-subtitle">
                Once you start making transactions, they will appear here.
              </p>
            </div>
          </div>
        </div>
      </WalletInfoContainer>
    </ContainerWallet>
  );
}
