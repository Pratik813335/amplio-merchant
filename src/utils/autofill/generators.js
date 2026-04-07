import { pickRandom, randomAlpha, randomAlphaNumeric, randomDigits, randomPastDate } from './random';

const COMPANY_PREFIXES = [
  'AERONEX',
  'VISTARA',
  'LUMIVIA',
  'ORBITECH',
  'TRUENEST',
  'NEXWAVE',
  'QUANTARA',
  'SOLVANTA',
  'MERAKI',
  'ALTORIX',
  'CREDOVA',
  'FINOVA',
];

const COMPANY_DESCRIPTORS = [
  'INDIA',
  'DIGITAL',
  'FINTECH',
  'PAYMENTS',
  'TRADE',
  'SUPPLY',
  'LOGISTICS',
  'RETAIL',
  'MERCANTILE',
  'INDUSTRIES',
];

const COMPANY_SUFFIXES = ['PRIVATE LIMITED', 'LIMITED'];

const INCORPORATION_LOCATIONS = [
  { city: 'Mumbai', stateLabel: 'Maharashtra', stateCode: 'MH', gstStateCode: '27' },
  { city: 'Pune', stateLabel: 'Maharashtra', stateCode: 'MH', gstStateCode: '27' },
  { city: 'Bengaluru', stateLabel: 'Karnataka', stateCode: 'KA', gstStateCode: '29' },
  { city: 'Chennai', stateLabel: 'Tamil Nadu', stateCode: 'TN', gstStateCode: '33' },
  { city: 'Hyderabad', stateLabel: 'Telangana', stateCode: 'TS', gstStateCode: '36' },
  { city: 'Ahmedabad', stateLabel: 'Gujarat', stateCode: 'GJ', gstStateCode: '24' },
  { city: 'Jaipur', stateLabel: 'Rajasthan', stateCode: 'RJ', gstStateCode: '08' },
  { city: 'Kolkata', stateLabel: 'West Bengal', stateCode: 'WB', gstStateCode: '19' },
  { city: 'New Delhi', stateLabel: 'Delhi', stateCode: 'DL', gstStateCode: '07' },
  { city: 'Lucknow', stateLabel: 'Uttar Pradesh', stateCode: 'UP', gstStateCode: '09' },
];

const REGISTERED_ADDRESSES = [
  {
    registeredAddressLine1: '14 BUSINESS PARK TOWER A',
    registeredAddressLine2: 'MIDC INDUSTRIAL AREA',
    registeredCity: 'Mumbai',
    registeredState: 'Maharashtra',
    registeredPincode: '400093',
    correspondenceAddressLine1: '402 COMMERCE PLAZA',
    correspondenceAddressLine2: 'BKC ANNEX',
    correspondenceCity: 'Mumbai',
    correspondenceState: 'Maharashtra',
    correspondencePincode: '400051',
  },
  {
    registeredAddressLine1: '88 TRADE CENTRE',
    registeredAddressLine2: 'SECTOR 62',
    registeredCity: 'Noida',
    registeredState: 'Uttar Pradesh',
    registeredPincode: '201309',
    correspondenceAddressLine1: '11 CORPORATE HUB',
    correspondenceAddressLine2: 'SECTOR 63',
    correspondenceCity: 'Noida',
    correspondenceState: 'Uttar Pradesh',
    correspondencePincode: '201301',
  },
  {
    registeredAddressLine1: '27 LAKESHORE BUSINESS COMPLEX',
    registeredAddressLine2: 'OUTER RING ROAD',
    registeredCity: 'Bengaluru',
    registeredState: 'Karnataka',
    registeredPincode: '560103',
    correspondenceAddressLine1: '9 FINTECH SQUARE',
    correspondenceAddressLine2: 'WHITEFIELD MAIN ROAD',
    correspondenceCity: 'Bengaluru',
    correspondenceState: 'Karnataka',
    correspondencePincode: '560066',
  },
];

const BANK_PROFILES = [
  {
    bankName: 'HDFC BANK',
    branchName: 'ANDHERI EAST',
    bankShortCode: 'HDFC',
    bankAddress: 'SOLARIS 1, SAKI VIHAR ROAD, MUMBAI',
    ifscCode: 'HDFC0001234',
  },
  {
    bankName: 'ICICI BANK',
    branchName: 'BKC',
    bankShortCode: 'ICIC',
    bankAddress: 'G BLOCK, BANDRA KURLA COMPLEX, MUMBAI',
    ifscCode: 'ICIC0004321',
  },
  {
    bankName: 'AXIS BANK',
    branchName: 'INDIRANAGAR',
    bankShortCode: 'UTIB',
    bankAddress: '100 FEET ROAD, INDIRANAGAR, BENGALURU',
    ifscCode: 'UTIB0002468',
  },
];

const PERSON_FIRST_NAMES = ['ARJUN', 'VIKRAM', 'RAHUL', 'KARAN', 'ROHAN', 'AMAN', 'MEERA', 'ISHA', 'NEHA', 'ANANYA'];
const PERSON_LAST_NAMES = ['SHARMA', 'MEHTA', 'GUPTA', 'IYER', 'REDDY', 'PATEL', 'MALHOTRA', 'VERMA', 'NAIR', 'JAIN'];
const UBO_ROLES = ['director', 'partner', 'shareholder', 'authorized_signatory'];

const RAZORPAY_DEFAULTS = {
  apiKey: 'rzp_test_SUzRTpkNLBlx57',
  keyId: 'rzp_test_SUzRTpkNLBlx57',
  apiSecret: 'eqyoSSKfBinBr93IIFjf6ZMg',
  secretKey: 'eqyoSSKfBinBr93IIFjf6ZMg',
  webhookUrl: 'https://merchant.demo.example/webhooks/razorpay',
  webhookSecret: 'razorpay_webhook_demo_secret',
};

function padRight(value, length, fill = 'X') {
  const normalized = String(value || '');

  if (normalized.length >= length) {
    return normalized.slice(0, length);
  }

  return `${normalized}${fill.repeat(length - normalized.length)}`;
}

function createCompanyName() {
  return `${pickRandom(COMPANY_PREFIXES)} ${pickRandom(COMPANY_DESCRIPTORS)} ${pickRandom(COMPANY_SUFFIXES)}`.trim();
}

function deriveCompanyPan(companyName) {
  const normalized = String(companyName || '')
    .toUpperCase()
    .replace(/[^A-Z\s]/g, ' ')
    .trim();
  const words = normalized.split(/\s+/).filter(Boolean);
  const joined = words.join('');
  const firstBlock = padRight(words[0] || joined, 3, 'X');
  const fifthCharacter = (joined[0] || 'X').toUpperCase();

  return `${firstBlock}C${fifthCharacter}${randomDigits(4)}${randomAlpha(1)}`;
}

function deriveGstin(panNumber, gstStateCode) {
  return `${gstStateCode}${panNumber}${Math.floor(Math.random() * 8) + 1}Z${randomAlphaNumeric(1)}`;
}

function deriveCin(stateCode, incorporationDate) {
  return `${pickRandom(['U', 'L'])}${randomDigits(5)}${stateCode}${incorporationDate.getFullYear()}${pickRandom(['PTC', 'PLC'])}${randomDigits(6)}`;
}

function deriveUdyamNumber(stateCode) {
  return `UDYAM-${stateCode}-${randomDigits(2)}-${randomDigits(7)}`;
}

export function generateCompanyBasicInfoAutofill() {
  const location = pickRandom(INCORPORATION_LOCATIONS);
  const dateOfIncorporation = randomPastDate({ startYear: 2006, endYear: 2023 });
  const companyName = createCompanyName();
  const panNumber = deriveCompanyPan(companyName);

  return {
    companyName,
    cin: deriveCin(location.stateCode, dateOfIncorporation),
    panNumber,
    gstin: deriveGstin(panNumber, location.gstStateCode),
    msmeUdyamRegistrationNo: deriveUdyamNumber(location.stateCode),
    dateOfIncorporation,
    city: location.city,
    stateLabel: location.stateLabel,
    country: 'India',
    panHoldersName: companyName,
  };
}

export function generateAddressDetailsAutofill() {
  const address = pickRandom(REGISTERED_ADDRESSES);

  return {
    documentType: pickRandom(['electricity_bill', 'lease_agreement']),
    registeredCountry: 'India',
    correspondenceCountry: 'India',
    sameAsRegistered: false,
    ...address,
  };
}

export function generateBankDetailsAutofill() {
  const bank = pickRandom(BANK_PROFILES);
  const companyName = createCompanyName();

  return {
    documentType: pickRandom(['cheque', 'bank_statement']),
    bankName: bank.bankName,
    branchName: bank.branchName,
    bankShortCode: bank.bankShortCode,
    bankAddress: bank.bankAddress,
    ifscCode: bank.ifscCode,
    accountType: 'CURRENT',
    accountHolderName: companyName,
    accountNumber: `${randomDigits(11)}${randomDigits(3)}`,
    bankDocumentConsent: true,
    pennyDropConsent: true,
  };
}

export function generateUboAutofill() {
  const firstName = pickRandom(PERSON_FIRST_NAMES);
  const lastName = pickRandom(PERSON_LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;
  const panNumber = `${padRight(firstName, 3, 'X')}P${lastName[0]}${randomDigits(4)}${randomAlpha(1)}`;
  const dateOfBirth = randomPastDate({ startYear: 1975, endYear: 2000 });
  const phoneSuffix = randomDigits(8);

  return {
    name: fullName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomDigits(2)}@example.com`,
    phoneNumber: `98${phoneSuffix}`,
    role: pickRandom(UBO_ROLES),
    ownershipPercentage: String(Math.floor(Math.random() * 40) + 10),
    submittedPanFullName: fullName,
    submittedPanNumber: panNumber,
    submittedDateOfBirth: dateOfBirth.toISOString().split('T')[0],
    panConsent: true,
  };
}

export function getPspAutofillDefaults(field, providerName = 'razorpay') {
  const fieldName = String(field?.fieldName || '').toLowerCase();
  const label = String(field?.label || '').toLowerCase();
  const combined = `${fieldName} ${label}`;

  if (providerName.toLowerCase() === 'razorpay') {
    if (combined.includes('api key') || combined.includes('key id') || fieldName.includes('apikey') || fieldName.includes('keyid')) {
      return RAZORPAY_DEFAULTS.apiKey;
    }

    if (combined.includes('secret') || fieldName.includes('apisecret') || fieldName.includes('secretkey')) {
      return RAZORPAY_DEFAULTS.apiSecret;
    }

    if (combined.includes('webhook') && combined.includes('url')) {
      return RAZORPAY_DEFAULTS.webhookUrl;
    }

    if (combined.includes('webhook') && combined.includes('secret')) {
      return RAZORPAY_DEFAULTS.webhookSecret;
    }
  }

  if (field?.type === 'url' || combined.includes('url')) {
    return `https://merchant.demo.example/${providerName}/${fieldName || 'callback'}`;
  }

  if (combined.includes('merchant') && combined.includes('id')) {
    return `MERCHANT_${randomAlphaNumeric(10)}`;
  }

  if (combined.includes('account')) {
    return `ACC_${randomAlphaNumeric(10)}`;
  }

  return `${providerName.toUpperCase()}_${randomAlphaNumeric(12)}`;
}
