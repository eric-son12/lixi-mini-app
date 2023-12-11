"use client";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import LixiButton from "../component/LixiButton";
import { useBackButton, useInitData, useMainButton } from "@tma.js/sdk-react";

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
  // const mainButton = useMainButton();
  // const backButton = useBackButton();

  // const [count, setCount] = useState(0);

  // useEffect(() => {
  //   const onMainButtonClick = () => setCount((prevCount) => prevCount + 1);
  //   const onBackButtonClick = () => setCount((prevCount) => prevCount - 1);

  //   mainButton.enable().show();
  //   mainButton.on("click", onMainButtonClick);
  //   backButton.on("click", onBackButtonClick);

  //   return () => {
  //     mainButton.off("click", onMainButtonClick);
  //     mainButton.hide();
  //     backButton.off("click", onBackButtonClick);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   mainButton.setText(`Count is ${count}`);
  // }, [mainButton, count]);

  // useEffect(() => {
  //   if (count === 0) {
  //     backButton.hide();
  //     return;
  //   }
  //   backButton.show();
  // }, [backButton, count]);

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
      {/* <div className="send-group-action">
        <LixiButton title="Send" />
      </div> */}
      {/* <BackButton onClick={() => window.history.back()} />
      <MainButton text="Send" onClick={() => alert("submitted")} /> */}
    </ContainerSend>
  );
}
