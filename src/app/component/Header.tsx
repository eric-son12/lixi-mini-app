import React from "react";
import styled from '@emotion/styled'
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

const Section = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  svg {
    font-size: 28px;
    color: var(--color-primary);
  }
`;

type HeaderProps = {
  id?: string;
};

function Header(props: HeaderProps) {
  return (
    <Section>
      <div>
        <AccountBalanceWalletOutlinedIcon />
        &nbsp;
        <InboxOutlinedIcon />
      </div>
      <SettingsOutlinedIcon />
    </Section>
  );
}

export default Header;
