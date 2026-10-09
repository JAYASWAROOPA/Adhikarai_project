const terminalStatuses = ['approved', 'verified', 'rejected'];

export const normalizeOfficerApplication = (record) => {
  const rawStatus = String(record.status || '').toLowerCase();
  let status = 'Pending';
  if (rawStatus.includes('reject')) status = 'Rejected';
  else if (rawStatus.includes('approv')) status = 'Approved';
  else if (rawStatus === 'verified' || rawStatus.includes('approved')) status = rawStatus.includes('approv') ? 'Approved' : 'Verified';
  else if (rawStatus.includes('document') && (rawStatus.includes('missing') || rawStatus.includes('request'))) status = 'Documents Missing';
  else if (rawStatus.includes('review') || rawStatus.includes('verification') || rawStatus.includes('correction')) status = 'Under Review';

  const submittedDate = record.appliedDate || record.submittedDate || '';
  const ageInDays = submittedDate ? Math.max(0, Math.floor((Date.now() - new Date(submittedDate).getTime()) / 86400000)) : 0;
  const docs = (record.attachedDocs || record.documents || []).map((doc) => {
    const name = typeof doc === 'string' ? doc : doc.name || doc.documentName || 'Document';
    return {
      name,
      status: record.documentsStatus?.[name] || (typeof doc === 'object' ? doc.status : '') || 'Needs review'
    };
  });

  return {
    ...record,
    applicationId: record.applicationId || record.id,
    applicantName: record.applicantName || record.citizenName || 'Applicant',
    schemeName: record.schemeName || record.scheme || 'Scheme not specified',
    submittedDate,
    status,
    priority: String(record.priority || (ageInDays > 14 ? 'High' : ageInDays > 7 ? 'Medium' : 'Normal')).toLowerCase(),
    daysPending: ageInDays,
    isPending: !terminalStatuses.some((value) => rawStatus.includes(value)),
    isOverdue: ageInDays > 7 && !terminalStatuses.some((value) => rawStatus.includes(value)),
    documents: docs,
    verificationHistory: record.verificationHistory || []
  };
};

export const formatOfficerDate = (value, options = { dateStyle: 'medium' }) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-IN', options).format(date);
};

export const getStatusColor = (status) => ({
  Pending: 'warning',
  'Under Review': 'info',
  'Documents Missing': 'warning',
  Verified: 'success',
  Approved: 'success',
  Rejected: 'error'
}[status] || 'default');
