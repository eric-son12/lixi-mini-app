"use client";
import React, { useEffect, useState } from "react";
import { useBackButton, usePopup, useMainButton } from "@tma.js/sdk-react";
import styled from "@emotion/styled";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

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
    .title {
      margin-top: 2rem;
    }
    .subtitle {
      span {
        font-size: 12px;
        color: #d5d5d5;
      }
    }
  }
  .send-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem 0;
  }
  .send-group-action {
    button {
      width: 100%;
    }
  }
`;

export default function Send() {
  const mainButton = useMainButton();
  const backButton = useBackButton();
  const popUp = usePopup();
  const router = useRouter();

  const onMainButtonClick = () => {
    popUp.open({
      title: 'Popup Title',
      message: 'Popup Description',
      buttons: [
        <Button title="Ok"/>
      ]
    })
  };
  const onBackButtonClick = () => {
    router.back();
  };

  useEffect(() => {
    mainButton.show();
    mainButton.setText("Share this");
    mainButton.on("click", onMainButtonClick);
    backButton.on("click", onBackButtonClick);
    backButton.show();
  }, []);
  return (
    <ContainerSend>
      <div className="send-info">
        <img width={96} height={96} src="/send.svg" alt="" />
        <h2 className="title">Send</h2>
        <p className="subtitle">
          <span>Available:</span> 1,000 XEC
        </p>
      </div>
      <div className="send-form">
        <FormControl fullWidth={true}>
          <TextField
            id="address"
            label="Wallet address"
            placeholder="Paste address here"
            color="primary"
            variant="outlined"
            error
            helperText="Incorrect address."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <QrCodeScannerOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl fullWidth={true}>
          <TextField
            id="amount"
            label="Amount"
            placeholder="0"
            color="primary"
            variant="outlined"
            error
            helperText="Incorrect amount."
            InputProps={{
              endAdornment: <InputAdornment position="end">XEC</InputAdornment>,
            }}
          />
        </FormControl>
      </div>
    </ContainerSend>
  );
}
