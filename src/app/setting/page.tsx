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
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";

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
  }
`;

export default function Setting() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [handleName, setHandleName] = useState<string>("");

  // const mainButton = useMainButton();
  // const backButton = useBackButton();
  // const popUp = usePopup();
  // const scanner = useQRScanner();
  // const haptic = useHapticFeedback();

  // useEffect(() => {
  //   mainButton.enable().show();
  //   mainButton.setText("Send");
  //   backButton.show();
  // }, []);

  // useEffect(() => {
  //   mainButton.on("click", onMainButtonClick);
  //   backButton.on("click", onBackButtonClick);
  // }, [mainButton, backButton]);

  // const onMainButtonClick = () => {
  //   haptic.notificationOccurred("warning");
  //   popUp
  //     .open({
  //       title: "Popup Title",
  //       message: "Popup Description",
  //       buttons: [
  //         { id: "send-cancel", type: "cancel" },
  //         { id: "send-ok", type: "ok" },
  //       ],
  //     })
  //     .then((rs) => {
  //       console.log(rs);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const ScanQRCode = () => {
  //   haptic.notificationOccurred("warning");
  //   scanner.open("Scan the barcode").then((content) => {
  //     console.log(content);
  //     setAddress(content || "null");
  //     scanner.close();
  //   });
  // };

  // const onBackButtonClick = () => {
  //   router.back();
  //   backButton.hide();
  //   mainButton.hide();
  // };

  return (
    <ContainerSetting>
      <div className="setting-info">
        <img width={96} height={96} src="/send.svg" alt="" />
        <div className="header-setting">
          <h2 className="title">Setting</h2>
        </div>
      </div>
      <div className="setting-content">
        <div className="backup-seed-phrase">
          <Alert
            icon={<CheckCircleOutline fontSize="inherit" />}
            severity="warning"
          >
            Your seed phrase is the only way to restore your account. Write it
            down. Keep it safe.
          </Alert>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <p>Click to reveal seed phrase</p>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                firm panther globe worry affair solve monitor reason carpet
                yellow return labor
              </p>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </ContainerSetting>
  );
}
