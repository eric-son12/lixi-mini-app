"use client";
import React from "react";
import styled from "@emotion/styled";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import LixiButton from "../component/LixiButton";
import { MainButton, BackButton } from "@twa-dev/sdk/dist/react";

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
          <InputLabel htmlFor="outlined-adornment-address">
            Wallet address
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-address"
            endAdornment={
              <InputAdornment position="end">
                <QrCodeScannerOutlinedIcon />
              </InputAdornment>
            }
            label="Address"
            placeholder="Paste address here"
          />
        </FormControl>
        <FormControl fullWidth={true}>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            endAdornment={<InputAdornment position="end">XEC</InputAdornment>}
            label="Amount"
            placeholder="0"
          />
        </FormControl>
      </div>
      {/* <div className="send-group-action">
        <LixiButton title="Send" />
      </div> */}
      <BackButton onClick={() => window.history.back()} />
      <MainButton text="Send" onClick={() => alert("submitted")} />
    </ContainerSend>
  );
}
