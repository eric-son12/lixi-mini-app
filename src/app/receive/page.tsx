"use client";
import React, { useEffect } from "react";
import styled from "@emotion/styled";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import QRCodeStyling from "qr-code-styling";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const ContainerReceive = styled.div`
  padding: 1rem;
  #qrcode {
    max-width: 100%;
    text-align: center;
  }
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
  .tooltip-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 4rem;
    padding: 1rem;
    border: 1px solid #5476eb;
    border-radius: 8px;
    background: #5476eb42;
    p {
      font-size: 12px;
      letter-spacing: 0.25px;
      line-height: 20px;
    }
  }
`;

export default function Receive() {
  useEffect(() => {
    return qrCode();
  }, []);

  const qrCode = () => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      margin: 12,
      data: "190270hdioashoisahdiosadoiasd",
      type: "svg",
      image: "/xec.svg",
      dotsOptions: {
        color: "#fff",
        type: "rounded",
      },
      backgroundOptions: {
        color: "transparent",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 20,
      },
    });
    const qrCodeEle = document.getElementById("qrcode") || undefined;
    qrCode.append(qrCodeEle);
  };
  return (
    <ContainerReceive>
      <div className="receive-info">
        <img width={96} height={96} src="/request.svg" alt="" />
        <div className="header-receive">
          <h2 className="title">Receive</h2>
          <Tooltip title="Delete">
            <IconButton>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="receive-form">
        <FormControl fullWidth={true}>
          <InputLabel htmlFor="outlined-adornment-amount">
            Request amount (option)
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            endAdornment={<InputAdornment position="end">XEC</InputAdornment>}
            label="Amount"
            placeholder="0"
          />
        </FormControl>
      </div>
      <div className="coin-address">
        <div id="qrcode"></div>
        <div className="address-string">
          <ContentPasteIcon />
          <span>19298342189452184527815487214</span>
        </div>
      </div>

      {/* <div className="tooltip-info">
        <InfoOutlinedIcon />
        <p>
          You can copy and share your wallet address by clicking on the address.
          You can also share your wallet QRCode.
        </p>
      </div> */}
    </ContainerReceive>
  );
}
