import axiosInstance from 'src/utils/axios';

export const STATIC_KYC_PDF_PATHS = {
  panCard: '/pdfs/kyb/pan_card_demo.pdf',
  financialStatementYear1: '/pdfs/kyb/financial_statement_year_1.pdf',
  addressProof: '/pdfs/kyb/address_proof_demo.pdf',
  bankProof: '/pdfs/kyb/bank_proof_demo.pdf',
};

function getFileNameFromPath(assetPath) {
  const parts = String(assetPath || '').split('/');

  return parts[parts.length - 1] || 'demo-document.pdf';
}

export async function fetchStaticPdfAsFile(assetPath, customFileName) {
  const response = await fetch(assetPath, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Unable to load static PDF from ${assetPath}`);
  }

  const blob = await response.blob();
  const fileName = customFileName || getFileNameFromPath(assetPath);

  return new File([blob], fileName, {
    type: blob.type || 'application/pdf',
    lastModified: Date.now(),
  });
}

export async function uploadStaticPdf({
  assetPath,
  fileName,
  fieldName = 'file',
  uploadUrl = '/files',
  axiosClient = axiosInstance,
}) {
  const file = await fetchStaticPdfAsFile(assetPath, fileName);
  const formData = new FormData();

  formData.append(fieldName, file);

  const response = await axiosClient.post(uploadUrl, formData);
  const uploadedFiles = response?.data?.files;
  const uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;

  if (!uploadedFile?.id) {
    throw new Error('File upload did not return a valid uploaded file');
  }

  return {
    file,
    uploadedFile,
    response,
  };
}
