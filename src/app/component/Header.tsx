import React from "react";
import styled from "@emotion/styled";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { useRouter } from "next/navigation";

const Section = styled.div`
  padding: 1rem;
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
  svg {
    font-size: 24px;
    color: #0088cc;
  }
`;

type HeaderProps = {
  id?: string;
};

function Header(props: HeaderProps) {
  const router = useRouter();

  const navigateSetting = () => {
    router.push("/setting");
  };

  const navigateQpay = () => {
    router.push("/qpay");
  };


  return (
    <Section>
      <div onClick={navigateQpay}>
        <InboxOutlinedIcon />
      </div>
      <div onClick={navigateSetting}>
        <SettingsOutlinedIcon />
      </div>
    </Section>
  );
}

export default Header;
