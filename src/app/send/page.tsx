"use client";
import React, { useEffect, useState } from "react";
import {
  useBackButton,
  usePopup,
  useMainButton,
  useQRScanner,
} from "@tma.js/sdk-react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const ContainerSend = styled.div`
  padding: 1rem;
  .send-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    img {
      align-self: center;
      filter: drop-shadow(2px 4px 6px black);
    }
    .header-send {
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
  .send-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem 0;
    .prefix-coin {
      color: #01abe8;
      font-size: 14px;
      font-weight: 600;
    }
  }
  .send-group-action {
    button {
      width: 100%;
    }
  }
`;

export default function Send() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const mainButton = useMainButton();
  const backButton = useBackButton();
  const popUp = usePopup();
  const scanner = useQRScanner();

  useEffect(() => {
    mainButton.show();
    mainButton.setText("Send");
    backButton.show();
  }, []);

  useEffect(() => {
    mainButton.on("click", onMainButtonClick);
    backButton.on("click", onBackButtonClick);
  }, [mainButton, backButton]);

  const onMainButtonClick = () => {
    popUp
      .open({
        title: "Popup Title",
        message: "Popup Description",
        buttons: [<Button title="Ok" />],
      })
      .then(() => {
        console.log(popUp.isOpened);
      })
      .catch(() => {
        console.log(popUp.isOpened);
      });
  };

  const ScanQRCode = () => {
    scanner.open("Scan the barcode").then((content) => {
      console.log(content);
      // Output: 'some-data=22l&app=93...'
      setAddress(content || "null");
      scanner.close();
    });
  };

  const onBackButtonClick = () => {
    router.back();
    backButton.hide();
    mainButton.hide();
  };

  return (
    <ContainerSend>
      <div className="send-info">
        <img width={96} height={96} src="/send.svg" alt="" />
        <div className="header-send">
          <h2 className="title">Send</h2>
          <InfoOutlinedIcon />
        </div>
        <p className="subtitle">
          <span>Available:</span> 1,000 XEC
        </p>
      </div>
      <form className="send-form">
        <FormControl fullWidth={true}>
          <TextField
            id="address"
            label="Wallet address"
            placeholder="Paste address here"
            color="primary"
            variant="outlined"
            error={error}
            helperText={error && "Incorrect address."}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <div onClick={ScanQRCode}>
                    <QrCodeScannerOutlinedIcon />
                  </div>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl fullWidth={true}>
          <TextField
            id="amount"
            type="number"
            label="Amount"
            placeholder="0"
            color="primary"
            variant="outlined"
            error={error}
            helperText={error && "Invalid amount."}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <p className="prefix-coin">XEC</p>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </form>
    </ContainerSend>
  );
}
