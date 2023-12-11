"use client";
import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import {
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";

const ContainerImportWallet = styled.div`
  padding: 1rem;
  .receive-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    img {
      align-self: center;
      filter: drop-shadow(2px 4px 6px black);
    }
    .header-receive {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
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
  }
  .coin-address {
    .address-string {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      background: #5476eb42;
      color: #5476eb;
      width: fit-content;
      margin: auto;
      border-radius: 1rem;
      gap: 4px;
      svg {
        font-size: 14px;
      }
      span {
        font-size: 12px;
      }
    }
  }
  .receive-form {
    padding: 1rem 0;
  }
`;

export default function ImportWallet() {
  const router = useRouter();

  const navigateWallet = () => {
    router.push("/wallet");
  };

  return (
    <ContainerImportWallet>
      <div className="receive-info">
        <img width={96} height={96} src="/import.svg" alt="" />
        <div className="header-receive">
          <h2 className="title">Import Account</h2>
          <Tooltip title={"Test"}>
            <IconButton>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="receive-form">
        <FormControl fullWidth={true}>
          <TextField
            id="recovery-phrase"
            label="Recovery phrase"
            placeholder="Enter your recovery phrase (12 words) in the correct order. Separate each word with a single space only (no commas or any other punctuation)."
            color="primary"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <QrCodeScannerOutlinedIcon />
                </InputAdornment>
              ),
            }}
            required
            multiline
            rows={5}
          />
        </FormControl>
      </div>
    </ContainerImportWallet>
  );
}
