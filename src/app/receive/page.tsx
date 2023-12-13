"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBackButton, useMainButton, usePopup } from "@tma.js/sdk-react";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import { Button, TextField } from "@mui/material";
import styled from "@emotion/styled";
import QRCodeStyling, {
  Options as QRCodeStylingOptions,
} from "qr-code-styling";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({}));

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
        margin-top: 1rem;
      }
      .subtitle {
        span {
          font-size: 12px;
          color: #d5d5d5;
        }
      }
    }
    .tooltip-info {
      padding: 0;
      align-self: end;
    }
  }
  .coin-address {
    .address-string {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      background: #4c5054;
      color: #fff;
      width: fit-content;
      margin: auto;
      border-radius: 4px;
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
    .prefix-coin {
      color: #01abe8;
      font-size: 14px;
      font-weight: 600;
    }
  }
`;

const TooltipContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 4rem;
  padding: 1rem;
  border: 1px solid #5476eb;
  border-radius: 8px;
  background: #4c5054;
  p {
    font-size: 12px;
    letter-spacing: 0.25px;
    line-height: 20px;
  }
`;

const qrOptions: QRCodeStylingOptions = {
  width: 300,
  height: 300,
  margin: 12,
  image: "/xec.svg",
  type: "svg",
  dotsOptions: {
    color: "#fff",
    type: "dots",
  },
  cornersSquareOptions: {
    type: "extra-rounded",
  },
  cornersDotOptions: {
    type: "dot",
  },
  backgroundOptions: {
    color: "transparent",
  },
  imageOptions: {
    margin: 12,
  },
};

const useQRCodeStyling = (
  options: QRCodeStylingOptions
): QRCodeStyling | null => {
  //Only do this on the client
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const QRCodeStylingLib = require("qr-code-styling");
    const qrCodeStyling: QRCodeStyling = new QRCodeStylingLib(options);
    return qrCodeStyling;
  }
  return null;
};

export default function Receive() {
  const router = useRouter();
  const [address, setAddress] = useState<string>(
    "qp8ks7622cklc7c9pm2d3ktwzctack6njq6q83ed9x"
  );
  const qrCode = useQRCodeStyling(qrOptions);
  const ref = useRef<any>(null);

  const mainButton = useMainButton();
  const backButton = useBackButton();
  const popUp = usePopup();

  useEffect(() => {
    backButton.show();
    mainButton.show();
    mainButton.setText("Share this");
  }, []);

  useEffect(() => {
    mainButton.on("click", onMainButtonClick);
    backButton.on("click", onBackButtonClick);
  }, [mainButton, backButton]);

  const onMainButtonClick = () => {
    popUp.open({
      title: 'Receive info',
      message: 'You can copy and share your wallet address by clicking on the address. You can also share your wallet QRCode.',
      buttons: [
        <Button title="Ok"/>
      ]
    });
    popUp.isOpened;
  };

  const onBackButtonClick = () => {
    router.back();
    backButton.hide();
  };

  useEffect(() => {
    qrCode?.append(ref.current);
  }, [ref, qrCode]);

  useEffect(() => {
    qrCode?.update({ data: address });
  }, [address, qrCode]);

  const onAddressChange:
    | React.ChangeEventHandler<HTMLInputElement>
    | undefined = (event) => {
    event.preventDefault();
    setAddress(event.target.value);
  };

  const TooltipReceive = () => {
    return (
      <React.Fragment>
        <TooltipContainer>
          <InfoOutlinedIcon />
          <p>
            You can copy and share your wallet address by clicking on the
            address. You can also share your wallet QRCode.
          </p>
        </TooltipContainer>
      </React.Fragment>
    );
  };

  return (
    <ContainerReceive>
      <div className="receive-info">
        <img width={96} height={96} src="/request.svg" alt="" />
        <div className="header-receive">
          <h2 className="title">Receive</h2>
          <InfoOutlinedIcon />
          {/* <HtmlTooltip className="tooltip-info" title={TooltipReceive()}>
            <IconButton>
              <InfoOutlinedIcon />
            </IconButton>
          </HtmlTooltip> */}
        </div>
      </div>
      <div className="receive-form">
        <FormControl fullWidth={true}>
          <TextField
            id="address"
            label="Request amount (option)"
            placeholder="0"
            color="primary"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <p className="prefix-coin">XEC</p>
                </InputAdornment>
              ),
            }}
            // onChange={onAddressChange}
          />
        </FormControl>
      </div>
      <div className="coin-address">
        <div style={{ textAlign: "center" }} ref={ref}></div>
        <div className="address-string">
          <ContentPasteIcon />
          <span>
            <span style={{ color: "#01abe8" }}>ecash:</span>
            {address}
          </span>
        </div>
      </div>
    </ContainerReceive>
  );
}
