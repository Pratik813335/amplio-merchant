import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hook';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import BusinessProfile from '../account-general';
import AccountBilling from '../account-billing';
import AccountSocialLinks from '../account-social-links';
import AccountNotifications from '../account-notifications';
import AccountChangePassword from '../account-change-password';
import BusinessBankPage from '../bank-account';
import PspAccountPage from '../psp-account';
import UbosListView from '../ubo/view/kyc-ubo-list-view';


// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'businessProfile',
    label: 'Business Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
   {
    value: 'UBO',
    label: 'Ultimate Beneficial Owner(UBO)',
    icon: <Iconify icon="mingcute:profile-line" width={24} />,
  },
  {
    value: 'bankAccount',
    label: 'Bank Account',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  {
    value: 'pspIntegration',
    label: 'PSP Integration',
    icon: <Iconify icon="hugeicons:transaction" width={24} />,
  },
  // {
  //   value: 'notifications',
  //   label: 'Notifications',
  //   icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  // },
  // {
  //   value: 'social',
  //   label: 'Social links',
  //   icon: <Iconify icon="solar:share-bold" width={24} />,
  // },
  {
    value: 'security',
    label: 'Security',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();
  const router=useRouter();

  const [searchParams]=useSearchParams();
  const tab=searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab ||'businessProfile');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push({
      search:`?tab=${newValue}`,
  });

  }, [router]);
  

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: 'Account' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      /> */}

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tabs) => (
          <Tab key={tabs.value} label={tabs.label} icon={tabs.icon} value={tabs.value} />
        ))}
      </Tabs>

      {currentTab === 'businessProfile' && <BusinessProfile />}

      {/* {currentTab === 'billing' && (
        <AccountBilling
          plans={_userPlans}
          cards={_userPayment}
          invoices={_userInvoices}
          addressBook={_userAddressBook}
        />
      )} */}

      {currentTab === 'bankAccount' && <BusinessBankPage />}
      {currentTab === 'UBO' && <UbosListView />}
      {currentTab === 'pspIntegration' && <PspAccountPage />}
      {currentTab === 'notifications' && <AccountNotifications />}

      {/* {currentTab === 'social' && <AccountSocialLinks socialLinks={_userAbout.socialLinks} />} */}

      {currentTab === 'security' && <AccountChangePassword />}
    </Container>
  );
}
