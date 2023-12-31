"use client";
import React, { useEffect, useState } from "react";
import {
  useBackButton,
  usePopup,
  useMainButton,
  useQRScanner,
  useHapticFeedback,
} from "@tma.js/sdk-react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import LixiButton from "../component/LixiButton";

const ContainerSetting = styled.div`
  padding: 1rem;
  .setting-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    img {
      align-self: center;
      filter: drop-shadow(2px 4px 6px black);
    }
    .header-setting {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      .title {
        margin-top: 1rem;
      }
      .subtitle {
        span {
          font-size: 12px;
          color: #d5d5d5;
        }
      }
    }
  }
  .setting-content {
    padding: 1rem 0;
    .setting-item {
      margin-bottom: 1rem;
      .title {
        padding: 1rem;
        font-size: 16px;
        font-weight: 400;
        color: #edeff099;
      }
      .ico-alert {
        align-self: center !important;
      }
    }
    .seed-phrase {
      text-align: center;
      letter-spacing: 0.4px;
      color: var(--color-primary);
    }
    button {
      width: 100%;
    }
    .address-string {
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      margin: 1rem 0;
      color: #28a5e0;
    }
  }
  .collapse-backup-seed {
    margin: 0 !important;
  }
`;

export default function Setting() {
  const router = useRouter();

  const mainButton = useMainButton();
  const backButton = useBackButton();
  const popUp = usePopup();
  const haptic = useHapticFeedback();

  useEffect(() => {
    backButton.show();
  }, []);

  useEffect(() => {
    backButton.on("click", onBackButtonClick);
  }, [backButton]);

  const onBackButtonClick = () => {
    router.back();
    backButton.hide();
    mainButton.hide();
  };

  const handleDeleteAccount = () => {
    haptic.notificationOccurred("warning");
    popUp
      .open({
        title: "DELETE ACCOUNT",
        message:
          "Please backup your seed before delete account to avoid lost your account!",
        buttons: [
          { id: "delete-cancel", type: "cancel" },
          { id: "delete-ok", type: "ok" },
        ],
      })
      .then((rs) => {
        if (rs === "delete-ok") {
          localStorage.removeItem("accounts");
        }
        console.log(rs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleVerifyAddress = () => {
    haptic.notificationOccurred("warning");
    popUp
      .open({
        title: "VERIFY ADDRESS",
        message:
          "Your address: eCash:qp8ks7622cklc7c9pm2d3ktwzctack6njq6q83ed9x",
        buttons: [
          { id: "delete-cancel", type: "cancel" },
          { id: "delete-ok", type: "ok" },
        ],
      })
      .then((rs) => {
        // if (rs === 'delete-ok') {

        // }
        console.log(rs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ContainerSetting>
      <div className="setting-info">
        <img width={96} height={96} src="/setting.svg" alt="" />
        <div className="header-setting">
          <h2 className="title">Setting</h2>
        </div>
      </div>
      <div className="setting-content">
        <div className="setting-item">
          <p className="title">Verify address</p>
          <Alert
            icon={
              <CheckCircleOutline className="ico-alert" fontSize="inherit" />
            }
            severity="warning"
          >
            Please verify every 1 month to keep your address always updated on
            Telegram.
          </Alert>
          <Accordion className="collapse-backup-seed">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <p>Click to verify your address</p>
            </AccordionSummary>
            <AccordionDetails>
              <p className="address-string">
                eCash:qp8ks7622cklc7c9pm2d3ktwzctack6njq6q83ed9x
              </p>
              <LixiButton title="Verify" onClickItem={handleVerifyAddress} />
            </AccordionDetails>
          </Accordion>
        </div>

        <div className="setting-item">
          <p className="title">Backup seed phrase</p>
          <Alert
            icon={
              <CheckCircleOutline className="ico-alert" fontSize="inherit" />
            }
            severity="warning"
          >
            Your seed phrase is the only way to restore your account. Write it
            down. Keep it safe.
          </Alert>
          <Accordion className="collapse-backup-seed">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <p>Click to reveal seed phrase</p>
            </AccordionSummary>
            <AccordionDetails>
              <LixiButton
                title="Backup seed game"
                onClickItem={() => router.push("/backup-game")}
              />
            </AccordionDetails>
          </Accordion>
        </div>

        <div className="setting-item">
          <p className="title">Delete account</p>
          <Alert
            icon={
              <CheckCircleOutline className="ico-alert" fontSize="inherit" />
            }
            severity="error"
          >
            Delete your account in platform. You can import it later by seed
            phrase have been stored.
          </Alert>
          <Accordion className="collapse-backup-seed">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <p>Click to delete account</p>
            </AccordionSummary>
            <AccordionDetails>
              <LixiButton title="Delete" onClickItem={handleDeleteAccount} />
            </AccordionDetails>
          </Accordion>
        </div>

        <div className="setting-item">
          <p className="title">Import account</p>
          <Alert
            icon={
              <CheckCircleOutline className="ico-alert" fontSize="inherit" />
            }
            severity="info"
          >
            Enter your recovery phrase (12 words) in the correct order. Separate
            each word with a single space only (no commas or any other
            punctuation).
          </Alert>
          <Accordion className="collapse-backup-seed">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <p>Click to import account</p>
            </AccordionSummary>
            <AccordionDetails>
              <LixiButton
                title="Import account"
                onClickItem={() => router.push("/import-wallet")}
              />
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </ContainerSetting>
  );
}
