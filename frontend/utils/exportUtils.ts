export const exportToCSV = (data: any[], filename: string) => {
    const csvData = data.map(row =>
      Object.values(row).join(',')
    ).join('\n');
  
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  export const exportToJSON = (data: any[], filename: string) => {
    const jsonData = JSON.stringify(data, null, 2);
  
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  