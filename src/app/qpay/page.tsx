"use client";
import React, { useEffect, useState } from "react";
import {
  useBackButton,
  useMainButton,
  useHapticFeedback,
} from "@tma.js/sdk-react";
import styled from "@emotion/styled";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Snackbar,
  Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { CheckCircleOutline } from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter } from "next/navigation";

const MIN_PAYMENT_AMOUNT = 20000;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const ConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  .currency-info {
    text-align: center;
    .curency-image {
      margin: 1rem 0;
      width: 96px;
      height: 96px;
    }
    .coin-symbol {
      font-size: 18px;
    }
    .amount {
      font-size: 18px;
      line-height: 36px;
    }
  }
  .invoice-information {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .invoice-item {
      .title {
        font-size: 14px;
        color: gray;
        margin-bottom: 4px;
      }
      .desc {
        font-weight: 500;
      }
    }
  }
`;

export default function Qpay() {
  const router = useRouter();
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [popularPayee, setPopularPayee] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [unitNumber, setUnitNumber] = useState<number>(null);
  const [paymentReasion, setPaymentReason] = useState<string>("");
  const [invoiceID, setInvoiceID] = useState<string>("");
  const [paymentDescription, setPaymentDescription] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<number>(null);
  const [paymentAmountRate, setPaymentAmountRate] = useState<number>(0);
  const [paymentAmounteLPS, setPaymentAmounteLPS] = useState<number>(null);
  const [email, setEmail] = useState<string>("");

  const mainButton = useMainButton();
  const backButton = useBackButton();
  const haptic = useHapticFeedback();

  useEffect(() => {
    mainButton.enable().show();
    backButton.show();
    if (isConfirm) {
      mainButton.setText("Pay");
    } else {
      mainButton.setText("Submit");
    }
  }, [isConfirm]);

  useEffect(() => {
    if (isConfirm) {
      mainButton.on("click", onMainButtonConfirmClick);
    } else {
      mainButton.on("click", onMainButtonClick);
    }
    backButton.on("click", onBackButtonClick);
  }, [mainButton, backButton, isConfirm]);

  const onMainButtonClick = () => {
    haptic.notificationOccurred("warning");
    setIsConfirm(true);
    setOpen(true);
    console.log("Main button clicked!");
  };

  const onMainButtonConfirmClick = () => {
    haptic.notificationOccurred("warning");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setOpen(false);
    }, 1000);
    console.log("Main button confirm clicked!");
  };

  const onBackButtonClick = () => {
    backButton.hide();
    mainButton.hide();
    mainButton.off("click", onMainButtonClick);
    backButton.off("click", onBackButtonClick);
    router.back();
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  const handleClose = () => {
    setOpen(false);
    setIsConfirm(false);
  };

  const handlePopularPayeeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPopularPayee(value);
  };

  const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setStreet(value);
  };
  const handleUnitNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setUnitNumber(parseInt(value));
  };

  const handlePaymentReasonChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPaymentReason(value);
  };

  const handlePaymentDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPaymentDescription(value);
  };

  const handleInvoiceIDChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setInvoiceID(value);
  };

  const handlPaymentAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPaymentAmount(parseInt(value));
  };

  const handlPaymentAmounteLPSChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPaymentAmounteLPS(parseInt(value));
  };

  const handlPaymentAmountRateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPaymentAmountRate(parseInt(value));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
  };

  return (
    <>
      <ContainerSend>
        <div className="send-info">
          <img width={96} height={96} src="/qpay.svg" alt="" />
          <div className="header-send">
            <h2 className="title">QPay</h2>
            <div>
              <InfoOutlinedIcon />
            </div>
          </div>
        </div>
        <form className="send-form">
          <FormControl fullWidth={true}>
            <InputLabel id="popular-payyee-label">Popular payee</InputLabel>
            <Select
              labelId="popular-payee-label"
              id="popular-payee"
              value={popularPayee}
              onChange={handlePopularPayeeChange}
              label="Popular payyee"
            >
              <MenuItem value={"Community Artists"}>Community Artists</MenuItem>
              <MenuItem value={"Morazan Electric and Hydro"}>
                Morazan Electric and Hydro
              </MenuItem>
              <MenuItem value={"Morazán ZEDE (Taxes/Fees)"}>
                Morazán ZEDE (Taxes/Fees)
              </MenuItem>
              <MenuItem value={"Forever Young Gym - Morazán"}>
                Forever Young Gym - Morazán
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth={true}>
            <InputLabel id="street-label">Street</InputLabel>
            <Select
              labelId="street-label"
              id="street"
              value={street}
              onChange={handleStreetChange}
              label="Street"
            >
              <MenuItem value={"Calle Francisco Suarez"}>
                Calle Francisco Suarez
              </MenuItem>
              <MenuItem value={"Calle Juan de Mariana"}>
                Calle Juan de Mariana
              </MenuItem>
              <MenuItem value={"Calle Francisco de Vitoria"}>
                Calle Francisco de Vitoria
              </MenuItem>
              <MenuItem value={"Calle Martin de Azpilicueta"}>
                Calle Martin de Azpilicueta
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth={true}>
            <TextField
              id="unit-number"
              type="number"
              label="Unit number"
              placeholder="0"
              value={unitNumber}
              color="info"
              onChange={handleUnitNumberChange}
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth={true}>
            <InputLabel id="payment-reason-label">Payment reason</InputLabel>
            <Select
              labelId="payment-reason-label"
              id="payment-reason"
              value={paymentReasion}
              onChange={handlePaymentReasonChange}
              label="Payment reason"
            >
              <MenuItem value={"Current Invoice"}>Current Invoice</MenuItem>
              <MenuItem value={"Advance Payment"}>Advance Payment</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
            </Select>
          </FormControl>
          {paymentReasion === "Current Invoice" && (
            <FormControl fullWidth={true}>
              <TextField
                id="invoice-or-account-number"
                label="Invoice or account number"
                placeholder="0"
                value={invoiceID}
                color="info"
                onChange={handleInvoiceIDChange}
                variant="outlined"
                required={true}
                //   error={!invoiceID}
                //   helperText={!invoiceID && 'Invoice or account number is require'}
              />
            </FormControl>
          )}
          <FormControl fullWidth={true}>
            <TextField
              id="payment-description"
              label="Payment description"
              placeholder="Enter what you are paying for"
              value={paymentDescription}
              color="info"
              onChange={handlePaymentDescriptionChange}
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth={true}>
            <TextField
              id="payment-amount"
              label="Payment amount"
              placeholder="Input amount"
              value={paymentAmount}
              color="info"
              onChange={handlPaymentAmountChange}
              variant="outlined"
              required={true}
              //   error={paymentAmount < MIN_PAYMENT_AMOUNT}
              helperText={"$ " + paymentAmountRate.toString()}
            />
          </FormControl>
          <FormControl fullWidth={true}>
            <TextField
              id="payment-unit"
              placeholder="0"
              value={paymentAmounteLPS}
              color="info"
              onChange={handlPaymentAmounteLPSChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <p className="prefix-coin">eLPS</p>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl fullWidth={true}>
            <TextField
              id="email-send-receipt"
              label="Email to send receipt"
              placeholder="Enter your email"
              value={email}
              color="info"
              onChange={handleEmailChange}
              variant="outlined"
              required={true}
              //   error={!email}
              //   helperText={!email && 'Email is require'}
            />
          </FormControl>
        </form>

        {/* <LixiButton title="Submit" onClickItem={() => setOpen(true)}></LixiButton> */}
      </ContainerSend>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullScreen={true}
        sx={{
          "& .MuiDialog-paper": {
            background: "#161b22",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>{"Bill Confirm"}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            left: 8,
            top: 8,
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <DialogContent>
          <ConfirmContainer>
            <div className="currency-info">
              <div className="curency-info">
                <p className="coin-symbol">eCash (XEC)</p>
              </div>
              <img className="curency-image" src="/xec.svg" alt="" />
              <div className="balance">
                <p style={{ color: "gray" }}>Payment Amount</p>
                <h4 className="amount">{paymentAmount} XEC</h4>
                <p className="rate">$ {paymentAmountRate}</p>
              </div>
            </div>

            <div className="invoice-information">
              {popularPayee && (
                <div className="invoice-item">
                  <p className="title">Payee name</p>
                  <p className="desc">{popularPayee}</p>
                </div>
              )}
              {street && (
                <div className="invoice-item">
                  <p className="title">Street</p>
                  <p className="desc">{street}</p>
                </div>
              )}
              {unitNumber && (
                <div className="invoice-item">
                  <p className="title">Unit number</p>
                  <p className="desc">{unitNumber}</p>
                </div>
              )}
              {invoiceID && (
                <div className="invoice-item">
                  <p className="title">Invoice ID (Account number)</p>
                  <p className="desc">{invoiceID}</p>
                </div>
              )}
              {paymentDescription && (
                <div className="invoice-item">
                  <p className="title">Payment description</p>
                  <p className="desc">{paymentDescription}</p>
                </div>
              )}
              {email && (
                <div className="invoice-item">
                  <p className="title">Email to send receipt</p>
                  <p className="desc">{email}</p>
                </div>
              )}
            </div>
          </ConfirmContainer>
        </DialogContent>
        {/* <DialogActions sx={{ display: 'flex' }}>
          <LixiButton title="Pay" onClickItem={handleConfirm} />
        </DialogActions> */}
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: "9999" }}
        open={loading}
        onClick={handleClose}
      >
        <CircularProgress color={"inherit"} />
      </Backdrop>
      <Stack>
        <Snackbar
          open={success}
          onClose={handleClose}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            style={{ width: "100%" }}
            icon={
              <CheckCircleOutline className="ico-alert" fontSize="inherit" />
            }
            severity="success"
          >
            Your payment is success!
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
}
