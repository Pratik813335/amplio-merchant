import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hook';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
//
import BusinessProfile from '../account-general';
import AccountNotifications from '../account-notifications';
import AccountChangePassword from '../account-change-password';
import BusinessBankPage from '../bank-account';
import PspAccountPage from '../psp-account';
import UbosListView from '../ubo/view/kyc-ubo-list-view';
import MerchantDocumentDetails from '../merchant-document-details';
import AccountAddressDetails from '../account-address-details';
import AccountConfiguration from '../account-configuration';


// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'businessProfile',
    label: 'Business Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'document',
    label: 'Document',
    icon: <Iconify icon="tabler:file-description" width={24} />,
  },
  {
    value: 'addressDetails',
    label: 'Address Details',
    icon: <Iconify icon="mdi:map-marker-outline" width={24} />,
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
  {
    value: 'configuration',
    label: 'Configuration',
    icon: <Iconify icon="solar:settings-bold" width={24} />,
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
  const router = useRouter();

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab || 'businessProfile');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push({
      search: `?tab=${newValue}`,
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
        variant="scrollable"
        scrollButtons="auto"
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
      {currentTab === 'document' && <MerchantDocumentDetails />}
      {currentTab === 'addressDetails' && <AccountAddressDetails />}

      {currentTab === 'bankAccount' && <BusinessBankPage />}
      {currentTab === 'UBO' && <UbosListView />}
      {currentTab === 'pspIntegration' && <PspAccountPage />}
      {currentTab === 'configuration' && <AccountConfiguration />}
      {currentTab === 'notifications' && <AccountNotifications />}

      {/* {currentTab === 'social' && <AccountSocialLinks socialLinks={_userAbout.socialLinks} />} */}

      {currentTab === 'security' && <AccountChangePassword />}
    </Container>
  );
}
