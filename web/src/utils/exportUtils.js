export const jsonToCSV = (json, headers) => {
  const headerRow = headers.join(',') + '\n';
  const rows = json.map(row => {
    return headers.map(header => {
      const val = row[header] || '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',');
  }).join('\n');
  return headerRow + rows;
};

export const downloadFile = (data, filename, type) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
